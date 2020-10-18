var express = require('express')
// 定义路由模块
var router = express.Router()
// 引入common模块
const common = require("../modules/common");
const {
    ObjectId
} = require('mongodb');

function getTopicCount(dbo) {
    var topicCount = dbo.collection("topicWorlds").find({
        topicStatus: 1
    }).count();
    return topicCount;
}

router.get("/violationAll", function (req, res) {
    // 获取得到页码和每页显示的条目数
    var pageNum = Number(req.query.pageNum);
    var pageSize = Number(req.query.pageSize);
    var skipValue = (pageNum - 1) * pageSize;

    common.getMongoClient().then(async function (client) {
        var dbo = client.db("newcapecForum");
        // 查询总条目数
        var topicCount = await getTopicCount(dbo);

        dbo.collection("topicWorlds").find({
            $or:[{topicStatus:1},{topicStatus:"1"}]
        }).skip(skipValue).limit(pageSize).toArray(function (err, result) {
            // 处理帖子id
            for (var i = 0; i < result.length; i++) {
                result[i]._id = result[i]._id.toString();
            }
            // 结合populars.art渲染数据
            res.render('violation.art', {
                topiclist: result,
                pageNum: pageNum,
                pageCount: topicCount % pageSize == 0 ? topicCount / pageSize : parseInt(topicCount / pageSize) + 1
            });
        })
    })

})

// /backstage/delteTopicById/{{topic._id}}
router.get("/recoverTopicById/:topicId", function (req, res) {
    var topicId = req.params.topicId;
    // 每访问一次,就记录一次
    common.getMongoClient().then((client) => {
        var dbo = client.db("newcapecForum"); // dbo就是指定的数据库对象

        dbo.collection("topicWorlds").updateOne({
            _id: ObjectId(topicId)
        }, {
            $set: {
                topicStatus: 0
            }
        }, function (err, dbRes) {
            if (err) throw err;
            client.close();
        })
    })

    // 获取得到页码和每页显示的条目数
    var pageNum = Number(req.query.pageNum);
    var pageSize = Number(req.query.pageSize);
    var skipValue = (pageNum - 1) * pageSize;

    common.getMongoClient().then(async function (client) {
        var dbo = client.db("newcapecForum");
        // 查询总条目数
        var topicCount = await getTopicCount(dbo);

        dbo.collection("topicWorlds").find({
            $or:[{topicStatus:1},{topicStatus:"1"}]
        }).skip(skipValue).limit(pageSize).toArray(function (err, result) {
            // 处理帖子id
            for (var i = 0; i < result.length; i++) {
                result[i]._id = result[i]._id.toString();
            }
            // 结合populars.art渲染数据
            res.render('violation.art', {
                topiclist: result,
                pageNum: result.length == 0 ? pageNum - 1 : pageNum,
                pageCount: topicCount % pageSize == 0 ? topicCount / pageSize : parseInt(topicCount / pageSize) + 1
            });
        })
    })

})

module.exports = router
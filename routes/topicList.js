var express = require('express')
// 定义路由模块
var router = express.Router()
// 引入common模块
const common = require("../modules/common");

function getTopicCount(dbo) {
    var topicCount = dbo.collection("topicWorlds").find().count();
    return topicCount;
}
// 定义topicList路由
router.get("/queryAllTopic", function (req, res) {
    // 获取得到页码和每页显示的条目数
    console.log(req.query);
    var pageNum = Number(req.query.pageNum);
    var pageSize = Number(req.query.pageSize);
    var skipValue = (pageNum - 1) * pageSize;

    common.getMongoClient().then(async function (client) {
        var dbo = client.db("newcapecForum");
        // 查询总条目数
        var topicCount = await getTopicCount(dbo);
        console.log("所有帖子的数量:" + topicCount);
        dbo.collection("topicWorlds").find({
        }).skip(skipValue).limit(pageSize).toArray(function (err, result) {
            // 处理帖子id
            for (var i = 0; i < result.length; i++) {
                result[i]._id = result[i]._id.toString();
            }
            // 结合topicList.art渲染数据
            res.render('topicList.art', {
                topiclist: result,
                pageNum: pageNum,
                pageCount: topicCount % pageSize == 0 ? topicCount / pageSize : parseInt(topicCount / pageSize) + 1
            });
        })
    })
})

router.get("/", function (req, res) {
    common.getMongoClient().then((client) => {
        var dbo = client.db("newcapecForum"); // dbo就是指定的数据库对象
        // 先查询所有的模块
        dbo.collection("users").find({}).toArray(async function (err, result) {
            res.render('uesrCenter.art', {
                result:result
            });
            client.close();
        })
    })
})

module.exports = router
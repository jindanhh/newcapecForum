var express = require('express');
const {
    ObjectId
} = require('mongodb');
var router = express.Router()
// 引入common模块
const common = require("../modules/common");

function getVisitedCount(dbo, moduleId) {
    var visitedCount = dbo.collection('topicWorlds').find({
        topicModule: moduleId,
        // topicStatus:0
    }).count();
    return visitedCount;
}

// 根据模块id查询所有帖子数据
router.get("/queryAll/:moduleId", function (req, res) {
    var moduleId = req.params.moduleId;
    // console.log('模块Id：' + moduleId);
    // console.log(req.query)
    var pageNum = Number(req.query.pageNum);
    var pageSize = Number(req.query.pageSize);
    var skipValue = (pageNum - 1) * pageSize;

    // var topicId = req.params.topicId;
    // topicId = topicId.substr(1, 24)
    // console.log("帖子Id:", topicId);
    // 每访问一次,就记录一次
    common.getMongoClient().then(async function (client) {
        var dbo = client.db("newcapecForum"); // dbo就是指定的数据库对象

        // 查询总条目数
        var visitedCount = await getVisitedCount(dbo, moduleId);
        // console.log(topicCount);
        dbo.collection('topicWorlds').find({
            topicModule: moduleId,
            topicStatus:0
        }).skip(skipValue).limit(pageSize).toArray(function (err, result) {
            // 处理帖子id
            for (var i = 0; i < result.length; i++){
                result[i]._id = result[i]._id.toString();
            }

            // 结合populars.art渲染数据
                res.render('topicWorlds.art', {
                    topiclist: result,
                    moduleId: moduleId,
                    pageNum: pageNum,
                    pageCount: visitedCount % pageSize == 0 ? visitedCount / pageSize : parseInt(visitedCount / pageSize) + 1
                });
            })
       }) 
})
    
// 新增帖子
router.post('/addTopic', function (req, res) {
    // console.log('新增帖子');
    // console.log(req.body);
    common.getMongoClient().then(function (client) {
        var dbo = client.db('newcapecForum');
        dbo.collection('topicWorlds').insertOne(req.body, function (err, resDb) {
            if (err) throw err;
            // 通过resDb.insertedCount可以获取插入的数量
            console.log('文档插入成功', resDb);
            if (resDb.insertedCount > 0) {
                res.json({
                    code: 1,
                    msg: 'addOk'
                });
            } else {
                res.json({
                    code: 1,
                    msg: 'addError'
                });
            }
            client.close();
        })
    })
})

// 定义获取帖子详情的路由
router.get('/queryOne/:topicId', function (req, res) {
    var topicId = req.params.topicId;
    // 记录访问次数
    common.getMongoClient().then((client) => {
        var dbo = client.db('newcapecForum');
        dbo.collection('topicWorlds').updateOne({
            _id:ObjectId(topicId)
        }, {
                $inc: {
                count:1
            }
        }, function (err, dbRes) {
                if (err) throw err;
                console.log('数据更新成功！', dbRes.result.nModified);
                client.close();
        })
    })
    
})
    


module.exports = router
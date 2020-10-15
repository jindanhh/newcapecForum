var express = require('express');
const {
    ObjectId
} = require('mongodb');
var router = express.Router()
// 引入common模块
const common = require("../modules/common");

function getVisitedCount(dbo, moduleName) {
    var visitedCount = dbo.collection('topicWorlds').find({
        moduleName: moduleName
    }).count();
    return visitedCount;
}

// 根据模块name查询所有帖子数据
router.get("/queryAll/:moduleName", function (req, res) {
    var moduleName = req.params.moduleName;
    var pageNum = Number(req.query.pageNum);
    var pageSize = Number(req.query.pageSize);
    var skipValue = (pageNum - 1) * pageSize;
    var moduleArr;
    // 每访问一次,就记录一次
    common.getMongoClient().then(async function (client) {
        var dbo = client.db("newcapecForum"); // dbo就是指定的数据库对象
        // 查询总条目数
        var visitedCount = await getVisitedCount(dbo, moduleName);
        dbo.collection('topicModules').find({
            moduleName: moduleName
        }).toArray(function (res,result) {
            moduleArr = result
        })
        dbo.collection('topicWorlds').find({
            moduleName: moduleName,
            $or:[{topicStatus: 0},{topicStatus:"0"}]
            
        }).skip(skipValue).limit(pageSize).toArray(function (err, result) {
            // 处理帖子id            
            for (var i = 0; i < result.length; i++){
                result[i]._id = result[i]._id.toString();               
            }
            var topiclist = result;
            // 结合populars.art渲染数据
                res.render('topicWorlds.art', {
                    topiclist: topiclist,
                    moduleName: moduleName,
                    pageNum: pageNum,
                    moduleArr:moduleArr,
                    pageCount: visitedCount % pageSize == 0 ? visitedCount / pageSize : parseInt(visitedCount / pageSize) + 1
                });
            
        })

    }) 
       
})

// 渲染发帖页面
router.get("/posted", function (req, res) {
    // 当我们去渲染index.art的时候,这里面的data数据其实就是从数据库里面查询得到的数据
    var topicModules = [];
    common.getMongoClient().then((client) => {
        var dbo = client.db("newcapecForum"); // dbo就是指定的数据库对象
        // 先查询所有的模块
        dbo.collection("topicModules").find({}).toArray(async function (err, result) {
            var topicModulesArr = result;
            // 根据每个模块的_id去populars中查询对应的文档
            for (var i = 0; i < topicModulesArr.length; i++) {
                var obj = {
                    moduleName: topicModulesArr[i].moduleName,
                    topicModule:topicModulesArr[i].modId,
                    moduleImg:topicModulesArr[i].moduleImg
                }
                topicModules.push(obj);
            }
            res.render('posted.art', {
                topicModules: topicModules
            });
            client.close();
        })
    })
})

// 新增帖子
router.post('/addTopic', function (req, res) {
    req.body.topicStatus = 0;
    req.body.visitedCount = 0;
    req.body.topicReply =[] ;
    // var topicContent = req.body.topicContent.toString();
    // console.log(typeof topicContent)
    common.getMongoClient().then(function (client) {
        var dbo = client.db('newcapecForum');
        dbo.collection('topicWorlds').insertOne(req.body, function (err, resDb) {
            if (err) throw err;
            // 通过resDb.insertedCount可以获取插入的数量
            console.log('文档插入成功');            
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
    // console.log("帖子ID:" + topicId);
    // 记录访问次数
    common.getMongoClient().then((client) => {
        var dbo = client.db('newcapecForum');
        dbo.collection('topicWorlds').updateOne({
            _id: ObjectId(topicId)
        }, {
                $inc: {
                visitedCount:1
            }
        }, function (err, dbRes) {
                if (err) throw err;
                client.close();
        })
    })
    common.getMongoClient().then((client) => {
        var dbo = client.db("newcapecForum"); // dbo就是指定的数据库对象

        dbo.collection("topicWorlds").find({
            _id: ObjectId(topicId)
        }).toArray(function (err, result) {
            res.render("details.art",{
                topiclist:result
            })
        })
    })
    
})

module.exports = router
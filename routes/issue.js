var express = require('express')
// 定义路由模块
var router = express.Router()
// 引入common模块
const common = require("../modules/common");
const {
    ObjectId
} = require('mongodb');

function getTopicCount(dbo) {
    var topicCount = dbo.collection("questionModule").find({
        $or:[{questionStatus:0},{questionStatus:"0"}] 
    }).count();
    return topicCount;
}

//查询全部正常的问题
router.get("/issueAll", function (req, res) {
    
    // 获取得到页码和每页显示的条目数
   
    var pageNum = Number(req.query.pageNum);
    var pageSize = Number(req.query.pageSize);
    var skipValue = (pageNum - 1) * pageSize;

    common.getMongoClient().then(async function (client) {
        var dbo = client.db("newcapecForum");
        // 查询总条目数
        var topicCount = await getTopicCount(dbo);
      

        dbo.collection("questionModule").find({
            $or:[{questionStatus:0},{questionStatus:"0"}] 
        }).skip(skipValue).limit(pageSize).toArray(function (err, result) {
            // 处理帖子id
            for (var i = 0; i < result.length; i++) {
                result[i]._id = result[i]._id.toString();
            }
         
            // 结合populars.art渲染数据
            res.render('issue.art', {
                topiclist: result,
                pageNum: pageNum,
                pageCount: topicCount % pageSize == 0 ? topicCount / pageSize : parseInt(topicCount / pageSize) + 1
            });
        })
    })

})
//查询问题回收站
router.get("/issueDelAll", function (req, res) {
    
    // 获取得到页码和每页显示的条目数
   
    var pageNum = Number(req.query.pageNum);
    var pageSize = Number(req.query.pageSize);
    var skipValue = (pageNum - 1) * pageSize;

    common.getMongoClient().then(async function (client) {
        var dbo = client.db("newcapecForum");
        // 查询总条目数
        var topicCount = await getTopicCount(dbo);
      

        dbo.collection("questionModule").find({
            $or:[{questionStatus:2},{questionStatus:"2"}] 
        }).skip(skipValue).limit(pageSize).toArray(function (err, result) {
            // 处理帖子id
            for (var i = 0; i < result.length; i++) {
                result[i]._id = result[i]._id.toString();
            }
         
            // 结合populars.art渲染数据
            res.render('issuedel.art', {
                topiclist: result,
                pageNum: pageNum,
                pageCount: topicCount % pageSize == 0 ? topicCount / pageSize : parseInt(topicCount / pageSize) + 1
            });
        })
    })

})
//删除问题
router.get("/delteIssueById/:topicId", function (req, res) {
    var topicId = req.params.topicId;
     // 每访问一次,就记录一次
    common.getMongoClient().then((client) => {
        var dbo = client.db("newcapecForum"); // dbo就是指定的数据库对象

        dbo.collection("questionModule").updateOne({
            _id: ObjectId(topicId)
        }, {
            $set: {
                questionStatus: 2
            }
        }, function (err, dbRes) {
            if (err) throw err;
            console.log("帖子已删除成功!", dbRes.result.nModified);
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
     

        dbo.collection("questionModule").find({
            $or:[{questionStatus:0},{questionStatus:"0"}] 
        }).skip(skipValue).limit(pageSize).toArray(function (err, result) {
            // 处理帖子id
            for (var i = 0; i < result.length; i++) {
                result[i]._id = result[i]._id.toString();
            }
            // 结合populars.art渲染数据
            res.render('issue.art', {
                topiclist: result,
                pageNum: result.length == 0 ? pageNum - 1 : pageNum,
                pageCount: topicCount % pageSize == 0 ? topicCount / pageSize : parseInt(topicCount / pageSize) + 1
            });
        })
    })

})
//恢复问题
router.get("/recIssueById/:topicId", function (req, res) {
    var topicId = req.params.topicId;
     // 每访问一次,就记录一次
    common.getMongoClient().then((client) => {
        var dbo = client.db("newcapecForum"); // dbo就是指定的数据库对象

        dbo.collection("questionModule").updateOne({
            _id: ObjectId(topicId)
        }, {
            $set: {
                questionStatus: 0
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
     

        dbo.collection("questionModule").find({
            $or:[{questionStatus:2},{questionStatus:"2"}] 
        }).skip(skipValue).limit(pageSize).toArray(function (err, result) {
            // 处理帖子id
            for (var i = 0; i < result.length; i++) {
                result[i]._id = result[i]._id.toString();
            }
            // 结合populars.art渲染数据
            res.render('issuedel.art', {
                topiclist: result,
                pageNum: result.length == 0 ? pageNum - 1 : pageNum,
                pageCount: topicCount % pageSize == 0 ? topicCount / pageSize : parseInt(topicCount / pageSize) + 1
            });
        })
    })

})
module.exports = router
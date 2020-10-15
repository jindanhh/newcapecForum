var express = require('express');
const {
    ObjectId
} = require('mongodb');
var router = express.Router()
// 引入common模块
const common = require("../modules/common");



// 新增帖子
router.post("/addTopic", function (req, res) {
    console.log("新增帖子");
    console.log(req.body);
    common.getMongoClient().then(function (client) {
        var dbo = client.db("newcapecForum");
        dbo.collection("topicWorlds").insertOne(req.body, function (err, resDb) {
            if (err) throw err;
            // 通过res.insertedCount可以获取插入的数量
            console.log("文档插入成功", resDb);
            if (resDb.insertedCount > 0) {
                res.json({
                    code: 1,
                    msg: "addOk"
                });
            } else {
                res.json({
                    code: 1,
                    msg: "addError"
                });
            }
            client.close();
        });
    })
})




module.exports = router
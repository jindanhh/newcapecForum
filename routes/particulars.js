var express = require('express')
// 定义路由模块
var router = express.Router()
// 引入common模块
const common = require("../modules/common");
const {
    ObjectId
} = require('mongodb');

router.get("/renderTopic/:contentId", function (req, res) {
    // 获取得到页码和每页显示的条目数
    var contentId = req.params.contentId;
    common.getMongoClient().then(async function (client) {
        var dbo = client.db("newcapecForum");
        // 查询总条目数
        // var topicCount = await getTopicCount(dbo);
        dbo.collection("topicWorlds").find({
            _id: ObjectId(contentId)
        }).limit(1).toArray(function (err, result) {
            // 结合populars.art渲染数据
            for (var i = 0; i < result.length; i++) {
                result[i]._id = result[i]._id.toString();
            }
            res.render('particulars.art', {
                topiclist: result[0],
            });
        })
    })

})

// /backstage/delteTopicById/{{topic._id}}




module.exports = router
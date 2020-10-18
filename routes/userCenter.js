var express = require('express')
// 定义路由模块
var router = express.Router()
// 引入common模块
const common = require("../modules/common");

function getTopicName(dbo, moduleId) {
    var topicUserName = dbo.collection("users").find({
        moduleId: moduleId,
    });
    return topicUserName;
}

router.get("/", function (req, res) {
    res.render("userCenter.art", {})
})




module.exports = router
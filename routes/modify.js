var express = require('express')
// 定义路由模块
var router = express.Router()
// 引入common模块
const common = require("../modules/common");

// 定义topicList路由
router.get("/", function (req, res) {
    common.getMongoClient().then((client) => {
        var dbo = client.db("newcapecForum"); // dbo就是指定的数据库对象

        // 先查询所有的模块
        dbo.collection("users").find({
        }).toArray(async function (err, result) {
            console.log(result);
            // console.log(window.localStorage);
            res.render('modify.art', {
                result: result
            });
            client.close();
        })
    })
})

module.exports = router
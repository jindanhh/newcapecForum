var express = require('express')
var router = express.Router()
// 引入common模块
const common = require("../modules/common");

// 定义用户登录
router.post('/login', (req, res) => {
    console.log(req.body);
    common.getMongoClient().then((client) => {
        // 通过client对象链接到指定的数据库
        var dbo = client.db("newcapecForum"); // dbo就是指定的数据库对象

        dbo.collection("users").find(req.body).toArray(function (err, result) {
            if (err) throw err;
            if (result.length > 0) {
                res.json({
                    code: 3,
                    msg: "1"
                });
            } else {
                res.json({
                    code: 3,
                    msg: "0"
                });
            }
            // 关闭客户端
            client.close();
        })
    })
})

// 定义判断用户名唯一
router.post("/checkPhoneUnique", function (req, res) {
    console.log(req.body);
    // 根据手机号去数据库里面查询
    common.getMongoClient().then((client) => {
        // 通过client对象链接到指定的数据库
        var dbo = client.db("newcapecForum"); // dbo就是指定的数据库对象

        dbo.collection("users").find(req.body).toArray(function (err, result) {
            if (err) throw err;
            if (result.length > 0) {
                res.json({
                    code: 2,
                    msg: "1"
                });
            } else {
                res.json({
                    code: 2,
                    msg: "0"
                });
            }
            // 关闭客户端
            client.close();
        })
    })

})



module.exports = router
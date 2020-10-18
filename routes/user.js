const express = require('express');
var router = express.Router();
const common = require('../modules/common');

// 定义用户注册
router.post('/reg', (req, res) => {
    

    common.getMongoClient().then((client) => {
        var dbo = client.db("newcapecForum");
        req.body.userIntegral = 200;
        req.body.userReply = 0;
        req.body.userFocus = 0;
        req.body.userStatus = 0;

        dbo.collection("users").insertOne(req.body, function (err, dbres) {
            if (err) throw err;
            if (dbres.insertedCount > 0) {
                res.json({
                    code: 1,
                    msg: "regOK"
                });
            } else {
                res.json({
                    code: 0,
                    msg: "regError"
                });
            }
            // 关闭客户端
            client.close();
        })
    })

})

// 判断手机号是否唯一
router.post("/checkPhoneUnique", function (req, res) {
<<<<<<< HEAD
    // console.log(req.body);
=======
>>>>>>> 1e51494e88e77205dc7f7ea169c196a7c2c7f12d
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


// 定义用户登录
router.post('/login', (req, res) => {
<<<<<<< HEAD
    // console.log(req.body);
=======
>>>>>>> 1e51494e88e77205dc7f7ea169c196a7c2c7f12d
    common.getMongoClient().then((client) => {
        // 通过client对象链接到指定的数据库
        var dbo = client.db("newcapecForum"); // dbo就是指定的数据库对象

        dbo.collection("users").find(req.body).toArray(function (err, result) {
            if (err) throw err;
            if (result.length > 0) {
                res.json({
                    code: 3,
                    msg: "1",
                    userInfo:result[0]
                });
            } else {
                res.json({
                    code: 3,
                    msg: "0"
                });
            }
            // dbo.collection("users").find({
            // }).toArray(function (err2, result) {
            //     var userArr = result;
            //     res.render('details.art', {
            //         userArr: userArr
            //     });
            // })
            // 关闭客户端
            client.close();
        })
    })
})
router.post('/adminLogin', (req, res) => {
    console.log(req.body);
    common.getMongoClient().then((client) => {
        // 通过client对象链接到指定的数据库
        var dbo = client.db("newcapecForum"); // dbo就是指定的数据库对象

        dbo.collection("admin").find(req.body).toArray(function (err, result) {
            // console.log("数据库响应数据",result)
            if (err) throw err;
            if (result.length > 0) {
                res.json({
                    code: 3,
                    msg: "1",
                    userInfo:result[0]
                });
            } else {
                res.json({
                    code: 3,
                    msg: "0"
                });
            }
            client.close();
        })
    })
})


// 定义用户修改
router.post('/modify', (req, res) => {
   console.log("我是data");
   console.log("woshidata",req.body);
   console.log(req.body.phone)

    common.getMongoClient().then((client) => {
        var dbo = client.db("newcapecForum");
        dbo.collection("users").updateOne({
            "userTel":req.body.phone,
        },{
            $set: {
                "userPwd": req.body.newPassword,
                "userName": req.body.newUserName,
            }
        }, function (err, dbres) {
            if (err) throw err;
            if (dbres.updateCount > 0) {
                res.json({
                    code: 1,
                    msg: "regOK",
                    userInfo:result[0]
                });
            } else {
                res.json({
                    code: 0,
                    msg: "regError"
                });
            }
            // 关闭客户端
            client.close();
        })
    })

})

module.exports = router
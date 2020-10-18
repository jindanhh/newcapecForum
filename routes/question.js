var express = require('express');
var router = express.Router()
const {
    ObjectId
} = require('mongodb');
const common = require('../modules/common');

// 根据标签查询问题表
function getQuestionModuleByTid(dbo, id) {
    return new Promise(function (resolve, reject) {
        dbo.collection("questionModule").find({
            tid: id
        }).toArray(function (err, questionModule) {
            if (err) throw err;
            for (var i = 0; i < questionModule.length; i++) {
                questionModule[i]._id = questionModule[i]._id.toString();
            }
            resolve(questionModule);
        })
    })
}

// 根据状态查询问题表
function getQuestionModuleBySid(dbo, id) {
    return new Promise(function (resolve, reject) {
        dbo.collection("questionModule").find({
            sid: id
        }).toArray(function (err, questionModule) {
            if (err) throw err;
            for (var i = 0; i < questionModule.length; i++) {
                questionModule[i]._id = questionModule[i]._id.toString();
            }
            resolve(questionModule);
        })
    })
}

// 根据id查询用户表
function getUserModuleById(dbo, id) {
    return new Promise(function (resolve, reject) {
        dbo.collection("userModule").find({
            _id: ObjectId(id)
        }).toArray(function (err, userModule) {
            if (err) throw err;

            for (var i = 0; i < userModule.length; i++) {
                userModule[i]._id = userModule[i]._id.toString();
            }
            resolve(userModule[0]);
        })
    })
}

// 根据id查询标签表
function getTagModuleById(dbo, id) {
    return new Promise(function (resolve, reject) {
        dbo.collection("tagModule").find({
            _id: ObjectId(id)
        }).toArray(function (err, tagModule) {
            if (err) throw err;

            for (var i = 0; i < tagModule.length; i++) {
                tagModule[i]._id = tagModule[i]._id.toString();
            }
            resolve(tagModule[0]);
        })
    })
}

// 根据id查询状态表
function getStatusModuleById(dbo, id) {
    return new Promise(function (resolve, reject) {
        dbo.collection("statusModule").find({
            _id: ObjectId(id)
        }).toArray(function (err, statusModule) {
            if (err) throw err;

            for (var i = 0; i < statusModule.length; i++) {
                statusModule[i]._id = statusModule[i]._id.toString();
            }
            resolve(statusModule[0]);
        })
    })
}

// 直接获取问题表
function getQuestionModule(dbo) {
    return new Promise(function (resolve, reject) {
        dbo.collection("questionModule").find({}).toArray(function (err, questionModule) {
            if (err) throw err;
            for (var i = 0; i < questionModule.length; i++) {
                questionModule[i]._id = questionModule[i]._id.toString();
            }
            resolve(questionModule);
        })
    })
}

// 直接获取状态表
function getStatusModule(dbo) {
    return new Promise(function (resolve, reject) {
        dbo.collection("statusModule").find({}).toArray(function (err, questionModule) {
            if (err) throw err;
            for (var i = 0; i < questionModule.length; i++) {
                questionModule[i]._id = questionModule[i]._id.toString();
            }
            resolve(questionModule);
        })
    })
}

// 根路由
router.get("/", function (req, res) {

    common.getMongoClient().then(async function (client) {

        var dbo = client.db("newcapecForum");

        dbo.collection("tagModule").find({}).toArray(async function (err, tagModule) {
            // 查询所有的模块: 列出来标题
            var modules = tagModule;
            // console.log(modules);
            for (var i = 0; i < modules.length; i++) {
                modules[i]._id = modules[i]._id.toString();
            }

            // 进入首页，查询问题表
            var questionModule = await getQuestionModule(dbo);
            // console.log(questionModule);

            // 进入首页，查询状态表
            var statusModule = await getStatusModule(dbo)

            for (var j = 0; j < questionModule.length; j++) {

                var questionModuleUid = questionModule[j].uid;
                var questionModuleTid = questionModule[j].tid;
                var questionModuleSid = questionModule[j].sid;

                var userInfo = await getUserModuleById(dbo, questionModuleUid);
                questionModule[j].userData = userInfo;

                var tagInfo = await getTagModuleById(dbo, questionModuleTid);
                questionModule[j].tagData = tagInfo;

                var statusInfo = await getStatusModuleById(dbo, questionModuleSid);
                questionModule[j].statusData = statusInfo;
            }

            console.log(questionModule);

            res.render("question.art", {
                tagModule: modules,
                questionModule: questionModule,
                statusModule: statusModule
            })

            client.close();
        })
    })
})

// 一级路由
router.get("/:id", function (req, res) {

    var id = req.params.id;

    common.getMongoClient().then(async function (client) {

        var dbo = client.db("newcapecForum");

        dbo.collection("tagModule").find({}).toArray(async function (err, tagModule) {
            var modules = tagModule;
            for (var i = 0; i < modules.length; i++) {
                modules[i]._id = modules[i]._id.toString();
            }

            var questionModuleByTid = await getQuestionModuleByTid(dbo, id)

            var questionModuleBySid = await getQuestionModuleBySid(dbo, id)

            var statusModule = await getStatusModule(dbo)

            for (var j = 0; j < questionModuleByTid.length; j++) {

                var questionModuleUid = questionModuleByTid[j].uid;
                var userInfo = await getUserModuleById(dbo, questionModuleUid);
                questionModuleByTid[j].userData = userInfo;

                var questionModuleTid = questionModuleByTid[j].tid;
                var tagInfo = await getTagModuleById(dbo, questionModuleTid)
                questionModuleByTid[j].tagData = tagInfo;

                var questionModuleSid = questionModuleByTid[j].sid;
                var statusInfo = await getStatusModuleById(dbo, questionModuleSid)
                questionModuleByTid[j].statusData = statusInfo;
            }
            // console.log(questionModuleByTid);

            for (var m = 0; m < questionModuleBySid.length; m++) {

                var questionModuleUid = questionModuleBySid[m].uid;
                var userInfo = await getUserModuleById(dbo, questionModuleUid);
                questionModuleBySid[m].userData = userInfo;

                var questionModuleTid = questionModuleBySid[m].tid;
                var tagInfo = await getTagModuleById(dbo, questionModuleTid)
                questionModuleBySid[m].tagData = tagInfo;

                var questionModuleSid = questionModuleBySid[m].sid;
                var statusInfo = await getStatusModuleById(dbo, questionModuleSid)
                questionModuleBySid[m].statusData = statusInfo;
            }
            // console.log(questionModuleBySid);

            res.render("question.art", {
                tagModule: modules,
                statusModule: statusModule,
                questionModuleByTid: questionModuleByTid,
                questionModuleBySid: questionModuleBySid
            })

            client.close();
        })
    })
})

// 二级路由
router.get("/questionDetail/:id", function (req, res) {

    var id = req.params.id;
    // console.log(id);

    common.getMongoClient().then(async function (client) {

        var dbo = client.db("newcapecForum");

        dbo.collection("questionModule").find({
            _id: ObjectId(id)
        }).toArray(async function (err, questionModule) {
            // console.log(questionModule[0]);

            var tagModuleById = await getTagModuleById(dbo, questionModule[0].tid)
            questionModule[0].tagData = tagModuleById
            // console.log(questionModule[0]);

            var userModuleById = await getUserModuleById(dbo, questionModule[0].uid)
            questionModule[0].userData = userModuleById
            // console.log(questionModule[0]);

            var statusModuleById = await getStatusModuleById(dbo, questionModule[0].sid)
            questionModule[0].statusData = statusModuleById
            console.log(questionModule[0]);

            res.render("questionDetail.art", {
                questionModule: questionModule[0]
            })

            client.close();
        })
    })
})
module.exports = router;
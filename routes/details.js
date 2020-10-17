var express = require('express')
var router = express.Router()
const common = require("../modules/common");
// 引入multer模块
const multer = require('multer');
const { ObjectId } = require('mongodb');
let posted = multer({
    storage: multer.diskStorage({
        // 配置上传文件夹
        destination: function (req, file, cb) {
            cb(null, './posteds/');
        },
        // 配置上传文件的文件名
        filename: function (req, file, cb) {
            var changedName = (new Date().getTime()) + '-' + file.originalname;
            cb(null, changedName);
        }
    })
});

// 新增回复
router.post('/addReply', function (req, res) {
    var updatReply = req.body;
    common.getMongoClient().then(function (client) {
        var dbo = client.db('newcapecForum');
        dbo.collection('topicWorlds').update({ _id: ObjectId(updatReply.replyId) }, {$push:{"topicReply":updatReply}},function (err, resDb) {
            if (err) throw err;         
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

//单个文件上传
router.post('/single', posted.single('singleFile'), (req, res) => {
    res.json({
        code: '0000',
        type: 'single',
        originalname: req.file.originalname,
        path: req.file.filename
    })
});

//多个文件上传
router.post('/multer', posted.array('multerFile'), (req, res) => {
    let fileList = [];
    req.files.map((elem) => {
        fileList.push({
            originalname: elem.originalname
        })
    });
    res.json({
        code: '0000',
        type: 'multer',
        fileList: fileList
    });
});
module.exports = router
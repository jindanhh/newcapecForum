var express = require('express')
var router = express.Router()
// 引入multer模块
const multer = require('multer')
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
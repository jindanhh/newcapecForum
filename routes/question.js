var express = require('express')
var router = express.Router()
const common = require('../modules/common');

router.get("/", function (req, res) {
    common.getMongoClient().then(function (client) {
        var dbo = client.db("newcapecForum");
        var questionModule = [];
        dbo.collection("questionModule").find({}).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            questionModule = result;
            res.render("question.art", {
                questionModule: questionModule
            })
            client.close();
        })
    })
})

module.exports = router;
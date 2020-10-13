var express = require('express')
var router = express.Router()
// 引入common模块
const common = require("../modules/common");


function getTopicDataById(dbo, modId) {
    return new Promise(function (resolve, reject) {
        dbo.collection("topicWorlds").find({
            topicModule: modId
        }).sort({
            count: -1
        }).limit(4).toArray(function (err, topicResult) {
            for (var i = 0; i < topicResult.length; i++){
                topicResult[i]._id = topicResult[i]._id.toString();
            }
            resolve(topicResult);
        })
    })
}


// 定义首页路由
router.get("/", function (req, res) {
    // 当我们去渲染index.art的时候,这里面的data数据其实就是从数据库里面查询得到的数据
    var topicModules = [];
    common.getMongoClient().then((client) => {
        var dbo = client.db("newcapecForum"); // dbo就是指定的数据库对象
        // 先查询所有的模块
        dbo.collection("topicModules").find({}).toArray(async function (err, result) {
            var topicModulesArr = result;
            // 根据每个模块的_id去populars中查询对应的文档
            for (var i = 0; i < topicModulesArr.length; i++) {
                var modId = topicModulesArr[i]._id.toString();
                // console.log(modId)
                // await 等待,等待异步执行完成
                var topicData = await getTopicDataById(dbo, modId); 
                // console.log(topicData)
                var obj = {
                    moduleName: topicModulesArr[i].moduleName,
                    topicModule:modId,
                    topicWorlds: topicData
                }
                // console.log(obj)
                topicModules.push(obj);
            }
            res.render('index.art', {
                topicModules: topicModules
            });

            client.close();
        })
    })

})

module.exports = router
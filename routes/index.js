var express = require('express')
var router = express.Router()
// 引入common模块
const common = require("../modules/common");


function getTopicDataName(dbo, modName) {
    return new Promise(function (resolve, reject) {
        dbo.collection("topicWorlds").find({
            topicName: modName
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
        dbo.collection("topicModules").find({
            $or:[{moduleStatus:0},{moduleStatus:"0"}] ,
        }).toArray(async function (err, result) {
            var topicModulesArr = result;
            // 根据每个模块的_id去populars中查询对应的文档
            for (var i = 0; i < topicModulesArr.length; i++) {
                var modName = topicModulesArr[i].topicName;
                // await 等待,等待异步执行完成
                var topicData = await getTopicDataName(dbo, modName); 
                var obj = {
                    moduleName: topicModulesArr[i].moduleName,
                    topicModule:topicModulesArr[i].modId,
                    topicWorlds: topicData,
                    moduleImg:topicModulesArr[i].moduleImg
                }
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
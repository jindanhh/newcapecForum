const express = require('express');
const app = express();
const path = require('path');

// 后台合并
var bodyParse = require('body-parser');
const user = require('./routes/user')
const backTopic = require('./routes/backTopic');
const particulars = require('./routes/particulars');
const violation = require('./routes/violation');
const remove = require('./routes/remove');
const newpop = require('./routes/newpop');
const member = require('./routes/member');
const memberDel = require('./routes/memberDel');
const target = require('./routes/target');
const newtarget = require('./routes/newtarget');
const issue = require('./routes/issue');


// 用户
const topicList = require('./routes/topicList')
const userTalk = require('./routes/userTalk')
const userCenter = require('./routes/userCenter')
const modify = require('./routes/modify')

// 引入路由
const index = require('./routes/index');
const topic = require('./routes/topic');
const posted  = require('./routes/posted');
const details  = require('./routes/details');

app.use(bodyParse.urlencoded({ extended: false }));
// 静态资源托管
app.use(express.static("public"))
app.use(express.static('posteds'))

// 渲染引擎设置
app.engine('art', require('express-art-template'));
app.set('view options', {
    debug: process.env.NODE_ENV !== 'production'
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'art');

// 用来解析 application/json
app.use(express.json())
// 用来解析 application/x-www-form-urlencoded
app.use(express.urlencoded({
    extended: true
}))

// 加载前台路由模块
app.use('/', index);
app.use('/index', index);
app.use('/topic', topic);
app.use('/posted', posted);
app.use('/details', details);

// 用户
app.use('/topicList', topicList)
app.use('/userTalk', userTalk)
app.use('/userCenter', userCenter)
app.use('/modify', modify)

// 加载后台路由模块
app.use('/backTopic',backTopic)
app.use('/violation',violation)
app.use('/newpop',newpop)
app.use('/remove',remove)
app.use('/user', user)
app.use('/member',member)
app.use('/memberDel',memberDel)
app.use('/target',target)
app.use('/newtarget', newtarget)
app.use('/particulars', particulars)
app.use('/issue', issue)

app.get('/backIndex',function(req,res){
    res.sendfile('public/backManger.html') ;
}) ;

app.listen(3000, () => {
    console.log(`Example app listening on port 3000!`)
})

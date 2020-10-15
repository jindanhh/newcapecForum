// file name :app.js
// create by guofw 2018-5-4
var express             = require('express');
var app                 = express();
var bodyParse           = require('body-parser');

var path = require('path');
const user = require('./routes/user')
const topic = require('./routes/topic');
const violation = require('./routes/violation');
const remove = require('./routes/remove');
const newpop = require('./routes/newpop');
const member = require('./routes/member');
const memberDel = require('./routes/memberDel');
const target = require('./routes/target');
const newtarget = require('./routes/newtarget');
// const particulars = require('./routes/particulars');
app.use(bodyParse.urlencoded({extended:false})) ;

// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'))


// 渲染引擎设置
app.engine('art', require('express-art-template'));
app.set('view options', {
    debug: process.env.NODE_ENV !== 'production'
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'art');


// 处理根目录的get请求
app.get('/',function(req,res){
    res.sendfile('public/index.html') ;
}) ;
// 加载topic.js路由
app.use('/topic',topic)
app.use('/violation',violation)
app.use('/newpop',newpop)
app.use('/remove',remove)
app.use('/user', user)
app.use('/member',member)
app.use('/memberDel',memberDel)
app.use('/target',target)
app.use('/newtarget',newtarget)
// app.use('/particulars',particulars)
// 用来解析 application/json
app.use(express.json())
// 用来解析 application/x-www-form-urlencoded
app.use(express.urlencoded({
    extended: true
}))



// 监听3000端口
app.listen(3000, () => {
    console.log(`Example app listening on port 3000!`)
})
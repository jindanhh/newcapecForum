const express = require('express');
const app = express();
const path = require('path');
// 引入路由
const index = require('./routes/index');
const topic = require('./routes/topic');
const posted  = require('./routes/posted');

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

// 加载路由模块
app.use('/', index);
app.use('/index', index);
app.use('/topic', topic);
app.use('/posted', posted);

app.listen(3000, () => {
    console.log(`Example app listening on port 3000!`)
})

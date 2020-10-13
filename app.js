const express = require('express');
const app = express();
const path = require('path');
const question = require('./routes/question');
// 静态资源托管
app.use(express.static("public"))

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

// 加载question.js路由
app.use("/question", question);

app.listen(3000, () => console.log(`Example app listening on port 3000!`))
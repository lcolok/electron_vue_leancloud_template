'use strict';

var express = require('express');
var timeout = require('connect-timeout');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var AV = require('leanengine');

// 加载云函数定义，你可以将云函数拆分到多个文件方便管理，但需要在主文件中加载它们
require('require-all')({
  dirname: __dirname + '/api',
  excludeDirs: /^public$/,
  filter: function (fileName) {
    if (fileName == 'tempCodeRunnerFile.js') return; //排除掉tempCodeRunnerFile.js这种临时生成的文件
    if (!fileName.match(/(.+)\.js$/)) return; //符合js命名格式的才能通过
    return fileName;
  },
})


var app = express();

// 设置模板引擎
app.set('views', path.join(__dirname, 'dist'));
var ejs = require('ejs');  //我是新引入的ejs插件,让express也能够加载html
app.engine('html', ejs.__express);
app.set('view engine', 'html');


// 设置默认超时时间
app.use(timeout('15s'));

// 加载云引擎中间件
app.use(AV.express());

app.enable('trust proxy');
app.use(AV.Cloud.HttpsRedirect());// 强制重定向到 HTTPS
app.use(express.static(path.join(__dirname, 'dist')));//利用 Express 托管静态文件

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// 可以将一类的路由单独保存在一个文件中
app.use('/todos', require('./routes/todos'));

app.get('/', function(req, res) {
  console.log(req);
  res.render('index', { currentTime: new Date() });
});



app.use(function(req, res, next) {
  // 如果任何一个路由都没有返回响应，则抛出一个 404 异常给后续的异常处理器
  if (!res.headersSent) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
});

// error handlers
app.use(function(err, req, res, next) {
  if (req.timedout && req.headers.upgrade === 'websocket') {
    // 忽略 websocket 的超时
    return;
  }

  var statusCode = err.status || 500;
  if (statusCode === 500) {
    console.error(err.stack || err);
  }
  if (req.timedout) {
    console.error('请求超时: url=%s, timeout=%d, 请确认方法执行耗时很长，或没有正确的 response 回调。', req.originalUrl, err.timeout);
  }
  res.status(statusCode);
  // 默认不输出异常详情
  var error = {};
  if (app.get('env') === 'development') {
    // 如果是开发环境，则将异常堆栈输出到页面，方便开发调试
    error = err;
  }
  res.render('index', {
    message: err.message,
    error: error
  });
});

module.exports = app;

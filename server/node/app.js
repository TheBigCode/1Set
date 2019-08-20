const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

// 路由集，可以功能分路由
// 每一个模块用一个路由，相当于一个控制器，这样写不知道好不好，暂时感觉这样不错
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const userRouter = require('./routes/user');
const manageRouter = require('./routes/manage');
const bannerRouter = require('./routes/banner');
const userManageRouter = require('./routes/user_manage');
const categoryManageRouter = require('./routes/category_manage');
const categoryRouter = require('./routes/category');
const wxRouter = require('./routes/wx');

const app = express();

app.all("*", function(req, res, next) {
    if (!req.get("Origin")) return next();
    // use "*" here to accept any origin
    res.set("Access-Control-Allow-Origin","*");
    res.set("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.set("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, x-token");
    // res.set('Access-Control-Allow-Max-Age', 3600);
    if ("OPTIONS" === req.method) return res.sendStatus(200);
    next();
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret :  'j3bxun=aloyfvvg=**wjrhjq', // 对session id 相关的cookie 进行签名
    cookie : {maxAge : 1000 * 60 * 60 * 24}, // 设置 session 的有效时间，单位毫秒},
    resave : false,
    saveUninitialized: true, // 是否保存未初始化的会话
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/user', userRouter);
app.use('/manage', manageRouter);
app.use('/banner', bannerRouter);
app.use('/userManage', userManageRouter);
app.use('/categoryManage', categoryManageRouter);
app.use('/category', categoryRouter);
app.use('/wx', wxRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

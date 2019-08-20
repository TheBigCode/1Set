var express = require('express');
var router = express.Router();
const conn = require('../db/db');

/**
 * 用户名和密码登录
 */
router.post('/login_pwd', (req, res) => {
    json = JSON.parse(JSON.stringify(req.body));
    // 1. 获取数据
    const user_name = json.username;
    const user_pwd = json.password;
    // 3. 查询数据
    let sqlStr = "SELECT * FROM manage WHERE username = '" + user_name + "' LIMIT 1";
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({ err_code: 0, message: '用户不存在!' });
        } else {
            results = JSON.parse(JSON.stringify(results));
            if (results[0]) {  // 用户已经存在
                // 验证密码是否正确
                if (results[0].password !== user_pwd) {
                    res.json({ err_code: 0, message: '密码不正确!' });
                } else {
                    let id = results[0].id;
                    req.session.userId = id;
                    console.log('id:' + id)
                    // 返回数据给客户端
                    res.json({ token: id });
                }
            } else {
                res.json({ err_code: 0, message: '用户不存在!' });
            }
        }
    });
});

// 返回userinfo
router.get('/info', (req, res) => {
    // // 1. 获取数据
    const token = req.session.userId;
    if (!token) {
        res.json({ err_code: 0, message: '请重新登陆!' });
        return;
    }
    let sqlStr = "SELECT * FROM manage WHERE id = '" + token + "' LIMIT 1";
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({ err_code: 0, message: '用户不存在!' });
        } else {
            results = JSON.parse(JSON.stringify(results));

            if (results[0]) {  // 用户已经存在
                // 返回数据给客户端
                res.json({
                    name: results[0].name,
                    avatar: results[0].avatar,
                    introduction: results[0].introduction,
                    roles: results[0].roles.split(',')
                });

            } else {
                res.json({ err_code: 0, message: '用户不存在!' });
            }
        }
    });
});

module.exports = router;
/**
 * 用户管理（后台）接口
 */
const express = require('express');
const router = express.Router();
const conn = require('../db/db');
const time = require('../util/time_util')
const chinaTime = require('china-time');

router.get('/list', (req, res) => {
    let name = req.query.name;
    let sort = req.query.sort;
    // 1.1 数据库查询的语句
    let sqlStr;
    let sortStr = '';

    if (sort == '+id') {
        sortStr = ' ORDER BY id asc'
    } else if (sort == '-id') {
        sortStr = ' ORDER BY id desc'
    }

    if (name && name !== '') {
        sqlStr = "SELECT * FROM user WHERE username = '" + name + "'";
    } else {
        sqlStr = 'SELECT * FROM user';
    }

    sqlStr = sqlStr + sortStr;

    // 1.2 执行语句
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({ err_code: 0, message: '请求数据失败' });
        } else {
            res.json({ success_code: 200, message: '请求数据失败', items: results });
        }
    });
});

router.post('/update', (req, res) => {
    let id = req.body.id;
    let timestamp = chinaTime('YYYY-MM-DD HH:mm:ss');
    let status = req.body.status;
    if (timestamp) {
        timestamp = time.timestamp2date(timestamp);
    }
    if (!id) {
        res.json({ err_code: 0, message: '请求数据失败' });
        return;
    }

    // 1.1 数据库查询的语句
    let sqlStr = "SELECT * FROM user WHERE id = '" + id + "' LIMIT 1";
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({ err_code: 0, message: '请求数据失败' });
        } else {
            if (!results[0]) {
                res.json({ error_code: 1, message: '查无数据' });
            } else {
                let sql_str = "UPDATE user SET update_time = '" + timestamp + "', status = '" + status + "' WHERE id = '" + id + "'";
                conn.query(sql_str, (error, results, fields) => {
                    if (error) {
                        res.json({ err_code: 0, message: '修改失败!' });
                    } else {
                        res.json({ success_code: 200, message: '修改成功!' });
                    }
                });
            }
        }
    });
});
module.exports = router;
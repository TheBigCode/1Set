/**
 * 首页banner接口
 */
const express = require('express');
const router = express.Router();
const conn = require('../db/db');
const time = require('../util/time_util')
const chinaTime = require('china-time');

/**
 * 获取banner数据, 虽然和主页一样，提前做好差别
 */
router.get('/list', (req, res) => {
    let title = req.query.title;
    let sort = req.query.sort;
    // 1.1 数据库查询的语句
    let sqlStr;
    let sortStr = '';

    if (sort == '+id') {
        sortStr = ' ORDER BY id asc'
    } else if (sort == '-id') {
        sortStr = ' ORDER BY id desc'
    }

    if (title && title !== '') {
        sqlStr = "SELECT * FROM home_banner WHERE title = '" + title + "'";
    } else {
        sqlStr = 'SELECT * FROM home_banner';
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

// 更改单个banner状态
router.post('/modify_status', (req, res) => {
    let id = req.body.id;
    let status = req.body.status;
    let timestamp = chinaTime('YYYY-MM-DD HH:mm:ss');
    if (timestamp) {
        timestamp = time.timestamp2date(timestamp);
    }
    if (!id) {
        res.json({ err_code: 0, message: '请求数据失败' });
        return;
    }
    // 1.1 数据库查询的语句
    let sqlStr = "SELECT * FROM home_banner WHERE id = '" + id + "' LIMIT 1";
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({ err_code: 0, message: '请求数据失败' });
        } else {
            if (!results[0]) {
                res.json({ error_code: 1, message: '查无数据' });
            } else {
                let sql_str = "UPDATE home_banner SET status = '" + status + "', timestamp = '" + timestamp + "' WHERE id = '" + id + "'";
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

// 新更单个banner内容
router.post('/update', (req, res) => {
    let id = req.body.id;
    let title = req.body.title;
    let timestamp = chinaTime('YYYY-MM-DD HH:mm:ss');
    let no = req.body.no;
    let status = req.body.status;
    let image = req.body.image;
    let url = req.body.url;
    if (timestamp) {
        timestamp = time.timestamp2date(timestamp);
    }
    if (!id) {
        res.json({ err_code: 0, message: '请求数据失败' });
        return;
    }

    // 1.1 数据库查询的语句
    let sqlStr = "SELECT * FROM home_banner WHERE id = '" + id + "' LIMIT 1";
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({ err_code: 0, message: '请求数据失败' });
        } else {
            if (!results[0]) {
                res.json({ error_code: 1, message: '查无数据' });
            } else {
                let sql_str = "UPDATE home_banner SET title = '" + title + "', timestamp = '" + timestamp + "', no = " + no + ", status = '" + status + "', image = '" + image + "' , url = '" + url + "' WHERE id = '" + id + "'";
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

router.post('/delete', (req, res) => {
    let id = req.body.id;
    if (!id) {
        res.json({ err_code: 0, message: '请求数据失败' });
        return;
    }

    // 1.1 数据库查询的语句
    let sqlStr = "DELETE FROM home_banner WHERE id = '" + id + "' LIMIT 1";
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({ err_code: 0, message: '删除失败' });
        } else {
            res.json({ success_code: 200, message: '删除成功!' });
        }
    });
});

router.post('/create', (req, res) => {
    let title = req.body.title;
    let timestamp = chinaTime('YYYY-MM-DD HH:mm:ss');
    let no = req.body.no;
    let status = req.body.status;
    let image = req.body.image;
    let url = req.body.url;
    if (timestamp) {
        timestamp = time.timestamp2date(timestamp);
    }

    const addSql = "INSERT INTO home_banner(title, timestamp, no, status, image, url) VALUES (?, ?, ?, ?, ?, ?)";
    const addSqlParams = [title, timestamp, no, status, image, url];
    conn.query(addSql, addSqlParams, (error, results, fields) => {
        results = JSON.parse(JSON.stringify(results));
        if (!error) {
            let id = results.insertId;
            let sqlStr = "SELECT * FROM home_banner WHERE id = '" + id + "' LIMIT 1";
            conn.query(sqlStr, (error, results, fields) => {
                if (error) {
                    res.json({ err_code: 0, message: '请求数据失败' });
                } else {
                    // 返回数据给客户端
                    res.json({
                        success_code: 200,
                        message: '加入成功',
                        id: id
                    });
                }
            });
        }
    });
});

module.exports = router;
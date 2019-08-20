const express = require('express');
const router = express.Router();
/**
 * 后台分类相关接口
 */
const conn = require('../db/db');
const time = require('../util/time_util')
const chinaTime = require('china-time');

// 获取分类索引
router.get('/index', (req, res) => {

    let sqlStr = "SELECT * FROM category WHERE fid = '0'";
    // 1.2 执行语句
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({ err_code: 0, message: '请求数据失败' });
        } else {
            let items = []
            if (results[0]) {
                for (let i in results) {
                    let item = {}
                    item.id = results[i].id
                    item.name = results[i].name
                    item.icon = results[i].icon
                    item.status = results[i].status
                    let children = []
                    let fc = JSON.parse(results[i].children)
                    if (fc && fc[0]) {
                        for (let j in fc) {
                            children.push(fc[j])
                        }
                    }
                    item.children = children
                    items.push(item)
                }
            }
            res.json({ success_code: 200, message: '请求数据失败', items: items });
        }
    });
});

// 同步分类索引
router.get('/updateIndex', (req, res) => {

    let sqlStr = "SELECT * FROM category";
    // 1.2 执行语句
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({ err_code: 0, message: '请求数据失败' });
        } else {
            if (!results[0]) {
                res.json({ err_code: 0, message: '请求数据失败' });
            } else {
                let fary = []
                for (let i in results) {
                    let item = results[i];
                    if (item.fid == 0) {
                        fary.push(item)
                    }
                }
                if (!fary || fary.length <= 0) {
                    res.json({ success_code: 200, message: '无父类数据' });
                }
                let varList = {}
                let sqlStr = "UPDATE category SET children = CASE id"
                let sqlEnd = "END WHERE id IN ("
                for (let j in fary) {
                    let fitem = fary[j]
                    let fid = fitem.id
                    let fj = []
                    for (let k in results) {
                        let json = {}
                        citem = results[k]
                        if (citem.fid == fid) {
                            json.id = citem.id
                            json.name = citem.name
                            json.icon = citem.icon
                            json.status = citem.status
                            fj.push(json)
                        }
                    }
                    let sqlPath = " WHEN " + fid + " THEN '" + JSON.stringify(fj) + "' "
                    if (j == fary.length - 1) {
                        sqlEnd = sqlEnd + fid + ")"
                    } else {
                        sqlEnd = sqlEnd + fid + ","
                    }
                    sqlStr = sqlStr + sqlPath;
                }
                sqlStr = sqlStr + sqlEnd;
                conn.query(sqlStr, (error, results, fields) => {
                    if (error) {
                        res.json({ err_code: 0, message: '请求数据失败' });
                    } else {
                        res.json({ success_code: 200, message: '请求数据成功' });
                    }
                });
            }
        }
    });
});

// 分类列表
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
        sqlStr = "SELECT * FROM category WHERE name = '" + name + "'";
    } else {
        sqlStr = 'SELECT * FROM category';
    }

    sqlStr = sqlStr + sortStr;
    // 1.2 执行语句
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            console.log(error)
            res.json({ err_code: 0, message: '请求数据失败' });
        } else {
            res.json({ success_code: 200, message: '请求数据成功', items: results });
        }
    });
});

// 修改单个分类的状态
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
    let sqlStr = "SELECT * FROM category WHERE id = '" + id + "' LIMIT 1";
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({ err_code: 0, message: '请求数据失败' });
        } else {
            if (!results[0]) {
                res.json({ error_code: 1, message: '查无数据' });
            } else {
                let sql_str = "UPDATE category SET status = '" + status + "', updatetime = '" + timestamp + "' WHERE id = '" + id + "'";
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

// 更新单个分类的内容
router.post('/update', (req, res) => {
    let id = req.body.id;
    if (!id) {
        res.json({ err_code: 0, message: '请求数据失败' });
        return;
    }
    let name = req.body.name;
    let no = req.body.no;
    let status = req.body.status;
    let icon = req.body.icon;
    let fid = req.body.fid;

    let timestamp = chinaTime('YYYY-MM-DD HH:mm:ss');
    if (timestamp) {
        timestamp = time.timestamp2date(timestamp);
    }

    // 1.1 数据库查询的语句
    let sqlStr = "SELECT * FROM category WHERE id = '" + id + "' LIMIT 1";
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({ err_code: 0, message: '请求数据失败' });
        } else {
            if (!results[0]) {
                res.json({ error_code: 1, message: '查无数据' });
            } else {
                let sql_str = "UPDATE category SET name = '" + name + "', updatetime = '" + timestamp + "', no = " + no + ", status = '" + status + "', icon = '" + icon + "' , fid = " + fid + " WHERE id = '" + id + "'";
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

// 删除单个分类
router.post('/delete', (req, res) => {
    let id = req.body.id;
    if (!id) {
        res.json({ err_code: 0, message: '请求数据失败' });
        return;
    }
    let sqlStr = "SELECT * FROM category WHERE fid = '" + id + "'";
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({ err_code: 0, message: '请求数据失败' });
        } else {
            // 做了一个控制，如果是父分类，必须先删除所有子分类
            if (!results[0]) {
                let delStr = "DELETE FROM category WHERE id = '" + id + "' LIMIT 1";
                conn.query(delStr, (error, results, fields) => {
                    if (error) {
                        res.json({ err_code: 0, message: '删除失败' });
                    } else {
                        res.json({ success_code: 200, message: '删除成功!' });
                    }
                });
            } else {
                res.json({ err_code: 0, message: '有子分类不可删除' });
            }
        }
    });

});

// 创建一个分类
router.post('/create', (req, res) => {
    let name = req.body.name;
    let no = req.body.no;
    let status = req.body.status;
    let icon = req.body.icon;
    let fid = req.body.fid;

    let timestamp = chinaTime('YYYY-MM-DD HH:mm:ss');
    if (timestamp) {
        timestamp = time.timestamp2date(timestamp);
    }

    const addSql = "INSERT INTO category(name, icon, no, status, fid, createtime, updatetime) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const addSqlParams = [name, icon, no, status, fid, timestamp, timestamp];
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
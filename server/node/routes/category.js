/**
 *  客户端请求分类相关的
 */
const express = require('express');
const router = express.Router();
const conn = require('../db/db');

// 分类索引
router.get('/index', (req, res) => {
    let sqlStr = "SELECT * FROM category WHERE status = 'published' AND fid = 0";
    // 1.2 执行语句
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            console.log(error)
            res.json({ err_code: 0, message: '请求数据失败' });
        } else {
            let items = []
            if (results[0]) {
                for (let i in results) {
                    let item = {}
                    item.id = results[i].id
                    item.name = results[i].name
                    item.icon = results[i].icon
                    let children = []
                    let fc = JSON.parse(results[i].children)
                    if (fc && fc[0]) {
                        for (let j in fc) {
                            if (fc[j].status == 'published'){
                                children.push(fc[j])
                            }
                        }
                    }
                    item.items = children
                    items.push(item)
                }
            }
            res.json({ success_code: 200, message: '请求数据成功', items: items });
        }
    });
});

module.exports = router;
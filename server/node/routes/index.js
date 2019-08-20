const express = require('express');
const router = express.Router();
const conn = require('./../db/db');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: '明镜智库' });
});

/**
 * 获取首页轮播图
 */
router.get('/api/homecasual', (req, res) => {

    // 1.1 数据库查询的语句
    let sqlStr = "SELECT * FROM home_banner WHERE status = 'published' ORDER BY no";
    // 1.2 执行语句
    conn.query(sqlStr, (error, results, fields) => {
        // console.log(results[0]);
        if (error) {
            res.json({ err_code: 0, message: '请求数据失败' });
        } else {
            res.json({ success_code: 200, message: results });
        }
    });
});

/**
 * 获取首页导航
 */
router.get('/api/homenav', (req, res) => {
    const data = require('../data/homenav');
    res.json({ success_code: 200, message: data });
});

/**
 * 获取首页商品列表
 */
router.get('/api/homeshoplist', (req, res) => {
    setTimeout(function () {
        const data = require('../data/shopList');
        res.json({ success_code: 200, message: data })
    }, 300);
});

/**
 * 获取推荐商品列表
 *  1, 20
 */
router.get('/api/recommendshoplist', (req, res) => {
    // 1.0 获取参数
    let pageNo = req.query.page || 1;
    let pageSize = req.query.count || 20;
    console.log(pageNo);
    console.log(pageSize);

    // 1.1 数据库查询的语句
    let sqlStr = 'SELECT * FROM recommend LIMIT ' + (pageNo - 1) * pageSize + ',' + pageSize;
    // console.log(sqlStr);

    // 1.2 执行语句
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({ err_code: 0, message: '请求数据失败' });
        } else {
            setTimeout(() => {
                res.json({ success_code: 200, message: results });
            }, 200);
        }
    });
});

/**
 * 获取推荐商品列表拼单用户
 */
router.get('/api/recommenduser', (req, res) => {
    setTimeout(function () {
        const data = require('../data/recommend_users');
        res.json({ success_code: 200, message: data })
    }, 10);
});

/**
 * 添加商品到购物车
 */
router.post('/api/add_shop_cart', (req, res) => {
    // 1. 验证用户
    let user_id = req.body.user_id;
    if (!user_id || user_id !== req.session.userId) {
        res.json({ err_code: 0, message: '非法用户' });
        return;
    }

    // 2. 获取客户端传过来的商品信息
    let goods_id = req.body.goods_id;
    let goods_name = req.body.goods_name;
    let thumb_url = req.body.thumb_url;
    let price = req.body.price;
    let buy_count = 1;
    let is_pay = 0; // 0 未购买 1购买

    // 3. 查询数据
    let sql_str = "SELECT * FROM lk_pdd_cart WHERE goods_id = '" + goods_id + "' LIMIT 1";
    conn.query(sql_str, (error, results, fields) => {
        if (error) {
            res.json({ err_code: 0, message: '服务器内部错误!' });
        } else {
            results = JSON.parse(JSON.stringify(results));
            // console.log(results);
            if (results[0]) { // 3.1 商品已经存在
                console.log(results[0]);
                let buy_count = results[0].buy_count + 1;
                let sql_str = "UPDATE lk_pdd_cart SET buy_count = " + buy_count + " WHERE goods_id = '" + goods_id + "'";
                conn.query(sql_str, (error, results, fields) => {
                    if (error) {
                        res.json({ err_code: 0, message: '加入购物车失败!' });
                    } else {
                        res.json({ success_code: 200, message: '加入购物车成功!' });
                    }
                });
            } else { // 3.2 商品不存在
                let add_sql = "INSERT INTO lk_pdd_cart(goods_id, goods_name, thumb_url, price, buy_count, is_pay) VALUES (?, ?, ?, ?, ?, ?)";
                let sql_params = [goods_id, goods_name, thumb_url, price, buy_count, is_pay];
                conn.query(add_sql, sql_params, (error, results, fields) => {
                    if (error) {
                        res.json({ err_code: 0, message: '加入购物车失败!' });
                    } else {
                        res.json({ success_code: 200, message: '加入购物车成功!' });
                    }
                });
            }
        }
    });

});

/**
 * 查询购物车的商品
 */
router.get('/api/cart_goods', (req, res) => {
    // 1.0 获取参数
    if (!req.session.userId) {
        res.json({ err_code: 0, message: '请先登录!' });
        return;
    }

    // 1.1 数据库查询的语句
    let sqlStr = "SELECT * FROM lk_pdd_cart";
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({ err_code: 0, message: '请求数据失败' });
        } else {
            // 返回数据给客户端
            res.json({ success_code: 200, message: results });
        }
    });
});

module.exports = router;

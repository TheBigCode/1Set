/**
 * 用户（客户端）接口
 */
var express = require('express');
var router = express.Router();
const md5 = require('blueimp-md5');
const uuid = require('uuid');
const conn = require('./../db/db');
var request = require('request');

const time = require('../util/time_util')
const chinaTime = require('china-time');

let users = {}; // 用户信息
let sms_sign = ''
let tx_valid_appid = "";
let tx_valid_key = '';

router.post('/test', (req, res) => {
    res.json({ err_code: 0, message: 'ok' });
})

router.get('/ip', (req, res) => {
    // console.log("ip:" + getClientIp(req));
    var ip = getClientIp(req);
    res.json({ err_code: 0, message: ip });
})

router.post('/ip', (req, res) => {
    // console.log("ip:" + getClientIp(req));
    var ip = getClientIp(req);
    res.json({ err_code: 0, message: ip });
})


router.post('/register', (req, res) => {
    // 1. 获取数据
    const user_name = req.body.name;
    const user_pwd = md5(req.body.pwd);

    const captcha = req.body.captcha;
    const randstr = req.body.randstr;
    if (!captcha || !randstr) {
        res.json({ err_code: 0, message: '图形验证码不正确!' });
        return;
    }
    validCaptcha(captcha, randstr, getClientIp(req), (valid) => {
        console.log('response:' + valid.response)
        if (valid.response == 1) {
            // 3. 查询数据
            let sqlStr = "SELECT * FROM user WHERE username = '" + user_name + "' LIMIT 1";
            conn.query(sqlStr, (error, results, fields) => {
                let addnew = false;
                if (error) {
                    // 无数据
                    // res.json({ err_code: 0, message: '参数错误' });
                    addnew = true;
                } else {
                    results = JSON.parse(JSON.stringify(results));
                    if (!results[0]) {
                        // 有数据但内容为空
                        addnew = true;
                    } else {
                        res.json({ err_code: 0, message: '用户已存在' });
                    }
                }

                if (addnew) {
                    // 生成uid,用的是时间戳生成，理论上是不会重复，但最好做一次检查，不过这里先省一下，毕竟重复机率很小。
                    let uid = uuid.v1();
                    let timestamp = chinaTime('YYYY-MM-DD HH:mm:ss');
                    if (timestamp) {
                        timestamp = time.timestamp2date(timestamp);
                    }
                    const addSql = "INSERT INTO user(username, password, nikename, uid, create_time, update_time) VALUES (?, ?, ?, ?, ?, ?)";
                    const addSqlParams = [user_name, user_pwd, user_name, uid, timestamp, timestamp];
                    conn.query(addSql, addSqlParams, (error, results, fields) => {
                        results = JSON.parse(JSON.stringify(results));
                        if (!error) {
                            req.session.userId = results.insertId;
                            let sqlStr = "SELECT * FROM user WHERE id = '" + results.insertId + "' LIMIT 1";
                            conn.query(sqlStr, (error, results, fields) => {
                                if (error) {
                                    res.json({ err_code: 0, message: '请求数据失败' });
                                } else {
                                    results = JSON.parse(JSON.stringify(results));
                                    req.session.uid = results[0].uid;
                                    // 返回数据给客户端
                                    res.json({
                                        success_code: 200,
                                        message: {
                                            id: results[0].id,
                                            user_name: results[0].username,
                                            user_phone: results[0].phone,
                                            user_nike: results[0].nikename,
                                            uid: results[0].uid,
                                            avatar: results[0].avatar
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            })
        } else {
            res.json({ err_code: 0, message: '验证失败' });
        }
    })
});

router.post('/register_phone', async (req, res) => {
    // 1. 获取数据
    const user_phone = req.body.phone
    const code = req.body.code
    validCode(code, req.session.msgId, (valid) => {
        if (valid) {
            // 验证成功
            // 3. 查询数据
            let addnew = false;
            let sqlStr = "SELECT * FROM user WHERE phone = '" + user_phone + "' LIMIT 1";
            conn.query(sqlStr, (error, results, fields) => {
                if (error) {
                    // 无数据
                    addnew = true;
                    // res.json({ err_code: 0, message: '参数错误' });
                } else {
                    results = JSON.parse(JSON.stringify(results));
                    if (!results[0]) {
                        // 有数据但内容为空
                        addnew = true;
                    } else {
                        res.json({ err_code: 0, message: '用户已存在' });
                    }
                }
                if (addnew) {
                    // 生成uid,用的是时间戳生成，理论上是不会重复，但最好做一次检查，不过这里先省一下，毕竟重复机率很小。
                    let uid = uuid.v1();
                    let timestamp = chinaTime('YYYY-MM-DD HH:mm:ss');
                    if (timestamp) {
                        timestamp = time.timestamp2date(timestamp);
                    }
                    const addSql = "INSERT INTO user(username, phone, nikename, uid, create_time, update_time) VALUES (?, ?, ?, ?, ?, ?)";
                    const addSqlParams = [user_phone, user_phone, user_phone, uid, timestamp, timestamp];
                    conn.query(addSql, addSqlParams, (error, results, fields) => {
                        results = JSON.parse(JSON.stringify(results));
                        if (!error) {
                            req.session.userId = results.insertId;
                            let sqlStr = "SELECT * FROM user WHERE id = '" + results.insertId + "' LIMIT 1";
                            conn.query(sqlStr, (error, results, fields) => {
                                if (error) {
                                    res.json({ err_code: 0, message: '请求数据失败' });
                                } else {
                                    results = JSON.parse(JSON.stringify(results));
                                    req.session.uid = results[0].uid;
                                    // 返回数据给客户端
                                    res.json({
                                        success_code: 200,
                                        message: {
                                            id: results[0].id,
                                            user_name: results[0].username,
                                            user_phone: results[0].phone,
                                            user_nike: results[0].nikename,
                                            uid: results[0].uid,
                                            avatar: results[0].avatar
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            })
        } else {
            res.json({ err_code: 0, message: '验证失败' });
        }
    });


});



/**
 * 用户名和密码登录
 */
router.post('/login_pwd', (req, res) => {
    // 1. 获取数据
    const user_name = req.body.name;
    const user_pwd = md5(req.body.pwd);

    const captcha = req.body.captcha;
    const randstr = req.body.randstr;
    if (!captcha || !randstr) {
        res.json({ err_code: 0, message: '图形验证码不正确!' });
        return;
    }
    validCaptcha(captcha, randstr, getClientIp(req), (valid) => {
        if (valid.response == 1) {
            // 3. 查询数据
            let sqlStr = "SELECT * FROM user WHERE username = '" + user_name + "' LIMIT 1";
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
                            req.session.userId = results[0].id;
                            req.session.uid = results[0].uid;
                            // 返回数据给客户端
                            res.json({
                                success_code: 200,
                                message: {
                                    id: results[0].id,
                                    user_name: results[0].username,
                                    user_phone: results[0].phone,
                                    user_nike: results[0].nikename,
                                    uid: results[0].uid,
                                    avatar: results[0].avatar
                                },
                                info: '登录成功!'
                            });
                        }
                    } else {
                        res.json({ err_code: 0, message: '用户不存在!' });
                    }
                }
            });
        } else {
            res.json({ err_code: 0, message: '验证失败' });
        }
    })
});


/*
*  根据session中的用户id获取用户信息
* */
router.get('/user_info', (req, res) => {
    // 1.0 获取参数
    let userId = req.session.userId;
    // 1.1 数据库查询的语句
    let sqlStr = "SELECT * FROM user WHERE id = '" + userId + "' LIMIT 1";
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({ err_code: 0, message: '请求数据失败' });
        } else {
            results = JSON.parse(JSON.stringify(results));
            if (!results[0]) {
                delete req.session.userId;
                res.json({ error_code: 1, message: '请先登录' });
            } else {
                // 返回数据给客户端
                res.json({
                    success_code: 200,
                    message: {
                        id: results[0].id,
                        user_name: results[0].username,
                        user_phone: results[0].phone,
                        user_nike: results[0].nikename,
                        uid: results[0].uid,
                        avatar: results[0].avatar
                    },
                    info: '成功!'
                });
            }
        }
    });
});

router.post('/user_info_by_uid', (req, res) => {
    // 1.0 获取参数
    let uid = req.body.uid;
    // 1.1 数据库查询的语句
    let sqlStr = "SELECT * FROM user WHERE uid = '" + uid + "' LIMIT 1";
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({ err_code: 0, message: '请求数据失败' });
        } else {
            results = JSON.parse(JSON.stringify(results));
            if (!results[0]) {
                res.json({ error_code: 1, message: '查无数据' });
            } else {
                // 返回数据给客户端
                res.json({
                    success_code: 200,
                    message: {
                        user_nike: results[0].nikename,
                        avatar: results[0].avatar
                    },
                    info: '成功!'
                });
            }
        }
    });
});

router.post('/user_info_by_id', (req, res) => {
    // 1.0 获取参数
    let id = req.body.id;
    // 1.1 数据库查询的语句
    let sqlStr = "SELECT * FROM user WHERE id = '" + id + "' LIMIT 1";
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({ err_code: 0, message: '请求数据失败' });
        } else {
            results = JSON.parse(JSON.stringify(results));
            if (!results[0]) {
                res.json({ error_code: 1, message: '查无数据' });
            } else {
                // 返回数据给客户端
                res.json({
                    success_code: 200,
                    message: {
                        user_nike: results[0].nikename,
                        avatar: results[0].avatar
                    },
                    info: '成功!'
                });
            }
        }
    });
});

/**
 * 退出登录
 */
router.get('/logout', (req, res) => {
    // 1. 清除session中userId
    delete req.session.userId;
    // 2. 提示用户
    res.json({
        success_code: 200,
        message: "退出登录成功"
    });
});

/**
 * 修改用户信息
 */
router.post('/change_user_msg', (req, res) => {
    // 1. 获取数据
    const id = req.body.user_id;
    const user_name = req.body.user_name || '';
    const user_sex = req.body.user_sex || '';
    const user_address = req.body.user_address || '';
    const user_birthday = req.body.user_birthday || '';
    const user_sign = req.body.user_sign || '';

    // 2. 验证
    if (!id) {
        res.json({ err_code: 0, message: '修改用户信息失败!' });
    }

    // 3. 更新数据
    let sqlStr = "UPDATE pdd_user_info SET user_name = ? , user_sex = ?, user_address = ?, user_birthday = ?, user_sign = ? WHERE id = " + id;
    let strParams = [user_name, user_sex, user_address, user_birthday, user_sign];
    conn.query(sqlStr, strParams, (error, results, fields) => {
        if (error) {
            res.json({ err_code: 0, message: '修改用户信息失败!' });
        } else {
            res.json({ success_code: 200, message: '修改用户信息成功!' });
        }
    });

});

/**
 * 修改昵称
 */
router.post('/change_nike', (req, res) => {
    // 1. 获取数据
    const id = req.session.userId;;
    const nike = req.body.nike;

    // 2. 验证
    if (!id) {
        res.json({ err_code: 0, message: '请重新登录!' });
        return;
    }

    if (!nike) {
        res.json({
            err_code: 0,
            message: "新昵称不能为空"
        });
        return;
    }

    let timestamp = chinaTime('YYYY-MM-DD HH:mm:ss');
    if (timestamp) {
        timestamp = time.timestamp2date(timestamp);
    }

    // 3. 更新数据
    let sqlStr = "UPDATE user SET nikename = ? , update_time = ? WHERE id = " + id;
    let strParams = [nike, timestamp];
    conn.query(sqlStr, strParams, (error, results, fields) => {
        if (error) {
            res.json({ err_code: 0, message: '修改失败!' });
        } else {
            res.json({ success_code: 200, message: '修改成功!' });
        }
    });

});

router.post('/change_avatar', (req, res) => {
    // 1. 获取数据
    const id = req.session.userId;
    const avatar = req.body.avatar;
    // 2. 验证
    if (!id) {
        res.json({ err_code: 0, message: '请重新登录!' });
        return;
    }

    if (!avatar) {
        res.json({
            err_code: 0,
            message: "请重新上传头像"
        });
        return;
    }

    let timestamp = chinaTime('YYYY-MM-DD HH:mm:ss');
    if (timestamp) {
        timestamp = time.timestamp2date(timestamp);
    }
    // 3. 更新数据
    let sqlStr = "UPDATE user SET avatar = ? , update_time = ? WHERE id = " + id;
    let strParams = [avatar, timestamp];
    conn.query(sqlStr, strParams, (error, results, fields) => {
        if (error) {
            res.json({ err_code: 0, message: '修改失败!' });
        } else {
            res.json({ success_code: 200, message: '修改成功!' });
        }
    });

});

/*
  发送验证码短信
*/
router.post('/send_code', (req, res) => {
    // 1. 获取手机号码
    let phone = req.body.phone;
    var http = require('https');
    var oreq = req;
    var ores = res;
    var post_data = {
        "mobile": phone, "temp_id": 1
    }

    var content = JSON.stringify(post_data)
    let options = {
        hostname: 'api.sms.jpush.cn',
        port: 443,
        path: '/v1/codes',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': content.length,
            'Connection': 'keep-alive',
            'Authorization': sms_sign
        }
    };

    var req = http.request(options, function (res) {
        var _data = '';
        res.on('data', function (chunk) {
            _data += chunk;
        });

        res.on('end', function () {
            var json = JSON.parse(_data.trim())
            oreq.session.msgId = json.msg_id.toLocaleLowerCase();
            ores.json({ err_code: 200, message: '验证码发送成功!' });
        });
    });

    req.on('error', function (e) {
        res.json({ err_code: 0, message: '验证码发送失败!' });
    });
    req.write(content);
    req.end();
});

/*
  手机验证码登录
*/
router.post('/login_code', (req, res) => {
    // 1. 获取数据
    const phone = req.body.phone;
    const code = req.body.code;

    validCode(code, req.session.msgId, (valid) => {
        if (valid) {
            // 3. 查询数据
            delete users[phone];
            let sqlStr = "SELECT * FROM user WHERE phone = '" + phone + "' LIMIT 1";
            conn.query(sqlStr, (error, results, fields) => {
                if (error) {
                    res.json({ err_code: 0, message: '请求数据失败' });
                    return;
                } else {
                    results = JSON.parse(JSON.stringify(results));
                    if (results[0]) {  // 用户已经存在
                        // console.log(results[0]);
                        req.session.userId = results[0].id;
                        req.session.uid = results[0].uid;
                        // 返回数据给客户端
                        res.json({
                            success_code: 200,
                            message: {
                                id: results[0].id,
                                user_nike: results[0].nikename,
                                user_name: results[0].username,
                                user_phone: results[0].phone,
                                uid: results[0].uid,
                                avatar: results[0].avatar
                            }
                        });
                    }
                }
            });
        } else {
            res.json({ err_code: 0, message: '验证失败' });
        }
    });
});

// 基于手机号的重置密码，所以后面要让注册用户强制绑定手机
router.post('/change_password', (req, res) => {
    // 1. 获取数据
    const phone = req.body.phone;
    const code = req.body.code;
    if (!phone || !code) {
        res.json({
            err_code: 0,
            message: "手机/验证码不能为空"
        });
        return;
    }

    const password = md5(req.body.password)
    if (!password) {
        res.json({
            err_code: 0,
            message: "密码不能为空"
        });
        return;
    }
    validCode(code, req.session.msgId, (valid) => {
        if (valid) {
            // 3. 查询数据
            delete users[phone];
            let checkStr = "SELECT * FROM user WHERE phone = '" + phone + "' LIMIT 1";
            conn.query(checkStr, (error, results, fields) => {
                if (error) {
                    res.json({ err_code: 0, message: '请求出错!' });
                    return;
                } else {
                    results = JSON.parse(JSON.stringify(results));
                    if (!results[0]) {  // 用户已经存在
                        res.json({ err_code: 0, message: '手机号没绑定任何帐号!' });
                        return;
                    } else {
                        let uid = results[0].uid;
                        let timestamp = chinaTime('YYYY-MM-DD HH:mm:ss');
                        if (timestamp) {
                            timestamp = time.timestamp2date(timestamp);
                        }

                        // 3. 更新数据
                        let sqlStr = "UPDATE user SET password = ? , update_time = ? WHERE uid = '" + uid + "' LIMIT 1";
                        let strParams = [password, timestamp];
                        conn.query(sqlStr, strParams, (error, results, fields) => {
                            if (error) {
                                res.json({ err_code: 0, message: '修改失败!' });
                            } else {
                                res.json({ success_code: 200, message: '修改成功!' });
                            }
                        });
                    }
                }

            });
        } else {
            res.json({ err_code: 0, message: '验证失败' });
        }
    });
});

router.post('/bind_phone', (req, res) => {
    // 1. 获取数据
    const id = req.session.userId;
    if (!id) {
        res.json({ err_code: 0, message: '请重新登录!' });
        return;
    }
    const phone = req.body.phone;
    const code = req.body.code;
    if (!phone || !code) {
        res.json({
            err_code: 0,
            message: "请求失败"
        });
        return;
    }

    validCode(code, req.session.msgId, (valid) => {
        if (valid) {
            // 3. 查询数据
            delete users[phone];

            let checkStr = "SELECT * FROM user WHERE phone = '" + phone + "' LIMIT 1";
            conn.query(checkStr, (error, results, fields) => {
                if (error) {
                    res.json({ err_code: 0, message: '请求出错!' });
                } else {
                    results = JSON.parse(JSON.stringify(results));
                    if (results[0]) {  // 用户已经存在
                        res.json({ err_code: 0, message: '手机号已存在!' });
                        return;
                    } else {
                        let timestamp = chinaTime('YYYY-MM-DD HH:mm:ss');
                        if (timestamp) {
                            timestamp = time.timestamp2date(timestamp);
                        }
                        // 3. 更新数据
                        let sqlStr = "UPDATE user SET phone = ? , update_time = ? WHERE id = " + id;
                        let strParams = [phone, timestamp];
                        conn.query(sqlStr, strParams, (error, results, fields) => {
                            if (error) {
                                res.json({ err_code: 0, message: '修改失败!' });
                            } else {
                                res.json({ success_code: 200, message: '修改成功!' });
                            }
                        });
                    }
                }
            });
        } else {
            res.json({ err_code: 0, message: '验证失败' });
        }
    });
});

function validCode(code, msgid, callback) {
    var http = require('https');
    var post_data = {
        "code": code
    }

    var content = JSON.stringify(post_data)
    let options = {
        hostname: 'api.sms.jpush.cn',
        port: 443,
        path: '/v1/codes/' + msgid + '/valid',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': content.length,
            'Connection': 'keep-alive',
            'Authorization': sms_sign
        }
    };

    var req = http.request(options, function (res) {
        var _data = '';
        res.on('data', function (chunk) {
            _data += chunk;
        });

        res.on('end', function () {
            var json = JSON.parse(_data.trim())
            callback(json.is_valid);
        });
    });

    req.on('error', function (e) {
        callback(false);
    });
    req.write(content);
    req.end();
}

const setQueryConfig = function (queryConfig) {
    let _str = '?';
    for (let o in queryConfig) {
        if (queryConfig[o] != -1) {
            _str += o + '=' + queryConfig[o] + '&';
        }
    }
    _str = _str.substring(0, _str.length - 1);
    return _str;
}

function validCaptcha(ticket, randstr, ip, callback) {
    var http = require('https');
    var data = {
        aid: tx_valid_appid,
        AppSecretKey: tx_valid_key,
        Ticket: ticket,
        Randstr: randstr,
        UserIP: ""
    };//这是需要提交的数据 

    const getUrl = 'https://ssl.captcha.qq.com/ticket/verify' + setQueryConfig(data);
    http.get(getUrl, function (response) {
        var body = [];
        response.on('data', function (chunk) {
            body.push(chunk);
        });
        response.on('end', function () {
            body = JSON.parse(Buffer.concat(body));
            callback(body)
        });
    });
}

function getClientIp(req) {
    var ipAddress;
    var forwardedIpsStr = req.header('x-forwarded-for');
    if (forwardedIpsStr) {
        var forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    if (!ipAddress) {
        return "";
    }
    var ip = ipAddress.replace("::ffff:", '')
    return ip;
}

/*
*微信登录（如第一次会自己注册）
*/
router.post('/login_wx', (req, res) => {
    // 1. 获取数据
    const access_token = req.body.access_token;
    // const refresh_token = req.body.refresh_token;
    const openid = req.body.openid;

    if (!access_token || !openid) {
        res.json({ err_code: 0, message: '微信授权失败' });
        return;
    }

    // 第一步，查看用户是否已经存在
    let sqlStr = "SELECT * FROM user WHERE wx_id = '" + openid + "' LIMIT 1";
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({ err_code: 0, message: '请求数据失败' });
            return;
        } else {
            results = JSON.parse(JSON.stringify(results));
            if (results[0]) {  // 用户已经存在
                // console.log(results[0]);
                req.session.userId = results[0].id;
                req.session.uid = results[0].uid;
                // 返回数据给客户端
                res.json({
                    success_code: 200,
                    message: {
                        id: results[0].id,
                        user_nike: results[0].nikename,
                        user_name: results[0].username,
                        user_phone: results[0].phone,
                        uid: results[0].uid,
                        avatar: results[0].avatar
                    }
                });
            } else {
                getWxInfo(access_token, openid, (body) => {
                    if (body) {
                        // 3. 查询数据
                        let nike = body.nickname;
                        let avatar = body.headimgurl;
            
                        let uid = uuid.v1();
                        let timestamp = chinaTime('YYYY-MM-DD HH:mm:ss');
                        if (timestamp) {
                            timestamp = time.timestamp2date(timestamp);
                        }
                        const addSql = "INSERT INTO user(username, wx_id, nikename, uid, create_time, update_time, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)";
                        const addSqlParams = [nike, openid, nike, uid, timestamp, timestamp, avatar];
                        conn.query(addSql, addSqlParams, (error, results, fields) => {
                            if (!error) {
                                req.session.userId = results.insertId;
                                let sqlStr = "SELECT * FROM user WHERE id = '" + results.insertId + "' LIMIT 1";
                                conn.query(sqlStr, (error, results, fields) => {
                                    if (error) {
                                        res.json({ err_code: 0, message: '请求数据失败:' +error });
                                    } else {
                                        results = JSON.parse(JSON.stringify(results));
                                        req.session.uid = results[0].uid;
                                        // 返回数据给客户端
                                        res.json({
                                            success_code: 200,
                                            message: {
                                                id: results[0].id,
                                                user_name: results[0].username,
                                                user_phone: results[0].phone,
                                                user_nike: results[0].nikename,
                                                uid: results[0].uid,
                                                avatar: results[0].avatar
                                            }
                                        });
                                    }
                                });
                            } else {
                                res.json({ err_code: 0, message: '微信登陆失败:'+error });
                            }
                        });
                    } else {
                        res.json({ err_code: 0, message: '微信登陆失败' });
                    }
                });
            }
        }
    });
});

function getWxInfo(access_token, openid, callback) {
    var http = require('https');
    const getUrl = "https://api.weixin.qq.com/sns/userinfo?access_token=" + access_token + "&openid=" + openid + "&lang=zh_CN"
    http.get(getUrl, function (response) {
        var body = [];
        response.on('data', function (chunk) {
            body.push(chunk);
        });
        response.on('end', function () {
            body = JSON.parse(Buffer.concat(body));
            callback(body);
        });
    });
}


module.exports = router;
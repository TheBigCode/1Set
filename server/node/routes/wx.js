/**
 *  客户端请求分类相关的
 */
const express = require('express');
const router = express.Router();

var wxid = ''
var wxkey = ''

// 分类索引
router.get('/getToken', (req, res) => {
    var code = req.query.code
    var http = require('https');
    const getUrl = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + wxid + "&secret=" + wxkey + "&code=" + code + "&grant_type=authorization_code"
    http.get(getUrl, function (response) {
        var body = [];
        response.on('data', function (chunk) {
            body.push(chunk);
        });
        response.on('end', function () {
            body = JSON.parse(Buffer.concat(body));
            res.json({ success_code: 200, message: '请求数据成功', data: JSON.stringify(body) });
        });
    });
});

module.exports = router;
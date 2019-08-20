// wx工具类
import wx from 'weixin-js-sdk';
import Utils from './utils'
import wechatAuth from './wechatAuth'//微信登录插件
const queryString = require("query-string");

export default {

    test() {
        let date = new Date()
        let timestamp = +new Date(date)
        let nonceStr = Utils.randomString(15);
        let signature = Utils.randomString(20);
        wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: '', // 必填，公众号的唯一标识
            timestamp: timestamp, // 必填，生成签名的时间戳
            nonceStr: nonceStr, // 必填，生成签名的随机串
            signature: signature,// 必填，签名
            jsApiList: ['scanQRCode'] // 必填，需要使用的JS接口列表
        });

        wx.checkJsApi({
            jsApiList: ['checkJsApi','scanQRCode'],
            success: function (res) {
                console.log("success:"+res)
            }
        });
    },

    auth() {
              //微信未授权登录跳转到授权登录页面
      let url = window.location.href;
      //解决重复登录url添加重复的code与state问题
      let parseUrl = queryString.parse(url.split("?")[1]);
      let loginUrl;
      if (parseUrl.code && parseUrl.state) {
        delete parseUrl.code;
        delete parseUrl.state;
        loginUrl = `${url.split("?")[0]}?${queryString.stringify(parseUrl)}`;
      } else {
        loginUrl = url;
      }
      wechatAuth.setAppId('')
    //   console.log('loginUrl:'+loginUrl);
      wechatAuth.redirect_uri = loginUrl;
      let authUrl = wechatAuth.authUrl;
      window.location.href = authUrl;
    }
  
}
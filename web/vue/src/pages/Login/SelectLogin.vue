<template>
  <div class="select-login">
    <router-link tag="back" to="/home">&lt;返回</router-link>
    <div class="bottom">
      <img src="./images/lk_logo_sm.png" alt width="200" />
    </div>
    <h4>欢迎使用一式商城</h4>
    <router-link tag="button" to="/login">登录</router-link>
    <router-link tag="button" to="/register">注册</router-link>
    <button class="button" @click="wxAuth()">微信登陆</button>
  </div>
</template>

<script>
import { wxToken, wxLogin } from "./../../api/index";
import wx from "./../../utils/wxutil";
import { mapActions } from "vuex";

export default {
  name: "SelectLogin",
   data() {
    return {
      userInfo: {}, // 用户的信息
    };
  },
  created() {
    //获取传入的参数
    var url = window.location.href;
    let indexCode = url.indexOf("code=");
    let indexEnd = url.indexOf("&state");
    if (!indexEnd || indexEnd <= 0) {
      let indexEnd = url.indexOf("#/me");
    }
    if (indexCode <= 0) {
      return
    }
    let code = url.substring(indexCode + 5, indexEnd);
    if (code) {
      this.wxGetToken(code)
    }
  },
  methods: {
    ...mapActions(["syncUserInfo"]),

    async wxAuth() {
      wx.auth();
    },

    async wxGetToken(code) {
      const loadtoast = this.$createToast({
        txt: "Loading...",
        mask: true
      });
      loadtoast.show();
      const result = await wxToken(code);
      loadtoast.hide();
      if (result.success_code === 200) {
        var data = result.data
        var json = JSON.parse(data)
        this.handleWxLogin(json.access_token, json.refresh_token, json.openid)
      } else {
        this.$createToast({
          type: "warn",
          time: 1000,
          txt: result.message
        }).show();
      }
    },

    async handleWxLogin(access_token, refresh_token, openid) {
      const loadtoast = this.$createToast({
        txt: "Loading...",
        mask: true
      });
      loadtoast.show();
      const result = await wxLogin(access_token, refresh_token, openid);
      loadtoast.hide();
      if (result.success_code === 200) {
        this.userInfo = result.message;
      } else {
        this.$createToast({
          type: "warn",
          time: 1000,
          txt: result.message
        }).show();
      }

      if (!this.userInfo.id) {
        // 失败
        const toast = this.$createToast({
          time: 1000,
          type: "txt",
          txt: this.userInfo.message
        });
        toast.show();
      } else {
        const toast = this.$createToast({
          time: 1000,
          type: "txt",
          txt: "登录成功"
        });
        toast.show();
        // 6.1 同步用户数
        this.syncUserInfo(this.userInfo);
        // 6.2 回到主界面
        this.$router.replace('/home')
      }
    
    }
  }
};
</script>
<style scoped lang="stylus" ref="stylesheet/stylus">
.select-login {
  background-color: #f5f5f5;
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  button {
    width: 80%;
    height: 38px;
    background-color: purple;
    border: none;
    border-radius: 5px;
    font-size: 20px;
    color: #fff;
    margin-top: 30px;
  }

  back {
    position: fixed;
    width: 100px;
    height: 38px;
    top: 0px;
    left: 0px;
    margi-left: 0px;
    margin-top: 15px;
    font-size: 25px;
    color: #000;
  }

  .bottom {
    position: fixed;
    top: 130px;
    left: 50%;
    margin-left: -100px;
  }
}
</style>

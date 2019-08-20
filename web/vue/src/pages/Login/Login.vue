<template>
  <div class="login-container">
    <!--登录面板内容部分-->
    <div class="login-inner">
      <!--面板头部-->
      <div class="login-header">
        <div class="login-logo">
          <img src="./images/lk_logo_sm.png" alt width="250" />
        </div>
        <!--面板标题-->
        <div class="login-header-title">
          <a href="javascript:;" :class="{current: loginMode}" @click="dealLoginMode(true)">验证码登录</a>
          <a href="javascript:;" :class="{current: !loginMode}" @click="dealLoginMode(false)">密码登录</a>
        </div>
      </div>
      <!--面板表单部分-->
      <div class="login-content">
        <form>
          <!--手机验证码登录部分-->
          <div :class="{current: loginMode}">
            <section class="login-message">
              <input type="tel" maxlength="11" placeholder="手机号" v-model="phone" />
              <button
                v-if="!countDown"
                class="get-verification"
                :class="{phone_right: phoneRight}"
                @click.prevent="getVerifyCode()"
              >获取验证码</button>
              <button v-else disabled="disabled" class="get-verification">已发送({{countDown}}s)</button>
            </section>
            <section class="login-verification">
              <input type="tel" maxlength="8" placeholder="验证码" v-model="code" />
            </section>
            <section class="login-hint">
              <a href="javascript:;">服务协议与隐私政策</a>
            </section>
          </div>
          <!--账号登录部分-->
          <div :class="{current: !loginMode}">
            <section>
              <section class="login-message">
                <input type="text" maxlength="11" placeholder="用户名/手机/邮箱" v-model="user_name" />
              </section>
              <section class="login-verification">
                <input type="password" maxlength="18" placeholder="密码" v-if="pwdMode" v-model="pwd" />
                <input type="text" maxlength="18" placeholder="密码" v-else v-model="pwd" />
                <div class="switch-show">
                  <img
                    @click.prevent="dealPwdMode(false)"
                    :class="{on: pwdMode}"
                    src="./images/hide_pwd.png"
                    alt
                    width="20"
                  />
                  <img
                    @click.prevent="dealPwdMode(true)"
                    :class="{on: !pwdMode}"
                    src="./images/show_pwd.png"
                    alt
                    width="20"
                  />
                </div>
              </section>
              <div class="changePwd" @click="$router.replace('/change_pwd')">重置密码</div>
              <section class="login-message">
                <cube-button
                  :icon="validPass?'cubeic-right':'cubeic-lock'"
                  class="button-valid"
                  @click.prevent="showCaptcha()"
                >{{valid}}</cube-button>
              </section>
            </section>
          </div>
          <button class="login-submit" @click.prevent="login()">登录</button>
        </form>
        <button class="login-back" @click="$router.back()">返回</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getPhoneCode, phoneCodeLogin, pwdLogin } from "./../../api/index";
import { mapActions } from "vuex";

export default {
  name: "Login",
  data() {
    return {
      loginMode: true, // 登录方式, true 验证码登录 false 账号登录
      phone: "", // 手机号码
      countDown: 0, // 倒计时
      pwdMode: true, // 密码的显示方式 true 密文 false 明文
      pwd: "", // 密码
      code: "", // 验证码
      userInfo: {}, // 用户的信息
      user_name: "", // 用户名
      captcha: "", // 图形验证码
      randstr: "", // 验证码随机串
      valid: "点击验证",
      validPass: false
    };
  },

  computed: {
    // 验证手机号是否合理
    phoneRight() {
      return /^[1][3,4,5,7,8][0-9]{9}$/.test(this.phone);
    }
  },
  methods: {
    ...mapActions(["syncUserInfo"]),
    // 1. 登录的模式
    dealLoginMode(flag) {
      this.loginMode = flag;
    },

    // 2. 获取短信验证码
    async getVerifyCode() {
      // 2.1 开启倒计时
      if (this.phoneRight) {
        this.countDown = 60;
        this.intervalId = setInterval(() => {
          this.countDown--;
          // 判断
          if (this.countDown === 0) {
            clearInterval(this.intervalId);
          }
        }, 1000);
      }

      // 2.2 获取短信验证码
      let result = await getPhoneCode(this.phone);

      // 2.3 获取验证码成功
      if (result.err_code === 200) {
        // 提示信息
        const toast = this.$createToast({
          txt: result.message,
          type: "txt",
          time: 1000
        });
        toast.show();
      } else {
        // 失败
        const toast = this.$createToast({
          txt: result.message,
          type: "txt",
          time: 1000
        });
        toast.show();
      }
    },
    // 3. 密码的显示方式
    dealPwdMode(flag) {
      this.pwdMode = flag;
    },

    showCaptcha() {
      // 直接生成一个验证码对象
      let that = this;
      var captchaView = new TencentCaptcha("2050627577", function(res) {
        /* callback */
        console.log(res);
        if (res.ret === 0) {
          that.captcha = res.ticket;
          that.randstr = res.randstr;
          that.valid = "验证通过";
          that.validPass = true;
        }
      });
      captchaView.show();
    },
    // 5. 登录
    async login() {
      // 5.1 登录模式
      if (this.loginMode) {
        // 验证码登录
        // 5.2 前台校验
        if (!this.phone) {
          const toast = this.$createToast({
            txt: "请输入手机号码!",
            type: "txt",
            time: 1000
          });
          toast.show();
          return;
        } else if (!this.phoneRight) {
          const toast = this.$createToast({
            txt: "请输入正确手机号码!",
            type: "txt",
            time: 1000
          });
          toast.show();
          return;
        }

        if (!this.code) {
          const toast = this.$createToast({
            txt: "请输入验证码!",
            type: "txt",
            time: 1000
          });
          toast.show();
          return;
        } else if (!/^\d{6}$/gi.test(this.code)) {
          const toast = this.$createToast({
            txt: "请输入正确的验证码!!",
            type: "txt",
            time: 1000
          });
          toast.show();
          return;
        }
        // 5.3 手机验证码登录
        const result = await phoneCodeLogin(this.phone, this.code);
        if (result.success_code === 200) {
          this.userInfo = result.message;
        } else {
          this.userInfo = {
            message: "登录失败, 手机号或验证码不正确!"
          };
        }
      } else {
        // 账号和密码登录
        // 5.4 前端校验
        console.log("captcha:" + this.captcha);
        if (!this.user_name) {
          const toast = this.$createToast({
            time: 1000,
            type: "txt",
            txt: "请输入用户名/手机/邮箱!"
          });
          toast.show();
          return;
        } else if (!this.pwd) {
          const toast = this.$createToast({
            time: 1000,
            type: "txt",
            txt: "请输入密码!"
          });
          toast.show();
          return;
        } else if (!this.validPass) {
          const toast = this.$createToast({
            time: 1000,
            type: "txt",
            txt: "请先进行验证!"
          });
          toast.show();
          return;
        }
        // 5.5 用户名和密码的登录
        const result = await pwdLogin(
          this.user_name,
          this.pwd,
          this.captcha,
          this.randstr
        );
        if (result.success_code === 200) {
          console.log(result.message);
          this.userInfo = result.message;
        } else {
          console.log(result.message);
          this.userInfo = {
            message: result.message
          };
        }
      }
      // 6. 后续处理
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
        this.$router.back();
      }
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixins.styl';

.login-container {
  width: 100%;
  height: 100%;
  background: #fff;

  .login-inner {
    padding-top: 60px;
    width: 80%;
    margin: 0 auto;

    .login-header {
      .login-logo {
        font-size: 40px;
        font-weight: bold;
        color: mediumpurple;
        text-align: center;
      }

      .login-header-title {
        padding-top: 40px;
        padding-bottom: 10px;
        text-align: center;

        > a {
          color: #333;
          font-size: 14px;
          padding-bottom: 4px;

          &:first-child {
            margin-right: 40px;
          }

          &.current {
            color: mediumpurple;
            font-weight: 700;
            border-bottom: 2px solid mediumpurple;
          }
        }
      }
    }

    .login-content {
      > form {
        > div {
          display: none;

          &.current {
            display: block;
          }

          input {
            width: 100%;
            height: 100%;
            padding-left: 8px;
            box-sizing: border-box;
            border: 1px solid #ddd;
            border-radius: 4px;
            outline: 0;
            font: 400 14px Arial;

            &:focus {
              border: 1px solid mediumpurple;
            }
          }

          .login-message {
            position: relative;
            margin-top: 16px;
            height: 48px;
            font-size: 14px;
            background: #fff;

            .get-verification {
              position: absolute;
              top: 50%;
              right: 10px;
              transform: translateY(-50%);
              border: 0;
              color: #ccc;
              font-size: 14px;
              background: transparent;

              &.phone_right {
                color: purple;
              }
            }
          }

          .login-verification {
            position: relative;
            margin-top: 16px;
            height: 48px;
            font-size: 14px;
            background: #fff;

            .switch-show {
              position: absolute;
              right: 10px;
              top: 12px;

              img {
                display: none;
              }

              img.on {
                display: block;
              }
            }
          }

          .login-hint {
            margin-top: 12px;
            color: #999;
            font-size: 12px;
            line-height: 20px;

            > a {
              color: mediumpurple;
            }
          }
        }

        .changePwd {
          color: #0033cc;
          font-size: 14px;
          display: inline-block;
          float: right;
          margin-top :10px;
        }

        .login-submit {
          display: block;
          width: 100%;
          height: 42px;
          margin-top: 30px;
          border-radius: 4px;
          background: mediumpurple;
          color: #fff;
          text-align: center;
          font-size: 16px;
          line-height: 42px;
          border: 0;
        }

        .login-submit {
          display: block;
          width: 100%;
          height: 42px;
          margin-top: 30px;
          border-radius: 4px;
          background: mediumpurple;
          color: #fff;
          text-align: center;
          font-size: 16px;
          line-height: 42px;
          border: 0;
        }
      }

      .login-back {
        display: block;
        width: 100%;
        height: 42px;
        margin-top: 15px;
        border-radius: 4px;
        background: transparent;
        border: 1px solid mediumpurple;
        color: mediumpurple;
        text-align: center;
        font-size: 16px;
        line-height: 42px;
      }

      .button-valid {
        display: block;
        width: 100%;
        height: 42px;
        margin-top: 45px;
        border-radius: 4px;
        background: transparent;
        border: 1px solid green;
        color: green;
        text-align: center;
        font-size: 16px;
        line-height: 42px;
      }
    }
  }
}
</style>

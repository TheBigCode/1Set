<template>
  <div class="changepwd-container">
    <div class="title">重置密码</div>
    <!--登录面板内容部分-->
    <div class="changepwd-inner">
      <!--面板表单部分-->
      <div class="changepwd-content">
        <form>
          <!--手机验证码登录部分-->
          <div class="main">
            <section class="changepwd-message">
              <input type="tel" maxlength="11" placeholder="手机号" v-model="phone" />
              <button
                v-if="!countDown"
                class="get-verification"
                :class="{phone_right: phoneRight}"
                @click.prevent="getVerifyCode()"
              >获取验证码</button>
              <button v-else disabled="disabled" class="get-verification">已发送({{countDown}}s)</button>
            </section>
            <section class="changepwd-verification">
              <input type="tel" maxlength="8" placeholder="验证码" v-model="code" />
            </section>
            <section class="changepwd-verification">
              <input type="password" maxlength="18" placeholder="新密码" v-if="pwdMode" v-model="pwd" />
              <input type="text" maxlength="18" placeholder="新密码" v-else v-model="pwd" />
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
            <section class="changepwd-hint">
              <a href="javascript:;">服务协议与隐私政策</a>
            </section>
          </div>
          <button class="changepwd-submit" @click.prevent="submit()">确认</button>
        </form>
        <button class="changepwd-back" @click="$router.replace('/login')">返回</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getPhoneCode, changePassword } from "./../../api/index";
import { mapActions, mapState } from "vuex";

export default {
  name: "changepwd",
  data() {
    return {
      phone: "", // 手机号码
      countDown: 0, // 倒计时
      code: "", // 验证码
      pwd: "",
      pwdMode: true, // 密码的显示方式
    };
  },
  computed: {
    // 验证手机号是否合理
    phoneRight() {
      return /^[1][3,4,5,7,8][0-9]{9}$/.test(this.phone);
    }
  },
  methods: {
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

    // 5. 登录
    async submit() {
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
      const result = await changePassword(this.phone, this.code, this.pwd);
      if (result.success_code === 200) {
        const toast = this.$createToast({
          txt: "修改成功",
          type: "txt",
          time: 1000
        });
        toast.show();
        this.$router.replace('/login')
      } else {
        const toast = this.$createToast({
          txt: result.message,
          type: "txt",
          time: 1000
        });
        toast.show();
      }
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixins.styl';

.changepwd-container {
  width: 100%;
  height: 100%;
  background: #fff;

  .title {
    font-size: 22px;
    padding-top: 15px;
    font-weight: 500;
  }

  .changepwd-inner {
    padding-top: 60px;
    width: 80%;
    margin: 0 auto;

    .changepwd-content {
      > form {
        > div {
          display: none;

          &.main {
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

          .changepwd-message {
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

          .changepwd-verification {
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

          .changepwd-hint {
            margin-top: 12px;
            color: #999;
            font-size: 12px;
            line-height: 20px;

            > a {
              color: mediumpurple;
            }
          }
        }

        .changepwd-submit {
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

      .changepwd-back {
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
    }
  }
}
</style>

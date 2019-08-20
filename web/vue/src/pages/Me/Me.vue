<template>
  <div class="me">
    <div class="me_title" v-if="userInfo.id">用户中心</div>
    <select-login v-else />
    <el-upload
      ref="upload"
      action
      :http-request="fnUploadRequest"
      :show-file-list="false"
      :limit="1"
      :on-exceed="beyondFile"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
    >
      <img class="head_img" :src="userInfo.avatar" width="100%" />
    </el-upload>
    <div class="me_nike" @click="showChangNike()">{{userInfo.user_nike}}</div>
    <div class="me_username">
      <div class="id_text">用户ID:</div>
      <div class="id_value">{{userInfo.user_name}}</div>
    </div>
    <div class="me_phone" @click="$router.replace('/userphone')">
      <div class="phone_text">手机号:</div>
      <div class="phone_value">{{!userInfo.user_phone?'点击绑定手机':userInfo.user_phone}} ></div>
    </div>
    <button class="submit" @click.prevent="logout()">退出登录</button>
  </div>
</template>

<script>
import SelectLogin from "./../Login/SelectLogin";
import oss from "./../../utils/aliOss";
import { logout, changeNikename, changeAvatar } from "./../../api/index";
import { mapState } from "vuex";
export default {
  name: "Me",
  computed: {
    ...mapState(["userInfo"])
  },
  data() {
    return {};
  },
  components: {
    SelectLogin
  },
  methods: {
    /**
     * @description [fnUploadRequest 覆盖默认的上传行为，实现自定义上传]
     * @param    {object}   option [上传选项]
     * @return   {null}   [没有返回]
     */
    async fnUploadRequest(option) {
      oss.ossUploadFile(option);
    },
    // 上传
    beforeUpload(file) {
      //todo
    },
    // 上传成功后
    handleSuccess(response, file, fileList) {
      //todo
      // var json = JSON.parse(response)
      // 上传png时会返回奇怪参数，影响请求
      var url = response.res.requestUrls[0];
      var index = url.indexOf("?");
      if (index > 0) {
        var imageUrl = url.substring(0, index);
      } else {
        var imageUrl = url;
      }
      this.doChangeAvatar(imageUrl)
      this.$refs["upload"].clearFiles();
    },
    // 视频添加多个文件事件
    beyondFile(files, fileList) {
      //todo
    },
    // 5. 登出
    async logout() {
      // 5.5 用户名和密码的登录
      const result = await logout();
      if (result.success_code === 200) {
        this.userInfo = {};
        const toast = this.$createToast({
          time: 1000,
          type: "txt",
          txt: "登出成功"
        });
        toast.show();
        // // 6.2 回到主界面
        window.location.reload();
        this.$router.go(0);
      } else {
        this.userInfo = {
          message: result.message
        };
      }
    },

    async doChangeAvatar(avatar) {
      const loadtoast = this.$createToast({
        txt: "Loading...",
        mask: true
      });
      loadtoast.show();
      const result = await changeAvatar(avatar);
      loadtoast.hide();
      this.userInfo.avatar = avatar;
      if (result.success_code === 200) {
        this.$createToast({
          type: "correct",
          time: 1000,
          txt: result.message
        }).show();
      } else {
        this.$createToast({
          type: "warn",
          time: 1000,
          txt: result.message
        }).show();
      }
    },

    async doChangeName(newNickName) {
      const loadtoast = this.$createToast({
        txt: "Loading...",
        mask: true
      });
      loadtoast.show();
      const result = await changeNikename(newNickName);
      loadtoast.hide();
      this.userInfo.user_nike = newNickName;
      if (result.success_code === 200) {
        this.$createToast({
          type: "correct",
          time: 1000,
          txt: result.message
        }).show();
      } else {
        this.$createToast({
          type: "warn",
          time: 1000,
          txt: result.message
        }).show();
      }
    },

    showChangNike() {
      this.dialog = this.$createDialog({
        type: "prompt",
        title: "修改昵称",
        prompt: {
          value: "",
          placeholder: "请输入新昵称"
        },
        onConfirm: (e, promptValue) => {
          this.doChangeName(promptValue);
        }
      }).show();
    }
  }
};
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
.me {
  background: #F5F5F5;
  width: 100%;
  height: 100%;

  .me_title {
    font-size: 22px;
    padding-top: 15px;
    font-weight: 500;
  }

  .head_img {
    height: 120px;
    width: 120px;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    margin-top: 45px;
    margin-bottom: 15px;
  }

  .me_nike {
    font-size: 24px;
    padding-top: 15px;
    font-weight: bolder;
  }

  .me_username {
    font-size: 20px;
    margin-top: 20px;
    padding: 25px;
    background: #fff;

    .id_text {
      font-weight: bolder;
      display: inline-block;
      float: left;
      vertical-align: middle;
    }

    .id_value {
      font-weight: bolder;
      display: inline-block;
      float: right;
      vertical-align: middle;
    }
  }

  .me_phone {
    font-size: 20px;
    margin-top: 10px;
    font-weight: bolder;
    margin-bottom: 120px;
    padding: 25px;
    background: #fff;

    .phone_text {
      font-weight: bolder;
      display: inline-block;
      float: left;
      vertical-align: middle;
    }

    .phone_value {
      font-weight: bolder;
      display: inline-block;
      float: right;
      vertical-align: middle;
    }
  }

  .submit {
    display: block;
    width: 70%;
    height: 42px;
    margin: 0 auto;
    border-radius: 4px;
    background: mediumpurple;
    color: #fff;
    text-align: center;
    font-size: 16px;
    line-height: 42px;
    border: 0;
  }
}
</style>

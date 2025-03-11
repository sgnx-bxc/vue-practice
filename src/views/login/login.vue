<template>
  <div class="login-page" v-loading="loading">
    <!-- 左侧背景图 -->
    <div class="left-bg">
      <!-- 内嵌文字 -->
      <div class="bg-text">
        <div class="welcom-text">欢迎登录</div>
        <div class="name-text">My Reaction Platform</div>
        <div class="eng-text">Welcome to My Reaction Platform</div>
        <div class="sign-text"></div>
      </div>
    </div>
    <!-- 中间登录表单 -->
    <div v-loading="apiLoading" class="content">
      <div class="form">
        <div class="title">
          <div class="title-p1">用户登录</div>
        </div>
        <el-form
          :model="loginInfo"
          :rules="rules"
          ref="loginFormRef"
          :hide-required-asterisk="true"
          :disabled="loading"
        >
          <el-form-item prop="userName" label="账号">
            <el-input
              ref="nameRef"
              v-model.trim="loginInfo.userName"
              placeholder="请输入账号"
              prefix-icon="el-icon-user"
              @keyup.enter.native="login"
              @copy.native.capture.prevent="handlePrevent"
            ></el-input>
          </el-form-item>
          <el-form-item prop="passWord" label="密码">
            <el-input
              ref="pwdRef"
              v-model.trim="loginInfo.passWord"
              prefix-icon="el-icon-lock"
              placeholder="请输入密码"
              show-password
              @keyup.enter.native="login"
              @copy.native.capture.prevent="handlePrevent"
              @cut.native.capture.prevent="handlePrevent"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="login" class="login-btn" :disabled="loading"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 修改密码 -->
    <EditPassword
      ref="editPasswordRef"
      :userName="loginInfo.userName"
      @closeEvent="closeEvent"
    ></EditPassword>
    <!--密码登陆滑块验证-->
    <el-dialog
      title="请拖动滑块完成拼图"
      class="default-dialog-style"
      width="360px"
      v-dialogDrag
      v-if="showSliderVerify"
      :visible.sync="showSliderVerify"
      :close-on-click-modal="false"
    >
      <SliderVerify
        ref="sliderVerifyRef"
        @success="onSuccess"
        @fail="onFail"
        @again="onAgain"
      ></SliderVerify>
    </el-dialog>
  </div>
</template>

<script>
import { logIn } from '@/api/request/common'
import { encryptedData } from '@/utils/jsencrypt'
import EditPassword from '@/components/dialog/editPassword'
import SliderVerify from '@/views/login/sliderVerify'
export default {
  components: { EditPassword, SliderVerify },
  data() {
    return {
      loading: false,
      // 是否显示滑块验证
      showSliderVerify: false,
      captcha: {
        // 随机字符串
        nonceStr: '',
        // 验证值
        value: '',
        // 图片缓存
        tokenCache: null
      },
      loginInfo: {
        userName: '',
        passWord: ''
      },
      atUser: '',
      rules: {
        userName: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        passWord: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      forgetRules: {
        userName: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        question: [
          { required: true, message: '请输入安全问题', trigger: 'change' }
        ],
        answer: [{ required: true, message: '请输入问题答案', trigger: 'blur' }]
      },
      resetRules: {
        newPassWord: [
          {
            required: true,
            message: '请输入8至20位密码，包含数字、英文或特殊字符，两种以上',
            trigger: 'blur'
          },
          { min: 8, message: '至少8位密码', trigger: 'blur' },
          { max: 20, message: '最多20位密码', trigger: 'blur' },
          { validator: this.checkPwd1, trigger: 'blur' }
        ],
        newPassWordTry: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: this.checkPwd2, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    defaultPwd() {
      return this.$store.state.account.defaultPwd
    },
    apiLoading() {
      return this.$store.getters['system/getLoginLoading']
    }
  },
  created() {
    const token = this.$store.state.account.token
    if (!token.length) {
      // 清除所有登录记录
      this.$store.dispatch('account/clearStorage')
    } else {
      // 已登录状态，返回上一跳
      this.$router.go(-1)
    }
  },
  mounted() {
    this.$refs.nameRef.focus()
  },
  methods: {
    // 密码强度
    checkPwd1(rule, value, callback) {
      let level = 0
      // 判断这个字符串中有没有数字
      if (/[0-9]/.test(value)) {
        level++
      }
      // 判断字符串中有没有字母
      if (/[a-zA-Z]/.test(value)) {
        level++
      }
      // 判断字符串中有没有特殊符号
      if (/[^0-9a-zA-Z_]/.test(value)) {
        level++
      }
      if (level >= 2) {
        if (value === this.defaultPwd) {
          callback(new Error(`不能设为默认密码${this.defaultPwd}`))
        } else {
          callback()
        }
      } else {
        callback(
          new Error('密码强度不够，必须包含数字、英文或特殊字符，两种以上')
        )
      }
    },
    // 确认密码
    checkPwd2(rule, value, callback) {
      if (this.resetInfo.newPassWord2 !== this.resetInfo.newPassWord1) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    },
    handlePrevent() {
      return false
    },
    // 登录事件
    login() {
      this.$refs.loginFormRef.validate(this.loginValidate)
    },
    // 登录表单校验
    async loginValidate(valid) {
      if (valid) {
        this.showSliderVerify = true
      }
    },
    // 滑动验证成功
    onSuccess(captcha) {
      Object.assign(this.captcha, captcha)
      // 去掉弹出框
      this.showSliderVerify = false
      this.loginReq()
      this.refreshCode()
    },
    // 滑动验证失败
    onFail() {
      this.$message.error('验证失败，请控制拼图对齐缺口')
    },
    // 滑动验证异常
    onAgain() {
      this.$message.error('滑动操作异常，请重试')
      this.refreshCode()
    },
    // 刷新验证码
    refreshCode() {
      this.$refs.sliderVerifyRef.refresh()
    },
    /*
     * 方法名：loginReq
     * 关键参数：
     *    login_index 1：系统登录，2：答题登录，3：大屏展示
     *    captcha 人机交互信息，包含后台返回字符串，和滑块滑动距离
     * 功能描述：登录
     * 返回值：无
     *
     */
    async loginReq() {
      this.loading = true
      try {
        // 密码加密，RSA加密，公钥
        const publicKey = this.$store.getters['account/getPublicKey']
        let passWord = this.loginInfo.passWord
        passWord = encryptedData(publicKey, passWord)
        // 参数
        const params = {
          username: this.loginInfo.userName,
          password: passWord,
          captcha: this.captcha
        }
        const res = await logIn(params)
        // 修改默认密码功能保留，未实现
        if (res.data.errorCode === 110030) {
          // 默认密码提示修改密码
          this.$confirm(
            `登录密码不能为默认密码，请修改密码后再重新登录`,
            '提示',
            {
              customClass: 'default-message-style',
              closeOnClickModal: false,
              closeOnPressEscape: false,
              closeOnHashChange: false
            }
          )
            .then(() => {
              this.$refs.editPasswordRef.showDialog(params.username)
              const info = res.data.data || {}
              this.welcome(info, true)
            })
            .catch((e) => {
              console.log(e)
            })
        } else if (res.data.errorCode !== 110000) {
          // 登录失败
          this.$message.error(res.data.msg)
        } else {
          // 登录成功
          const info = res.data.list[0] || {}
          this.welcome(info)
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    // 登录成功
    welcome(info, isDefaultPsd) {
      this.loading = true
      // 获取并设置token
      const token = info.token
      this.$store.commit('account/setToken', token)
      let user = {
        userId: info.userId,
        ...info
      }
      this.$store.commit('account/setUser', user)
      this.$store.commit('account/setExpireTime', info.expireTime)
      // 跳转平台内页面
      if (!isDefaultPsd) {
        this.gotoHome(info)
      } else {
        this.loading = false
      }
    },
    // 跳转平台内页面
    gotoHome(info) {
      this.$router.replace('/index')
      this.loading = false
    },
    // 关闭修改密码窗口
    closeEvent(resetOk) {
      if (resetOk) {
        this.loginInfo.passWord = ''
        this.$refs.pwdRef.focus()
      }
    }
  }
}
</script>

<style lang="less">
.login-page {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  .left-bg {
    position: relative;
    width: 72%;
    height: 100%;
    background: url('~@/assets/img/login/bg_left_login.png') no-repeat;
    background-size: 100% 100%;
    .bg-text {
      position: absolute;
      left: 108px;
      bottom: 150px;
      .welcom-text {
        opacity: 0.8;
        font-size: 20px;
        color: #ffffff;
        line-height: 32px;
        letter-spacing: 2px;
      }
      .name-text {
        margin-top: 3px;
        font-size: 50px;
        font-family: 'Alibaba-PuHuiTi-Medium';
        color: #ffffff;
        line-height: 83px;
      }
      .eng-text {
        margin-top: 3px;
        opacity: 0.8;
        font-size: 16px;
        color: #ffffff;
        line-height: 26px;
        letter-spacing: 2px;
      }
      .sign-text {
        margin-top: 26px;
        width: 14px;
        height: 6px;
        opacity: 0.6;
        background: #ffffff;
        border-radius: 1px;
      }
    }
  }
  .content {
    width: 28%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .form {
      position: relative;
      width: calc(100% - 92px);
      .title-p1 {
        font-size: 32px;
        font-family: 'Alibaba-PuHuiTi-Medium';
        color: #0e1011;
        line-height: 46px;
        margin-bottom: 32px;
      }
      .el-form-item__label {
        color: #86909c;
        line-height: 22px;
        letter-spacing: 0px;
      }
      .el-input__icon {
        color: #0994ff;
      }
      .el-form {
        width: 100%;
      }
      .el-form-item {
        margin-bottom: 32px;
        width: 100%;
      }
      .el-icon-user,
      .el-icon-lock {
        font-size: 16px;
        color: #878d99;
      }
      .el-icon-blind:before {
        color: #878d99;
      }
      .el-form-item__error {
        padding-top: 2px;
      }
      .el-input__inner {
        border: 1px solid #e5e6eb;
        border-radius: 2px;
      }
      .code-input {
        width: 200px;
        margin-right: 20px;
      }
      .login-btn {
        width: 100%;
        height: 40px;
        background: #2985f7;
        color: #ffffff;
        font-family: 'Alibaba-PuHuiTi-Medium';
        letter-spacing: 4px;
        border-radius: 2px;
        margin-top: 40px;
        &:hover {
          opacity: 0.85;
        }
      }
      .el-button--text {
        color: #3b85e6;
      }
    }
  }
}
</style>

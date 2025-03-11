<template>
  <el-dialog
    v-dialogDrag
    class="default-dialog-style"
    width="520px"
    title="修改密码"
    v-loading="saveloading"
    :visible.sync="dialogShow"
    v-if="dialogShow"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true"
    @close="closeEvent"
  >
    <el-form
      :model="resetInfo"
      :rules="resetrules"
      ref="resetFormRef"
      label-position="top"
      class="default-form-style lineform"
    >
      <el-form-item label="登录账号" prop="userName">
        <el-input v-model="resetInfo.userName" disabled> </el-input>
      </el-form-item>
      <el-form-item label="修改密码" prop="newPassWord1">
        <el-input
          v-model.trim="resetInfo.newPassWord1"
          placeholder="请输入修改密码"
          show-password
          ref="inputref2"
          @keyup.enter.native="restPwd"
          @copy.native.capture.prevent="handlePrevent"
          @cut.native.capture.prevent="handlePrevent"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="newPassWord2">
        <el-input
          v-model.trim="resetInfo.newPassWord2"
          placeholder="请输入确认密码"
          show-password
          @keyup.enter.native="restPwd"
          @copy.native.capture.prevent="handlePrevent"
          @cut.native.capture.prevent="handlePrevent"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="安全问题" prop="secQuestionId">
        <el-select
          style="width: 100%"
          v-model="resetInfo.secQuestionId"
          placeholder="请选择安全问题"
        >
          <el-option
            v-for="(item, index) in secQuestionIdSel"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="答案" prop="secQuestionAnswer">
        <el-input
          v-model.trim="resetInfo.secQuestionAnswer"
          placeholder="请输入答案"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogShow = false">取消</el-button>
      <el-button size="small" type="primary" @click="restPwd">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 修改密码对话框
import {
  updateUserPwd,
  updateUserDefaultPwd,
  getQuesListPort
} from '@/api/request/system'
import { encryptedData } from '@/utils/jsencrypt'
export default {
  name: 'editPassword',
  props: {
    userName: {
      type: String,
      default: ''
    },
    needOld: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      secQuestionIdSel: [],
      saveloading: false,
      dialogShow: false,
      resetInfo: {
        userName: '',
        newPassWord1: '',
        newPassWord2: '',
        secQuestionId: '',
        secQuestionAnswer: ''
      }
    }
  },
  computed: {
    defaultPwd() {
      return this.$store.state.account.defaultPwd
    },
    resetrules() {
      return {
        resetOk: false,
        newPassWord1: [
          {
            required: true,
            message: '请输入8至20位密码，包含数字、英文或特殊字符，两种以上',
            trigger: 'blur'
          },
          { min: 8, message: '至少8位密码', trigger: 'blur' },
          { max: 20, message: '最多20位密码', trigger: 'blur' },
          { validator: this.checkPwd1, trigger: 'blur' }
        ],
        newPassWord2: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: this.checkPwd2, trigger: 'blur' }
        ],
        secQuestionId: [
          { required: true, message: '请选择安全问题', trigger: 'change' }
        ],
        secQuestionAnswer: [
          { required: true, message: '请输入答案', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handlePrevent() {},
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
    // 显示对话框
    showDialog(userName) {
      this.resetOk = false
      this.dialogShow = true
      this.resetInfo = {}
      this.resetInfo.userName = userName

      // 清除校验
      if (this.$refs.resetFormRef) {
        this.$refs.resetFormRef.clearValidate()
      }
      this.getQuesList()
    },
    async getQuesList() {
      this.secQuestionIdSel = []
      const res = await getQuesListPort()
      if (res && res.data && res.data.errorCode === 110000) {
        const info = res.data.list
        info.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.id
          }
          this.secQuestionIdSel.push(obj)
        })
      } else {
        this.$message.error(res.data.msg)
      }
    },
    // 提交事件
    restPwd() {
      this.$refs.resetFormRef.validate(this.restPwdValid)
    },
    // 请求修改密码接口
    async restPwdValid(valid) {
      if (valid) {
        this.saveloading = true
        let password = this.resetInfo.newPassWord1
        let cfpassword = this.resetInfo.newPassWord2
        password = password || ''
        cfpassword = cfpassword || ''
        // 用户名及新旧密码加密
        const publicKey = this.$store.getters['account/getPublicKey']
        password = encryptedData(publicKey, password)
        cfpassword = encryptedData(publicKey, cfpassword)
        // 请求参数
        let url = null
        let msg = ''
        let params = {
          userName: this.resetInfo.userName, // 用户名
          password: password, // 新密码
          confirmPassword: cfpassword, // 新密码确认
          secQuestionId: this.resetInfo.secQuestionId,
          secQuestionAnswer: this.resetInfo.secQuestionAnswer
        }
        if (this.needOld) {
          // 登录后修改密码
          url = updateUserPwd
          msg = '更新密码成功，需重新登录，即将跳转登录页面'
        } else {
          // 登录前修改默认密码
          url = updateUserDefaultPwd
          msg = '更新密码成功，请重新登录'
        }
        try {
          const ret = await url(params)
          if (ret.data.errorCode !== 110000) {
            this.$message.error(ret.data.msg)
            this.saveloading = false
          } else {
            // 修改成功
            this.resetOk = true
            this.$message.success(msg)
            this.closeEvent(this.resetOk)
            this.saveloading = false
            this.dialogShow = false
          }
        } catch (e) {
          this.saveloading = false
        }
      }
    },
    // 关闭对话框
    closeEvent() {
      this.$emit('closeEvent', this.resetOk)
    }
  }
}
</script>

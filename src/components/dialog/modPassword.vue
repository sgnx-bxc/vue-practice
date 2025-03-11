<template>
  <div class="modPassword-page">
    <el-dialog
      v-dialogDrag
      class="default-dialog-style"
      width="520px"
      :title="title"
      v-if="visible"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
      @close="handleClose"
      v-loading="loading"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="dialogForm"
        label-position="top"
        class="default-form-style lineform"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model.trim="formData.oldPassword"
            placeholder="请输入原密码"
            show-password
            @copy.native.capture.prevent="handlePrevent"
            @cut.native.capture.prevent="handlePrevent"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model.trim="formData.newPassword"
            placeholder="请输入新密码"
            show-password
            @copy.native.capture.prevent="handlePrevent"
            @cut.native.capture.prevent="handlePrevent"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model.trim="formData.confirmPassword"
            placeholder="请输入确认密码"
            show-password
            @copy.native.capture.prevent="handlePrevent"
            @cut.native.capture.prevent="handlePrevent"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取消</el-button>
        <el-button size="small" type="primary" @click="commitForm"
          >确定</el-button
        >
      </div></el-dialog
    >
  </div>
</template>

<script>
import { getModPasswordPort } from '@/api/request/system'
import { encryptedData } from '@/utils/jsencrypt'

export default {
  name: 'modPassword',
  data() {
    return {
      loading: false,
      title: '修改密码',
      visible: false,
      userId: this.$store.state.account.user.userId,
      formData: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [
          {
            required: true,
            message: '请输入原密码',
            trigger: 'blur'
          }
        ],
        newPassword: [
          {
            required: true,
            message: '请输入8至20位密码，包含数字、英文或特殊字符，两种以上',
            trigger: 'blur'
          },
          { min: 8, message: '至少8位密码', trigger: 'blur' },
          { max: 20, message: '最多20位密码', trigger: 'blur' },
          { validator: this.checkPwd1, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: this.checkPwd2, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    defaultPwd() {
      return this.$store.state.account.defaultPwd
    }
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
      if (this.formData.newPassword !== this.formData.confirmPassword) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    },
    handleOpen() {
      this.visible = true
    },
    commitForm() {
      this.$refs.dialogForm.validate(this.commitValidate)
    },
    commitValidate(valid) {
      if (valid) {
        this.getModPassword()
      }
    },
    async getModPassword() {
      const publicKey = this.$store.getters['account/getPublicKey']
      const params = {
        userId: this.userId,
        oldPassword: encryptedData(publicKey, this.formData.oldPassword),
        newPassword: encryptedData(publicKey, this.formData.newPassword)
      }
      this.loading = true
      const res = await getModPasswordPort(params)
      this.loading = false
      if (res && res.data && res.data.errorCode === 110000) {
        this.loading = true
        this.$message.success('修改密码成功，请重新登录')
        setTimeout(() => {
          this.$emit('logout')
          this.loading = false
        }, 1000)
      } else {
        this.$message.error(res.data.msg)
      }
    },
    handleClose() {
      this.visible = false
      this.$refs.dialogForm.clearValidate()
      this.$refs.dialogForm.resetFields()
      this.formData = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  }
}
</script>

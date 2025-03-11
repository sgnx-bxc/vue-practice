<template>
  <div class="addOrEditUserDialog-page">
    <el-dialog
      v-dialogDrag
      class="default-dialog-style"
      v-loading="loading"
      width="520px"
      :title="title"
      v-if="visible"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
      @close="handleClose"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="dialogForm"
        label-position="top"
        class="default-form-style lineform"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input
            :disabled="type === 'modify'"
            v-model.trim="formData.userName"
            placeholder="请输入用户名"
            :maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-tooltip
            effect="dark"
            placement="top"
            :content="'新用户默认密码为' + defaultPwd"
          >
            <el-input
              :disabled="true"
              v-model.trim="formData.password"
              show-password
            ></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model.trim="formData.email"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model.trim="formData.phone"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="type !== 'modify'" label="角色" prop="roleId">
          <el-select
            style="width: 100%"
            v-model="formData.roleId"
            placeholder="请选择角色"
          >
            <el-option
              v-for="(item, index) in roleData"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="type !== 'modify'" label="状态" prop="state">
          <el-radio-group v-model="formData.state">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">有效</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取消</el-button>
        <el-button size="small" type="primary" @click="commitForm"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { checkMobile } from '@/utils/validateUtils'
// import allDict from '@/utils/dict'
import { encryptedData } from '@/utils/jsencrypt'
import { getRoles, addUserPort, editUserPort } from '@/api/request/system'

export default {
  name: 'addOrEditUserDialog',
  data() {
    return {
      loading: false,
      // safeQuestion: allDict.safeQuestion,
      title: '',
      type: '',
      roleData: [],
      userId: '',
      visible: false,
      formData: {
        userName: '',
        password: '1234qwer',
        email: '',
        phone: '',
        roleId: '',
        // safeQuestion: '',
        // answer: '',
        state: 1
      },
      rules: {
        userName: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['blur', 'change']
          },
          {
            min: 4,
            max: 20,
            message: '长度在4到20个字符',
            trigger: ['blur', 'change']
          }
        ],
        roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
        state: [{ required: true, message: '请选择状态', trigger: 'change' }],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: ['blur', 'change']
          },
          {
            type: 'email',
            message: '请输入正确的邮箱',
            trigger: ['blur', 'change']
          }
        ],
        phone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: ['blur', 'change']
          },
          { validator: this.checkMobileRule, trigger: ['blur', 'change'] }
        ],
        safeQuestion: [
          { required: true, message: '请选择安全问题', trigger: 'change' }
        ],
        answer: [
          { required: true, message: '请输入答案', trigger: ['blur', 'change'] }
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
    checkMobileRule(rule, value, callback) {
      const v = value || ''
      if (checkMobile(v)) {
        callback()
      } else {
        callback(new Error('请输入正确的手机号'))
      }
    },
    handleOpen(type, dataRow) {
      this.visible = true
      this.type = type
      if (type === 'add') {
        this.title = '新增用户'
      }
      if (type === 'edit') {
        this.title = '编辑用户'
      }
      if (type === 'modify') {
        this.title = '账户信息编辑'
      }
      if (type === 'edit' || type === 'modify') {
        this.userId = dataRow.userId
        this.formData.userName = dataRow.name || ''
        this.formData.password = dataRow.password || '1234qwer'
        this.formData.email = dataRow.email || ''
        this.formData.phone = dataRow.phone || ''
        this.formData.roleId = dataRow.roleId || ''
        this.formData.safeQuestion = dataRow.safeQuestion || ''
        this.formData.answer = dataRow.answer || ''
        this.formData.state = parseInt(dataRow.status)
      }
      this.getRoleSelect()
    },
    async getRoleSelect() {
      this.roleData = []
      const res = await getRoles()
      if (res && res.data && res.data.errorCode === 110000) {
        const info = res.data.list
        info.forEach((item) => {
          let obj = {
            label: item.roleName,
            value: item.roleId
          }
          this.roleData.push(obj)
        })
      } else {
        this.$message.error(res.data.msg)
      }
    },
    commitForm() {
      this.$refs.dialogForm.validate(this.commitValidate)
    },
    commitValidate(valid) {
      if (valid) {
        if (this.type === 'add') {
          this.addUserHandle()
        }
        if (this.type === 'edit' || this.type === 'modify') {
          this.editUserHandle()
        }
      }
    },
    async addUserHandle() {
      const publicKey = this.$store.getters['account/getPublicKey']
      let password = this.formData.password
      password = encryptedData(publicKey, password)
      const params = {
        username: this.formData.userName,
        password: password,
        email: this.formData.email,
        phone: this.formData.phone,
        roleId: this.formData.roleId,
        status: this.formData.state
      }
      try {
        this.loading = true
        const res = await addUserPort(params)
        if (res && res.data && res.data.errorCode === 110000) {
          this.$message.success('添加用户成功')
          this.handleClose()
          this.$emit('getDatas')
        } else {
          this.$message.error(res.data.msg)
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    async editUserHandle() {
      const publicKey = this.$store.getters['account/getPublicKey']
      let password = this.formData.password
      password = encryptedData(publicKey, password)
      const params = {
        userId: this.userId,
        username: this.formData.userName,
        password: password,
        email: this.formData.email,
        phone: this.formData.phone,
        roleId: this.formData.roleId,
        status: this.formData.state
      }
      try {
        this.loading = true
        const res = await editUserPort(params)
        if (res && res.data && res.data.errorCode === 110000) {
          this.$message.success('修改用户成功')
          this.handleClose()
          this.$emit('getDatas', false)
        } else {
          this.$message.error(res.data.msg)
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    handleClose() {
      this.visible = false
      this.$refs.dialogForm.clearValidate()
      this.$refs.dialogForm.resetFields()
      this.formData = {
        userName: '',
        password: '1234qwer',
        email: '',
        phone: '',
        roleId: '',
        // safeQuestion: '',
        // answer: '',
        state: 1
      }
    }
  }
}
</script>

<style lang="less">
.addOrEditUserDialog-page {
}
</style>

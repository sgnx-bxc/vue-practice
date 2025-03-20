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
      :append-to-body="false"
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
        <el-form-item label="角色" prop="roleId">
          <el-select
            style="width: 100%"
            v-model="formData.roleId"
            placeholder="请选择角色"
          >
            <el-option
              v-for="(item, index) in roleDict"
              :key="index"
              :label="item.roleName"
              :value="item.roleId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <div class="switch-row-form">
            <el-switch
              v-model="formData.status"
              active-color="#5587ff"
              inactive-color="#c0c4cc"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
            <div class="startBtn" v-if="formData.status === 1">启用</div>
            <div class="stopBtn" v-else>停用</div>
          </div>
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
import { checkEmail, checkMobile } from '@/utils/validateUtils'
import { encryptedData } from '@/utils/jsencrypt'
import {
  getOriginAccountInfoPort,
  addAccountPort,
  editAccountPort
} from '@/api/request/aboutTab'

export default {
  name: 'addOrEditUserDialog',
  data() {
    return {
      loading: false,
      visible: false,
      title: '',
      type: '',
      originTableRow: '',
      roleDict: [],
      formData: {
        userName: '',
        password: '1234qwer',
        email: '',
        phone: '',
        roleId: '',
        status: 1
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
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: ['blur', 'change']
          },
          { validator: this.checkEmailRule, trigger: ['blur', 'change'] }
        ],
        phone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: ['blur', 'change']
          },
          { validator: this.checkMobileRule, trigger: ['blur', 'change'] }
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
    checkEmailRule(rule, value, callback) {
      const v = value || ''
      if (checkEmail(v)) {
        callback()
      } else {
        callback(new Error('请输入正确的邮箱'))
      }
    },
    checkMobileRule(rule, value, callback) {
      const v = value || ''
      if (checkMobile(v)) {
        callback()
      } else {
        callback(new Error('请输入正确的手机号'))
      }
    },
    handleOpen(params) {
      this.visible = true
      this.type = params.type
      this.roleDict = params.roleDict || []
      if (this.type === 'add') {
        this.title = '新增用户'
      } else if (this.type === 'edit') {
        this.title = '编辑用户'
        this.originTableRow = params.dataRow
        this.getOriginAccountInfo()
      }
    },
    async getOriginAccountInfo() {
      try {
        this.loading = true
        const params = {
          userId: this.originTableRow.userId
        }
        const res = await getOriginAccountInfoPort(params)
        if (res && res.data && res.data.errorCode === 110000) {
          const info = res.data.list[0] || {}
          this.formData = {
            userName: info.name,
            password: '1234qwer',
            email: info.email,
            phone: info.phone,
            roleId: info.roleId,
            status: info.status
          }
        } else {
          this.$message.error(res.data.msg || '获取原数据失败')
        }
      } catch (e) {
      } finally {
        this.loading = false
      }
    },
    commitForm() {
      this.$refs.dialogForm.validate(this.commitValidate)
    },
    commitValidate(valid) {
      if (valid) {
        if (this.type === 'add') {
          this.addUserHandle()
        } else if (this.type === 'edit') {
          this.editUserHandle()
        }
      }
    },
    async addUserHandle() {
      try {
        this.loading = true
        const params = this.getParams()
        const res = await addAccountPort(params)
        if (res && res.data && res.data.errorCode === 110000) {
          this.$message.success('新增用户成功')
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
      try {
        this.loading = true
        const params = this.getParams()
        params.userId = this.originTableRow.userId
        const res = await editAccountPort(params)
        if (res && res.data && res.data.errorCode === 110000) {
          this.$message.success('编辑用户成功')
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
    getParams() {
      const noReactionForm = JSON.parse(JSON.stringify(this.formData))
      const publicKey = this.$store.getters['account/getPublicKey']
      let password = noReactionForm.password
      password = encryptedData(publicKey, password)
      const obj = {
        username: noReactionForm.userName,
        password: password,
        email: noReactionForm.email,
        phone: noReactionForm.phone,
        roleId: noReactionForm.roleId,
        status: noReactionForm.status
      }
      return obj
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
        status: 1
      }
    }
  }
}
</script>

<style lang="less">
.addOrEditUserDialog-page {
  .switch-row-form {
    display: flex;
    align-items: center;
    .startBtn {
      margin-left: 12px;
      color: #29b641;
    }
    .stopBtn {
      margin-left: 12px;
    }
  }
}
</style>

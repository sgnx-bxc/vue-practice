<template>
  <header class="headerBlock">
    <div class="system-title" @click="goHome">THISISALOGO</div>
    <div class="header-user" :title="userName">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <i class="el-icon-user"></i>
          {{ userName || '--' }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="1">账户信息</el-dropdown-item>
          <el-dropdown-item command="2">修改密码</el-dropdown-item>
          <el-dropdown-item command="3">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 修改信息 -->
    <addOrEditUserDialog ref="addOrEditUserDialogRef"></addOrEditUserDialog>
    <!-- 修改密码 -->
    <modPassword ref="modPasswordRef" @logout="logout"></modPassword>
  </header>
</template>

<script>
// 页面头部
import addOrEditUserDialog from '@/components/dialog/addOrEditUserDialog'
import modPassword from '@/components/dialog/modPassword.vue'
import { logOut } from '@/api/request/common'
import { getUsers } from '@/api/request/system'
let self = null
export default {
  components: { addOrEditUserDialog, modPassword },
  data() {
    return {
      userName: '',
      curTime: '',
      timer: null,
      userId: null
    }
  },
  mounted() {
    self = this
    this.userName = this.$store.state.account.user.name
    this.userId = this.$store.state.account.user.userId
  },
  // 在Vue实例销毁前
  beforeDestroy() {
    self = null
  },
  computed: {
    roleName() {
      return this.$store.state.account.user.roleName
    }
  },
  methods: {
    // 用户下拉列表
    handleCommand(command) {
      if (command === '1') {
        this.getUserInfo()
      } else if (command === '2') {
        this.$refs.modPasswordRef.handleOpen()
      } else if (command === '3') {
        // 退出登录
        this.$confirm(`是否确定退出登录？`, '提示', {
          customClass: 'default-message-style'
        }).then(() => {
          self.logout()
        })
      }
    },
    async getUserInfo() {
      const params = {
        name: this.userName
      }
      const res = await getUsers(params)
      if (res && res.data && res.data.errorCode === 110000) {
        const info = res.data.list[0] || {}
        const type = 'modify'
        this.$refs.addOrEditUserDialogRef.handleOpen(type, info)
      } else {
        this.$message.error(res.data.msg)
      }
    },
    // 请求登出接口
    async logout() {
      const params = {
        userId: this.userId
      }
      const ret = await logOut(params)
      if (ret.data.errorCode === 110000) {
        window.location.href = '/'
        this.$store.dispatch('account/clearStorage')
      } else {
        this.$message.error(ret.data.msg)
      }
    },
    goHome() {
      this.$router.replace(`/aboutEcharts`)
    }
  }
}
</script>
<style lang="less">
.headerBlock {
  position: relative;
  width: calc(100% - 15px);
  height: 100%;
  padding-right: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  .addOrEditUserDialog-page {
    position: absolute;
  }
  .modPassword-page {
    position: absolute;
  }
  .system-title {
    width: 372px;
    font-size: 30px;
    font-family: 'Alibaba-PuHuiTi-Bold';
    color: #fff;
    margin-left: 20px;
    z-index: 9;
    cursor: pointer;
  }
  .header-user {
    display: flex;
    justify-content: center;
    position: relative;
    align-items: center;
    padding: 6px 10px;
    z-index: 2;
    .el-dropdown {
      color: #fff;
      margin-left: 15px;
      cursor: pointer;
    }
  }
}
// 下拉菜单样式
.el-dropdown-menu {
  padding: 0;
  box-shadow: 3px 3px 7px 0 rgba(31, 41, 72, 0.15);
  .el-dropdown-menu__item {
    text-align: center;
    border-top: 1px solid #e5e8ea;
  }
  .el-dropdown-menu__item:first-child {
    border: 0;
  }
  .el-dropdown-menu__item:focus,
  .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: #fff;
    color: #2985f7;
  }
}
.el-dropdown-user-version {
  font-size: 12px;
  font-family: 'Alibaba-PuHuiTi-Bold';
  text-align: center;
  cursor: default;
  &:hover {
    color: #606266 !important;
  }
}
</style>

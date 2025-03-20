<template>
  <div class="userManageTab-page">
    <tableForm
      ref="tableformRef"
      @searchEvent="searchEvent"
      @resetEvent="resetEvent"
    ></tableForm>
    <div class="default-table-title-style">
      <div class="left">用户列表（{{ total }}）</div>
      <div class="right">
        <el-button size="small" type="primary" @click="addHandle"
          >新增</el-button
        >
        <el-button size="small" type="primary" @click="batchDelete"
          >批量删除</el-button
        >
      </div>
    </div>
    <tableMain
      ref="tableRef"
      :tableFormRef="$refs.tableformRef"
      rowKey="userId"
    >
      <template v-slot:status="slotProps">
        <div class="switch-row">
          <el-switch
            :value="slotProps.tableScope.row.status"
            active-color="#5587FF"
            inactive-color="#C0C4CC"
            :active-value="1"
            :inactive-value="0"
            @change="switchChangeEvent(slotProps.tableScope.row, $event)"
          ></el-switch>
          <div class="startBtn" v-if="slotProps.tableScope.row.status === 1">
            启用
          </div>
          <div class="stopBtn" v-else>停用</div>
        </div>
      </template>
      <template v-slot:options="slotProps">
        <el-button type="text" @click="editHandle(slotProps.tableScope.row)"
          >编辑</el-button
        >
        <el-button type="text" @click="deleteHandle(slotProps.tableScope.row)"
          >删除
        </el-button>
      </template>
    </tableMain>
    <addOrEditUserDialog
      ref="addOrEditUserDialogRef"
      @getDatas="getDatas"
    ></addOrEditUserDialog>
  </div>
</template>

<script>
import tableForm from '@/components/table/tableForm.vue'
import tableMain from '@/components/table/tableMain.vue'
import tableMixin from '@/components/table/tableMixin'
import addOrEditUserDialog from './userManageTab/addOrEditUserDialog.vue'
import {
  getUserManageList,
  getAccountRolePort,
  editAccountPort,
  deleteAccountListPort
} from '@/api/request/aboutTab'

export default {
  name: 'userManageTab',
  mixins: [tableMixin],
  components: { tableForm, tableMain, addOrEditUserDialog },
  data() {
    return {
      roleDict: []
    }
  },
  mounted() {
    this.initForm()
    this.initTable()
    this.getDatas()
    this.getRoleSelect()
  },
  methods: {
    async getRoleSelect() {
      this.roleData = []
      const res = await getAccountRolePort()
      if (res && res.data && res.data.errorCode === 110000) {
        const info = res.data.list || []
        this.roleDict = info
      } else {
        this.$message.error(res.data.msg || '获取角色失败')
      }
    },
    initForm() {
      const option = {
        earliestDates: 180,
        rangeMaxDates: 180,
        formList: [
          {
            prop: 'keyword',
            type: 'el-input',
            placeholder: '请输入用户名关键字',
            default: ''
          }
        ]
      }
      if (this.$refs.tableformRef) {
        this.$refs.tableformRef.init(option)
      }
    },
    initTable() {
      const option = {
        tableTop: 56,
        pageSize: 20,
        rowKey: 'userId',
        showSelection: true,
        // 表头
        theadList: [
          {
            prop: 'name',
            label: '用户名',
            minWidth: 150
          },
          {
            prop: 'roleName',
            label: '角色',
            minWidth: 140
          },
          {
            prop: 'email',
            label: '邮箱',
            minWidth: 160
          },
          {
            prop: 'phone',
            label: '手机号',
            minWidth: 150
          },
          {
            prop: 'status',
            label: '状态',
            isSlot: true,
            minWidth: 130
          },
          {
            prop: 'createTime',
            label: '创建时间',
            sortable: 'custom',
            minWidth: 140
          },
          {
            prop: 'modifyTime',
            label: '修改时间',
            sortable: 'custom',
            minWidth: 140
          },
          {
            prop: 'options',
            label: '操作',
            isSlot: true,
            minWidth: 130,
            fixed: 'right'
          }
        ],
        // 数据请求
        url: getUserManageList,
        param: this.searchInfo
      }
      if (this.$refs.tableRef) {
        this.$refs.tableRef.init(option)
      }
    },
    switchChangeEvent(dataRow, type) {
      const map = {
        0: '确定停用此账户？',
        1: '确定启用此账户？'
      }
      this.$confirm(map[type], `${['停用', '启用'][type]}DNS黑名单`, {
        customClass: 'default-message-style'
      })
        .then(() => {
          this.switchChange(dataRow, type)
        })
        .catch(() => {
          // 恢复状态
          dataRow.status = [1, 0][type]
        })
    },
    async switchChange() {
      const res = await editAccountPort()
      if (res && res.data && res.data.errorCode === 110000) {
        this.$message.success('状态修改成功')
        this.getDatas(false)
      } else {
        this.$message.error(res.data.msg)
      }
    },
    addHandle() {
      const params = {
        type: 'add',
        roleDict: this.roleDict
      }
      this.$refs.addOrEditUserDialogRef.handleOpen(params)
    },
    editHandle(dataRow) {
      const params = {
        type: 'edit',
        roleDict: this.roleDict,
        dataRow
      }
      this.$refs.addOrEditUserDialogRef.handleOpen(params)
    },
    batchDelete() {
      let { selectionList } = this.$refs.tableRef
      if (
        selectionList &&
        selectionList.constructor === Array &&
        selectionList.length === 0
      ) {
        this.$message.warning('请选择需要删除的账户')
        return
      }
      this.$confirm(`确定删除选中的 ${selectionList.length} 条账户？`, '提示', {
        customClass: 'default-message-style delete'
      }).then(() => {
        const params = {
          ids: this.$refs.tableRef.selectionList
        }
        this.deleteAccountList(params)
      })
    },
    deleteHandle(dataRow) {
      this.$confirm(`是否确定删除该账户？`, '提示', {
        customClass: 'default-message-style delete'
      })
        .then(() => {
          const params = {
            ids: dataRow.userId
          }
          this.deleteAccountList(params, false)
        })
        .catch(() => {})
    },
    async deleteAccountList(params, isBatch = true) {
      const res = await deleteAccountListPort(params)
      if (res && res.data && res.data.errorCode === 110000) {
        this.$message.success('删除成功')
        this.$refs.tableRef.clearSelection()
        this.getDatas(isBatch)
      } else {
        this.$message.error(res.data.msg || '删除失败')
      }
    }
  }
}
</script>

<style lang="less">
.userManageTab-page {
  width: 100%;
  height: 100%;
  .switch-row {
    display: flex;
    align-items: center;
    justify-content: center;
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

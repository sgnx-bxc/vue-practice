<template>
  <div class="baseTable-page">
    <tableForm
      ref="tableformRef"
      @searchEvent="searchEvent"
      @resetEvent="resetEvent"
    ></tableForm>
    <div class="default-table-title-style">
      <div class="left">
        DNS黑名单列表（{{ total }}）
        <el-tooltip
          class="item"
          effect="dark"
          content="访问黑名单域名的流量将被拦截"
          placement="top"
        >
          <i class="el-icon-info info-icon"></i>
        </el-tooltip>
      </div>
      <div class="right">
        <el-button size="small" type="primary" @click="addHandle">
          新增
        </el-button>
        <el-button size="small" type="primary" @click="batchDelete"
          >批量删除
        </el-button>
      </div>
    </div>
    <tableMain ref="tableRef" :tableFormRef="$refs.tableformRef" rowKey="id">
      <template v-slot:featureTag="slotProps">
        <span
          v-if="
            !slotProps.tableScope.row.featureTag ||
            slotProps.tableScope.row.featureTag.length === 0
          "
          >--</span
        >
        <el-tag
          class="customTagStyle"
          v-for="item in slotProps.tableScope.row.featureTag"
          :key="item"
          size="small"
        >
          {{ item }}
        </el-tag>
      </template>
      <template v-slot:riskLevel="slotProps">
        <span
          class="riskLevelStyleCommon"
          :class="riskLevelStyleDict[slotProps.tableScope.row.riskLevel]"
        >
          {{
            slotProps.tableScope.row.riskLevel | textFilter(riskLevelDictMap)
          }}
        </span>
      </template>
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
      <template v-slot:riskStatus="slotProps">
        <div class="riskStatusFlex">
          <div
            class="rect"
            :class="riskStatusDictStyle[slotProps.tableScope.row.riskStatus]"
          ></div>
          <div class="rectContext">
            {{
              slotProps.tableScope.row.riskStatus
                | textFilter(riskStatusDictMap)
            }}
          </div>
        </div>
      </template>
      <template v-slot:options="slotProps">
        <el-button type="text" @click="editHandle(slotProps.tableScope.row)"
          >编辑
        </el-button>
        <el-button type="text" @click="deleteHandle(slotProps.tableScope.row)"
          >删除
        </el-button>
      </template>
    </tableMain>
    <addOrEditBaseDialog
      ref="addOrEditBaseDialogRef"
      @getDatas="getDatas"
    ></addOrEditBaseDialog>
  </div>
</template>

<script>
import tableForm from '@/components/table/tableForm.vue'
import tableMain from '@/components/table/tableMain.vue'
import tableMixin from '@/components/table/tableMixin'
import addOrEditBaseDialog from '@/views/aboutTable/baseTable/addOrEditBaseDialog.vue'
import allDict, { getdictMap } from '@/utils/dict'
import {
  getWhiteOrBlackList,
  updateListStatusPort,
  deleteBlackListPort,
  getAssetTypePort,
  getExecuteRangePort
} from '@/api/request/aboutTable'

export default {
  name: 'baseTable',
  mixins: [tableMixin],
  components: { tableForm, tableMain, addOrEditBaseDialog },
  data() {
    return {
      traitSignsDict: allDict.traitSignsDict,
      riskLevelDict: allDict.riskLevelDict,
      riskLevelStyleDict: allDict.riskLevelStyleDict,
      riskLevelDictMap: getdictMap(allDict.riskLevelDict, 'value'),
      riskStatusDict: allDict.riskStatusDict,
      riskStatusDictStyle: allDict.riskStatusDictStyle,
      riskStatusDictMap: getdictMap(allDict.riskStatusDict, 'value'),
      assetTypeDict: [],
      executeRangeDict: []
    }
  },
  filters: {
    textFilter(res, options) {
      const result = options[res].label || '--'
      return result
    }
  },
  mounted() {
    this.initForm()
    this.initTable()
    this.getDatas()
    this.getAssetType()
    this.getExecuteRange()
  },
  methods: {
    async getAssetType() {
      const res = await getAssetTypePort()
      if (res && res.data && res.data.errorCode === 110000) {
        const info = res.data.list || []
        this.assetTypeDict = info
      } else {
        this.$message.error(res.data.msg)
      }
    },
    async getExecuteRange() {
      const res = await getExecuteRangePort()
      if (res && res.data && res.data.errorCode === 110000) {
        const info = res.data.list || []
        const obj = {
          label: '地区',
          groupID: 0,
          children: info
        }
        this.executeRangeDict = [obj]
      } else {
        this.$message.error(res.data.msg)
      }
    },
    initForm() {
      const arr = [{ label: '全部', value: '' }]
      const option = {
        earliestDates: 180,
        rangeMaxDates: 180,
        formList: [
          {
            prop: 'keyword',
            type: 'el-input',
            placeholder: '请输入黑名单域名关键字',
            default: ''
          },
          {
            label: '特征标签',
            prop: 'featureTag',
            type: 'el-select',
            optionList: arr.concat(this.traitSignsDict),
            default: ''
          },
          {
            label: '风险等级',
            prop: 'riskLevel',
            type: 'el-select',
            optionList: arr.concat(this.riskLevelDict),
            default: ''
          },
          {
            label: '开始时间',
            prop: 'time',
            type: 'el-time-select',
            default: '7'
          }
        ]
      }
      if (this.$refs.tableformRef) {
        const st = this.$moment()
          .subtract(6, 'days')
          .format('YYYY-MM-DD 00:00:00')
        const et = this.$moment().format('YYYY-MM-DD 00:00:00')
        this.$set(this.searchInfo, 'startTime', st)
        this.$set(this.searchInfo, 'endTime', et)
        this.$set(this.searchInfo, 'time', 7)
        this.$refs.tableformRef.init(option)
      }
    },
    initTable() {
      const option = {
        tableTop: 56,
        pageSize: 20,
        rowKey: 'id',
        showSelection: true,
        theadList: [
          {
            prop: 'id',
            label: '策略ID',
            minWidth: 130
          },
          {
            prop: 'domainIp',
            label: '黑名单域名',
            minWidth: 160
          },
          {
            prop: 'remark',
            label: '备注',
            minWidth: 160
          },
          {
            prop: 'featureTag',
            label: '特征标签',
            isSlot: true,
            minWidth: 140
          },
          {
            prop: 'riskLevel',
            label: '风险等级',
            isSlot: true,
            minWidth: 130
          },
          {
            prop: 'status',
            label: '黑名单状态',
            isSlot: true,
            minWidth: 130
          },
          {
            prop: 'riskStatus',
            label: '处置状态',
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
            prop: 'createUser',
            label: '创建人',
            minWidth: 130
          },
          {
            prop: 'updateTime',
            label: '更新时间',
            sortable: 'custom',
            minWidth: 140
          },
          {
            prop: 'updateUser',
            label: '更新人',
            minWidth: 130
          },
          {
            prop: 'options',
            label: '操作',
            fixed: 'right',
            isSlot: true,
            minWidth: 130
          }
        ],
        url: getWhiteOrBlackList,
        param: this.searchInfo
      }
      if (this.$refs.tableRef) {
        this.$refs.tableRef.init(option)
      }
    },
    // 黑名单状态改变
    switchChangeEvent(dataRow, type) {
      const map = {
        0: '确定停用此DNS黑名单？停用后对该域名的DNS请求将被放行。',
        1: '确定启用此DNS黑名单？启用后所有指向该域名的访问请求将被拦截。'
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
    // 调用修改状态接口
    async switchChange() {
      const res = await updateListStatusPort()
      if (res && res.data && res.data.errorCode === 110000) {
        this.$message.success('状态修改成功')
        this.getDatas()
      } else {
        this.$message.error(res.data.msg)
      }
    },
    addHandle() {
      const params = {
        type: 'add',
        assetTypeDict: this.assetTypeDict,
        executeRangeDict: this.executeRangeDict
      }
      this.$refs.addOrEditBaseDialogRef.handleOpen(params)
    },
    editHandle(dataRow) {
      const params = {
        type: 'edit',
        assetTypeDict: this.assetTypeDict,
        executeRangeDict: this.executeRangeDict,
        dataRow
      }
      this.$refs.addOrEditBaseDialogRef.handleOpen(params)
    },
    batchDelete() {
      let { selectionList } = this.$refs.tableRef
      if (
        selectionList &&
        selectionList.constructor === Array &&
        selectionList.length === 0
      ) {
        this.$message.warning('请选择需要删除的黑名单')
        return
      }
      this.$confirm(
        `确定删除选中的 ${selectionList.length} 条黑名单列表？`,
        '提示',
        {
          customClass: 'default-message-style delete'
        }
      ).then(() => {
        const params = {
          ids: this.$refs.tableRef.selectionList
        }
        this.deleteBlackList(params)
      })
    },
    deleteHandle(dataRow) {
      this.$confirm(`是否确定删除该条黑名单？`, '提示', {
        customClass: 'default-message-style delete'
      })
        .then(() => {
          const params = {
            ids: dataRow.id
          }
          this.deleteBlackList(params, false)
        })
        .catch(() => {})
    },
    async deleteBlackList(params, isBatch = true) {
      const res = await deleteBlackListPort(params)
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
.baseTable-page {
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow: hidden;
  border-radius: 4px;
  box-sizing: border-box;
  .customTagStyle {
    background-color: #ffe4e6;
    color: #f56c6c;
    border: 1px solid #f56c6c;
  }
  .riskLevelStyleCommon {
    display: inline-block;
    padding: 0px 9px;
    border-radius: 4px;
    color: #fff;
  }
  .risk-level-3 {
    background-color: #ff7b74;
  }
  .risk-level-2 {
    background-color: #ffad44;
  }
  .risk-level-1 {
    background-color: #79adff;
  }
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
  .riskStatusFlex {
    display: flex;
    justify-content: center;
    align-items: center;
    .rect {
      width: 8px;
      height: 8px;
      margin-right: 6px;
      border-radius: 50%;
      &.dealing {
        background: #79adff;
      }
      &.dealLose {
        background: #a0b0ca;
      }
      &.dealFinish {
        background: #00b050;
      }
      &.dealNo {
        background: #ffa82c;
      }
    }
    .rectContext {
      max-width: calc(100% - 14px);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>

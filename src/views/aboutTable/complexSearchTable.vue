<template>
  <div class="complexSearchTable-page">
    <tableForm
      ref="tableformRef"
      @searchEvent="searchEvent"
      @resetEvent="resetEvent"
    ></tableForm>
    <div class="default-table-title-style">
      <div class="left">
        <div>告警日志列表（{{ total }}）</div>
      </div>
      <div class="right">
        <el-button size="small" type="primary" @click="batchDelete"
          >批量删除
        </el-button>
      </div>
    </div>
    <tableMain ref="tableRef" :tableFormRef="$refs.tableformRef" rowKey="id">
      <template v-slot:alarmLevel="slotProps">
        <span
          class="alarmLevelStyleCommon"
          :class="alarmLevelStyleDict[slotProps.tableScope.row.alarmLevel]"
        >
          {{
            slotProps.tableScope.row.alarmLevel | textFilter(alarmLevelDictMap)
          }}
        </span>
      </template>
      <template v-slot:alarmStatus="slotProps">
        <div class="alarmStatusFlex">
          <div
            class="rect"
            :class="alarmStatusDictStyle[slotProps.tableScope.row.alarmStatus]"
          ></div>
          <div class="rectContext">
            {{
              slotProps.tableScope.row.alarmStatus
                | textFilter(alarmStatusDictMap)
            }}
          </div>
        </div>
      </template>
      <template v-slot:options="slotProps">
        <el-button type="text" @click="deleteHandle(slotProps.tableScope.row)"
          >删除
        </el-button>
      </template>
    </tableMain>
  </div>
</template>

<script>
import tableForm from '@/components/table/tableForm.vue'
import tableMain from '@/components/table/tableMain.vue'
import tableMixin from '@/components/table/tableMixin'
import allDict, { getdictMap } from '@/utils/dict'
import {
  getAlarmLogList,
  deleteAlarmLogPort,
  getAlarmMultDictPort
} from '@/api/request/aboutTable'

export default {
  name: 'complexSearchTable',
  mixins: [tableMixin],
  components: { tableForm, tableMain },
  data() {
    return {
      attackStepDict: allDict.attackStepDict,
      alarmLevelDict: allDict.alarmLevelDict,
      alarmLevelStyleDict: allDict.alarmLevelStyleDict,
      alarmLevelDictMap: getdictMap(allDict.alarmLevelDict, 'value'),
      alarmStatusDict: allDict.alarmStatusDict,
      alarmStatusDictStyle: allDict.alarmStatusDictStyle,
      alarmStatusDictMap: getdictMap(allDict.alarmStatusDict, 'value')
    }
  },
  filters: {
    textFilter(res, options) {
      const result = options[res].label || '--'
      return result
    }
  },
  async mounted() {
    this.initForm()
    await this.initTable()
    this.getDatas()
  },
  methods: {
    initForm() {
      const option = {
        earliestDates: 180,
        rangeMaxDates: 180,
        formList: [
          {
            prop: 'keyword',
            type: 'el-input',
            placeholder: '请输入关键字',
            default: ''
          },
          {
            label: '攻击阶段',
            prop: 'attackStep',
            type: 'el-cascader',
            optionList: this.attackStepDict,
            default: ''
          },
          {
            label: '聚合查询',
            prop: 'aggregation',
            propObj: 'aggregationObj',
            type: 'cl-searchRegexpMain',
            default: '',
            defaultObj: {}
          }
        ]
      }
      if (this.$refs.tableformRef) {
        this.$refs.tableformRef.init(option)
      }
    },
    convertFiltersData(datas) {
      const newdatas = datas.map((item) => {
        const obj = {
          text: item,
          value: item
        }
        return obj
      })
      return newdatas
    },
    async initTable() {
      let info = {}
      const res = await getAlarmMultDictPort()
      if (res && res.data && res.data.errorCode === 110000) {
        info = res.data.list[0] || {}
      } else {
        this.$message.error(res.data.msg)
      }
      const alarmTypeNameList = info.alarmTypeNameList || []
      const alarmNameList = info.alarmNameList || []
      const alarmDescList = info.alarmDescList || []
      const alarmTypeNameDict = this.convertFiltersData(alarmNameList)
      const alarmNameDict = this.convertFiltersData(alarmTypeNameList)
      const alarmDescDict = this.convertFiltersData(alarmDescList)
      const option = {
        tableTop: 56,
        pageSize: 20,
        rowKey: 'id',
        showSelection: true,
        theadList: [
          {
            prop: 'recentTime',
            label: '最新发生时间',
            sortable: 'custom'
          },
          {
            prop: 'firstTime',
            label: '首次发生时间',
            sortable: 'custom'
          },
          {
            prop: 'alarmTypeName',
            label: '告警类别',
            filterMultiple: true,
            filters: alarmTypeNameDict,
            filterIsArr: true
          },
          {
            prop: 'alarmName',
            label: '告警名称',
            filterMultiple: true,
            filters: alarmNameDict,
            filterIsArr: true
          },
          {
            prop: 'alarmDesc',
            label: '告警描述',
            filterMultiple: true,
            filters: alarmDescDict,
            filterIsArr: true
          },
          {
            prop: 'alarmLevel',
            label: '告警等级',
            isSlot: true
          },
          {
            prop: 'sourceIp',
            label: '源IP'
          },
          {
            prop: 'destIp',
            label: '目的IP'
          },
          {
            prop: 'attackStep',
            label: '攻击阶段',
            sortable: 'custom'
          },
          {
            prop: 'attackNum',
            label: '发生次数'
          },
          {
            prop: 'alarmStatus',
            label: '处置状态',
            isSlot: true,
            fixed: 'right'
          },
          {
            prop: 'options',
            label: '操作',
            fixed: 'right',
            isSlot: true
          }
        ],
        url: getAlarmLogList,
        param: this.searchInfo
      }
      if (this.$refs.tableRef) {
        this.$refs.tableRef.init(option)
      }
    },
    batchDelete() {
      let { selectionList } = this.$refs.tableRef
      if (
        selectionList &&
        selectionList.constructor === Array &&
        selectionList.length === 0
      ) {
        this.$message.warning('请选择需要删除的日志')
        return
      }
      this.$confirm(
        `确定删除选中的 ${selectionList.length} 条告警日志？`,
        '提示',
        {
          customClass: 'default-message-style delete'
        }
      ).then(() => {
        const params = {
          ids: this.$refs.tableRef.selectionList
        }
        this.deleteAlarmLog(params)
      })
    },
    deleteHandle(dataRow) {
      this.$confirm(`是否确定删除该条日志？`, '提示', {
        customClass: 'default-message-style delete'
      })
        .then(() => {
          const params = {
            ids: dataRow.id
          }
          this.deleteAlarmLog(params, false)
        })
        .catch(() => {})
    },
    async deleteAlarmLog(params, isBatch = true) {
      const res = await deleteAlarmLogPort(params)
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
.complexSearchTable-page {
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow: hidden;
  border-radius: 4px;
  box-sizing: border-box;
  .alarmLevelStyleCommon {
    display: inline-block;
    padding: 0px 9px;
    border-radius: 4px;
    color: #fff;
  }
  .alarm-level-3 {
    background-color: #ff7b74;
  }
  .alarm-level-2 {
    background-color: #ffad44;
  }
  .alarm-level-1 {
    background-color: #79adff;
  }
  .alarmStatusFlex {
    display: flex;
    justify-content: center;
    align-items: center;
    .rect {
      width: 8px;
      height: 8px;
      margin-right: 6px;
      border-radius: 50%;
      &.dealFinish,
      &.feedbackFinish {
        background: #00b050;
      }
      &.dealNo,
      &.feedbackNo {
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

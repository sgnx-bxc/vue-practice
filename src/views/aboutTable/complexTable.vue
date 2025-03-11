<template>
  <div class="complexTable-page" :class="{ 'list-view': isListView }">
    <div class="assetLeak-content" v-show="!isListView">
      <div class="highFreq-leak">
        <div class="highFreq-header">
          <div class="header-left" title="TOP10高频漏洞">TOP10高频漏洞</div>
        </div>
        <div class="highFreq-main">
          <highFreqTop10Chart
            ref="highFreqTop10ChartRef"
            id="highFreqTop10ChartId"
          ></highFreqTop10Chart>
        </div>
      </div>
      <div class="assetFreq-leak">
        <div class="assetFreq-header">
          <div class="header-left" title="漏洞资产占比">漏洞资产占比</div>
        </div>
        <div class="assetFreq-main">
          <assetFreqTop10Chart
            ref="assetFreqTop10ChartRef"
            id="assetFreqTop10ChartId"
          ></assetFreqTop10Chart>
        </div>
      </div>
    </div>
    <div class="netSafe-content" id="alarmTableParent">
      <tableForm
        ref="tableformRef"
        @searchEvent="searchEvent"
        @resetEvent="resetEvent"
        class="complexTable-customTableForm"
      ></tableForm>
      <div class="default-table-title-style">
        <div class="left">网络安全事件列表（{{ total }}）</div>
        <div class="right">
          <el-button size="small" type="primary" @click="exportHandle"
            >导出</el-button
          >
          <el-button size="small" type="primary" @click="changeView">
            {{ isListView ? '收起' : '展开' }}
            <i
              :class="[
                'btn-rotate',
                isListView ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'
              ]"
            ></i>
          </el-button>
        </div>
      </div>
      <tableMain
        ref="tableRef"
        rowKey="id"
        @tableExpandChange="tableExpandChange"
      >
        <template v-slot:assetName="slotProps">
          <el-link
            v-if="slotProps.tableScope.row.assetName"
            type="primary"
            @click="lookView(slotProps.tableScope.row)"
            >{{ slotProps.tableScope.row.assetName }}
          </el-link>
          <span v-else>--</span>
        </template>
        <template v-slot:expand>
          <el-table :data="tableData" :height="subTableHeight">
            <el-table-column
              prop="updateTime"
              label="最新发生时间"
              show-overflow-tooltip
              :min-width="140"
            ></el-table-column>
            <el-table-column
              prop="firstTime"
              label="首次发生时间"
              show-overflow-tooltip
              :min-width="140"
            ></el-table-column>
            <el-table-column
              prop="alarmName"
              label="告警名称"
              show-overflow-tooltip
              :min-width="130"
            ></el-table-column>
            <el-table-column
              prop="alarmDesc"
              label="告警描述"
              show-overflow-tooltip
              :min-width="150"
            ></el-table-column>
            <el-table-column
              prop="alarmLevel"
              label="告警等级"
              show-overflow-tooltip
              :min-width="130"
            >
              <template slot-scope="scope">
                <span
                  class="alarmLevelStyleCommon"
                  :class="alarmLevelStyleDict[scope.row.alarmLevel]"
                >
                  {{ scope.row.alarmLevel | textFilter(alarmLevelDictMap) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="sourceIp"
              label="源IP"
              show-overflow-tooltip
              :min-width="130"
            ></el-table-column>
            <el-table-column
              prop="destIp"
              label="目的IP"
              show-overflow-tooltip
              :min-width="130"
            ></el-table-column>
            <el-table-column
              prop="attackStep"
              label="攻击阶段"
              show-overflow-tooltip
              :min-width="130"
            ></el-table-column>
            <el-table-column
              prop="attackNum"
              label="发生次数"
              show-overflow-tooltip
              :min-width="130"
            ></el-table-column>
            <el-table-column
              prop="alarmStatus"
              label="处置状态"
              show-overflow-tooltip
              :min-width="130"
            >
              <template slot-scope="scope">
                <div class="alarmStatusFlex">
                  <div
                    class="rect"
                    :class="alarmStatusDictStyle[scope.row.alarmStatus]"
                  ></div>
                  <div class="rectContext">
                    {{ scope.row.alarmStatus | textFilter(alarmStatusDictMap) }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="options" label="操作" :min-width="120" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" @click="viewHandle(scope.row)"
                  >查看详情</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="salaxy-table-pagination">
            <el-pagination
              small
              @current-change="handleCurrentChange"
              @size-change="sizeChange"
              :current-page="currentPage"
              :page-sizes="pageSizes"
              :page-size="pageSize"
              :total="pageTotal"
              layout="prev, pager, next, sizes, jumper"
            >
            </el-pagination>
          </div>
        </template>
      </tableMain>
    </div>
  </div>
</template>

<script>
import tableForm from '@/components/table/tableForm.vue'
import tableMain from '@/components/table/tableMain.vue'
import tableMixin from '@/components/table/tableMixin'
import highFreqTop10Chart from '@/views/aboutTable/complexTable/chart/highFreqTop10Chart.vue'
import assetFreqTop10Chart from '@/views/aboutTable/complexTable/chart/assetFreqTop10Chart.vue'
import allDict, { getdictMap } from '@/utils/dict'
import {
  getHighFreqLeakPort,
  getAssetFreqLeakPort,
  safeEventDetailList,
  getNetSafeList,
  exportAlarmPort
} from '@/api/request/aboutTable'

export default {
  name: 'complexTable',
  mixins: [tableMixin],
  components: {
    tableForm,
    tableMain,
    highFreqTop10Chart,
    assetFreqTop10Chart
  },
  data() {
    return {
      alarmLevelDict: allDict.alarmLevelDict,
      alarmLevelStyleDict: allDict.alarmLevelStyleDict,
      alarmLevelDictMap: getdictMap(allDict.alarmLevelDict, 'value'),
      alarmStatusDict: allDict.alarmStatusDict,
      alarmStatusDictStyle: allDict.alarmStatusDictStyle,
      alarmStatusDictMap: getdictMap(allDict.alarmStatusDict, 'value'),
      highFreqLeakInfo: [],
      assetFreqLeakInfo: {},
      isListView: false,
      subTableHeight: 200,
      currentRow: {},
      tableData: [],
      currentPage: 1,
      pageSizes: [10, 20, 30, 50, 100],
      pageSize: 20,
      pageTotal: 0
    }
  },
  filters: {
    textFilter(res, options) {
      const result = options[res].label || '--'
      return result
    }
  },
  mounted() {
    window.addEventListener('resize', this.setSubTableHeight)
    const tableParent = document.getElementById('alarmTableParent')
    tableParent.addEventListener('webkitTransitionEnd', this.transitionendEvent)
    this.getHighFreqLeak()
    this.getAssetFreqLeak()
    this.initForm()
    this.initTable()
    this.getDatas()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setSubTableHeight)
  },
  methods: {
    transitionendEvent() {
      if (this.$refs.tableRef) {
        this.$refs.tableRef.resizeHeight()
        this.setSubTableHeight()
      }
    },
    async getHighFreqLeak() {
      const res = await getHighFreqLeakPort()
      if (res && res.data && res.data.errorCode === 110000) {
        const info = res.data.list || []
        this.highFreqLeakInfo = info.map((item) => {
          const obj = {
            name: item.flawName,
            value: item.flawCount
          }
          return obj
        })
        this.$refs.highFreqTop10ChartRef.initCharts(this.highFreqLeakInfo)
      } else {
        this.$message.error(res.data.msg)
      }
    },
    async getAssetFreqLeak() {
      const res = await getAssetFreqLeakPort()
      if (res && res.data && res.data.errorCode === 110000) {
        const info = res.data.list[0] || {}
        this.assetFreqLeakInfo = info
        this.$refs.assetFreqTop10ChartRef.initCharts(this.assetFreqLeakInfo)
      } else {
        this.$message.error(res.data.msg)
      }
    },
    initForm() {
      const option = {
        earliestDates: 180,
        rangeMaxDates: 180,
        formList: [
          {
            label: '最新发生时间',
            prop: 'time',
            type: 'el-date-picker',
            default: null
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
        rowKey: 'id',
        showExpand: true,
        theadList: [
          {
            prop: 'assetName',
            label: '资产名称',
            isSlot: true,
            minWidth: 130
          },
          {
            prop: 'assetDistrict',
            label: '资产分区',
            minWidth: 130
          },
          {
            prop: 'assetIp',
            label: '资产IP',
            minWidth: 130
          },
          {
            prop: 'alarmTotal',
            label: '告警总数',
            minWidth: 130
          },
          {
            prop: 'recentTime',
            label: '最新发生时间',
            sortable: 'custom',
            minWidth: 140
          },
          {
            prop: 'firstTime',
            label: '首次发生时间',
            sortable: 'custom',
            minWidth: 140
          }
        ],
        url: getNetSafeList,
        param: this.searchInfo
      }
      if (this.$refs.tableRef) {
        this.$refs.tableRef.init(option)
      }
    },
    async exportHandle() {
      if (this.total === 0) {
        this.$message.warning('暂无数据')
      } else {
        const params = this.$refs.tableRef.getReqParam()
        try {
          await exportAlarmPort(params)
        } catch (e) {
          this.$message.error('导出失败')
        }
      }
    },
    changeView() {
      this.isListView = !this.isListView
    },
    tableExpandChange({ row, isExpand, rowIndex }) {
      if (isExpand) {
        this.currentPage = 1
        this.pageSize = 20
        this.currentRow = row
        this.initExpandData(rowIndex)
      }
    },
    async initExpandData(rowIndex) {
      const params = {
        id: this.currentRow.id,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      const res = await safeEventDetailList(params)
      if (res && res.data && res.data.errorCode === 110000) {
        const info = res.data.list || []
        this.tableData = info
        if (rowIndex || rowIndex === 0) {
          this.setSubTableHeight()
          this.$nextTick(() => {
            this.$refs.tableRef.doLayout()
            this.$refs.tableRef.scrollToRow(rowIndex)
          })
        }
      } else {
        this.$message.error(res.data.msg)
      }
    },
    setSubTableHeight() {
      this.subTableHeight = this.$refs.tableRef.defaultOption.tableHeight - 134
      if (this.subTableHeight < 150) {
        this.subTableHeight = 150
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.initExpandData()
    },
    sizeChange(val) {
      this.pageSize = val
      this.initExpandData()
    },
    viewHandle() {}
  }
}
</script>

<style lang="less">
.complexTable-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  .assetLeak-content {
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: space-between;
    .highFreq-leak,
    .assetFreq-leak {
      width: calc((100% - 12px) / 2);
      background-color: #fff;
      border-radius: 4px;
      .highFreq-header,
      .assetFreq-header {
        width: calc(100% - 40px);
        height: 56px;
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .header-left {
          font-size: 20px;
          font-family: 'Alibaba-PuHuiTi-Medium';
          color: #0e1011;
        }
      }
      .highFreq-main,
      .assetFreq-main {
        width: calc(100% - 40px);
        height: calc(100% - 56px);
        padding: 0 20px;
      }
    }
  }
  .netSafe-content {
    position: relative;
    width: 100%;
    height: calc(50% - 12px);
    background-color: #fff;
    border-radius: 4px;
    margin-top: 12px;
    transition: all 0.2s;
    .complexTable-customTableForm {
      position: absolute;
      top: 0;
      right: 200px;
      .btn-form-item .el-button {
        line-height: 1;
      }
      .el-form {
        padding-top: 14px;
      }
      .el-form.el-form--inline::after {
        height: 0;
      }
    }
    .btn-rotate {
      transform: rotate(90deg);
      margin-left: 2px;
    }
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
  &.list-view {
    .netSafe-content {
      height: 100%;
      margin-top: 0;
    }
  }
  .el-table th {
    padding: 0px;
    text-align: center;
    line-height: 40px;
    background: rgb(242, 245, 252);
  }
  .el-table td {
    padding: 6px 0;
    text-align: center;
    font-size: 12px;
    background: #fff;
  }
  .el-table thead {
    color: #333;
    font-weight: normal;
    font-size: 12px;
  }
  .el-table__empty-block {
    min-height: 36px;
  }
  .el-table__empty-text {
    line-height: 36px;
  }
  .el-table--border {
    border-bottom: 1px solid #ebeef5;
    border-radius: 4px;
  }
  .salaxy-table-pagination {
    display: flex;
    justify-content: flex-end;
    margin: 10px 0;
    user-select: none;
    .el-pagination {
      padding: 0;
      .el-pagination__jump {
        margin-right: 5px;
        .el-pagination__editor {
          .el-input__inner {
            height: 28px;
          }
        }
      }
    }
  }
}
</style>

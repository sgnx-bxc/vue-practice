<template>
  <div class="timeRangeRadio" :class="{ hasPicker: hasPicker }">
    <div
      class="radio-item"
      v-for="(item, index) in timeTypeList"
      :key="index"
      @click="timeTypeClick(index, item.type)"
      :class="{
        active: index === timeIndex,
        last: index === timeTypeList.length - 1
      }"
    >
      {{ item.label }}
      <i v-if="item.type === '4'" class="el-icon-date"></i>
    </div>
    <el-date-picker
      v-show="true"
      v-model="pickDate"
      ref="timePickerRef"
      :type="ifDateTime ? 'datetimerange' : 'daterange'"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-dd HH:mm:ss"
      popper-class="default-date-picker"
      :default-time="['00:00:00', '23:59:59']"
      :clearable="false"
      :picker-options="expireTimeOption"
      @change="timePickerChange"
    ></el-date-picker>
    <div class="time-tip" v-if="hasRangeText">
      {{ startTime }} ~ {{ endTime }}
    </div>
  </div>
</template>

<script>
// 时间跨度单选组件
// 2:0天-2天颗粒度1h，3:3天-7天颗粒度6小时，4:8-30天颗粒度1天，5:31天-90天颗粒度2天，6:91天-以上天颗粒度5天
const timeIntervalMap = {
  2: 60 * 60,
  3: 60 * 60 * 6,
  4: 60 * 60 * 24,
  5: 60 * 60 * 24 * 2,
  6: 60 * 60 * 24 * 5
}
export default {
  props: {
    hasPicker: {
      type: Boolean,
      default: true
    },
    hasRangeText: {
      type: Boolean,
      default: true
    },
    limitTime: {
      type: Boolean,
      default: false
    },
    ifDateTime: {
      type: Boolean,
      default: true
    }
  },
  data() {
    const self = this
    return {
      expireTimeOption: {
        disabledDate(date) {
          // 查询时间不能超过今日23:59:59
          const curdate = self.$moment().format('YYYY-MM-DD 23:59:59')
          const curdateTime = new Date(curdate).getTime()
          const monthdata = self
            .$moment()
            .subtract(6, 'months')
            .format('YYYY-MM-DD 23:59:59')
          const monthdataTime = new Date(monthdata).getTime()
          const dateTime = date.getTime()
          return dateTime > curdateTime || dateTime < monthdataTime
        }
      },
      timeIndex: 0, // 选中的tab
      startTime: '', // 开始时间
      endTime: '', // 结束时间
      timeLabel: 2, // 时间颗粒度 2-1小时 3-6小时 4-1天 5-2天 6-5天
      pickDate: null
    }
  },
  computed: {
    timeTypeList() {
      let list = [
        {
          label: '24小时',
          type: '1'
        },
        {
          label: '7天',
          type: '2'
        },
        {
          label: '30天',
          type: '3'
        }
      ]
      if (this.hasPicker) {
        list.push({
          label: '自定义',
          type: '4'
        })
      }
      return list
    }
  },
  methods: {
    // 初始化组件
    initTimeRangeRadio(timeType) {
      let index = this.$route.query.timeType || timeType
      let label = ''
      if (index !== undefined) {
        // 根据页面跳转参数timeType设置初始化时间
        index = parseInt(index)
        if (index === 0) {
          label = '1'
        } else if (index === 1) {
          label = '2'
        } else if (index === 2) {
          label = '3'
        } else {
          // 默认初始化显示7天
          index = 1
          label = '2'
        }
        this.timeTypeClick(index, label, false)
      } else {
        // 默认初始化显示7天
        index = 1
        label = '2'
        this.timeTypeClick(index, label, false)
      }
    },
    // tab点击事件
    timeTypeClick(index, label, flag) {
      if (label === '4') {
        // 自定义，打开时间选择器
        this.$refs.timePickerRef.focus()
      } else {
        this.timeIndex = index
        this.pickDate = null
        if (label === '1') {
          // 24小时
          this.startTime = this.$moment()
            .subtract('day', 1)
            .format('YYYY-MM-DD HH:mm:ss')
          this.endTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
          this.timeLabel = 2 // 1小时
        } else if (label === '2') {
          // 7天
          this.startTime = this.$moment()
            .subtract('day', 6)
            .format('YYYY-MM-DD 00:00:00')
          this.endTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
          this.timeLabel = 3 // 6小时
        } else if (label === '3') {
          // 30天
          this.startTime = this.$moment()
            .subtract('day', 29)
            .format('YYYY-MM-DD 00:00:00')
          this.endTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
          this.timeLabel = 4 // 1天
        }
        this.emit(flag)
      }
    },
    // 自定义时间选择事件
    timePickerChange() {
      if (this.pickDate !== null) {
        const st = this.pickDate[0]
        const et = this.pickDate[1]
        const interval = new Date(et) - new Date(st)
        // 根据时间颗粒度设置时间间隔
        // 颗粒度：2:0天-2天颗粒度1h，3:3天-7天颗粒度6小时，4:8-30天颗粒度1天，5:31天-90天颗粒度2天，6:91天-以上天颗粒度5天。
        const day = 24 * 60 * 60 * 1000
        const timeMap = {
          2: 2 * day,
          7: 7 * day,
          30: 30 * day,
          90: 90 * day,
          180: 180 * day
        }
        if (this.limitTime && interval > 30 * day) {
          this.$message.info('查询事件跨度不能超过30天')
          return
        }
        this.timeLabel = 2
        if (interval >= 0 && interval <= timeMap['2']) {
          this.timeLabel = 2
        } else if (interval > timeMap['2'] && interval <= timeMap['7']) {
          this.timeLabel = 3
        } else if (interval > timeMap['7'] && interval <= timeMap['30']) {
          this.timeLabel = 4
        } else if (interval > timeMap['30'] && interval <= timeMap['90']) {
          this.timeLabel = 5
        } else if (interval > timeMap['90']) {
          this.timeLabel = 6
        }
        this.timeIndex = 3
        this.startTime = st
        this.endTime = et
        this.emit()
      } else {
        // 当前选中自定义，二次自定义时清空时间，默认显示7天
        this.timeTypeClick(1, '2', true)
      }
    },
    // 更新参数
    emit(flag = true) {
      this.$emit('update:timeIndex', this.timeIndex)
      this.$emit('update:timeIndexAdd1', this.timeIndex + 1)
      this.$emit('update:startTime', this.startTime)
      this.$emit('update:endTime', this.endTime)
      this.$emit('update:timeLabel', this.timeLabel)
      this.$emit('update:timeInterval', timeIntervalMap[this.timeLabel])
      if (flag) {
        // 是否触发回调
        this.$emit('timeRangeChange')
      }
    }
  }
}
</script>
<style lang="less">
.timeRangeRadio {
  width: auto;
  height: 30px;
  display: flex;
  position: relative;
  .radio-item {
    cursor: pointer;
    min-width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 14px;
    color: #606266;
    background: #fff;
    padding: 0 15px;
    border-top: 1px solid #dcdfe6;
    border-bottom: 1px solid #dcdfe6;
    border-right: 1px solid #dcdfe6;
    z-index: 2;
    &:first-child {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      border-left: 1px solid #dcdfe6;
    }
    &.last {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
    &.active {
      border-left: 1px solid;
      border-color: #409eff;
      color: #409eff;
      .el-icon-date {
        color: #409eff;
      }
    }
  }
  .el-icon-date {
    color: #95a6c0;
  }
  .el-date-editor {
    width: 0;
    height: 28px;
    position: absolute;
    left: 0;
    z-index: 1;
  }
  &.hasPicker .el-date-editor {
    left: 200px;
  }
  .time-tip {
    line-height: 30px;
    font-size: 12px;
    color: #656668;
    margin-left: 8px;
  }
}
</style>

<template>
  <div :class="tableFormClass" @click.stop>
    <!-- formType=2时，展开状态下的底板遮罩背景 -->
    <div class="bottom-bg" :style="{ height: bgHeight + 'px' }"></div>
    <!-- 一、表单组件 -->
    <el-form
      id="tableForm-form"
      :model="formModel"
      :inline="true"
      @submit.native.prevent
    >
      <!-- 表单项 -->
      <el-form-item
        v-for="(item, index) in defaultOption.formList"
        v-show="item.notShow !== true"
        :key="item.prop + index"
        :label="item.label ? item.label + '：' : ''"
        :style="{ margin: item.margin }"
      >
        <!-- 1、日期时间范围选择器 -->
        <template v-if="item.type === 'el-date-picker'">
          <el-date-picker
            v-model="formModel[item.prop]"
            type="datetimerange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            popper-class="default-date-picker"
            :class="item.class"
            :style="{ width: item.width ? item.width : '350px' }"
            :clearable="item.clearable === undefined ? true : item.clearable"
            :default-time="['00:00:00', '23:59:59']"
            :picker-options="expireTimeOption"
            @change="search"
          ></el-date-picker>
        </template>
        <!-- 2、时段下拉选择器（自定义） -->
        <template v-if="item.type === 'el-time-select'">
          <!-- 2.1 固定时段 -->
          <el-select
            v-model="formModel[item.prop]"
            placeholder="请选择"
            :class="item.class"
            :clearable="false"
            :style="{ width: item.width ? item.width : '300px' }"
            @change="timeRangeChange"
          >
            <el-option
              v-for="(item, index) in timeRangeList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <!-- 2.2 自定义时段 -->
          <el-date-picker
            v-show="true"
            v-model="timeRangePickDate"
            class="inner-date-picker"
            ref="timePickerRef"
            type="datetimerange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            popper-class="default-date-picker"
            :default-time="['00:00:00', '23:59:59']"
            :clearable="false"
            :picker-options="expireTimeOption"
            @blur="timePickerChange()"
          ></el-date-picker>
        </template>
        <!-- 3、下拉单选/多选器 -->
        <template v-if="item.type === 'el-select'">
          <el-select
            v-model="formModel[item.prop]"
            placeholder="请选择"
            collapse-tags
            :class="item.class"
            :clearable="item.clearable === undefined ? true : item.clearable"
            :multiple="item.multiple === undefined ? false : item.multiple"
            :filterable="item.multiple === undefined ? true : false"
            :key="'select' + item.prop + keyindex"
            :style="{ width: item.width ? item.width : '200px' }"
            @change="search(item.changeCallback)"
          >
            <el-option
              v-for="(option, i) in item.optionList"
              :key="'select' + item.prop + keyindex + i"
              :label="
                (item.labelFun && item.labelFun(option)) ||
                option[item.labelKey || 'label'] ||
                '全部'
              "
              :value="option[item.valueKey || 'value']"
            ></el-option>
          </el-select>
        </template>
        <!-- 4、级联单选/多选器 -->
        <template v-if="item.type === 'el-cascader'">
          <el-cascader
            v-model="formModel[item.prop]"
            placeholder="请选择"
            collapse-tags
            :ref="'el-cascaderRef-' + item.prop"
            :class="item.class"
            :clearable="item.clearable === undefined ? true : item.clearable"
            :props="{
              multiple: item.multiple === undefined ? false : item.multiple,
              label: item.labelKey || 'label',
              value: item.valueKey || 'value',
              children: item.childrenKey || 'children'
            }"
            :filterable="item.multiple === undefined ? true : false"
            :show-all-levels="false"
            :options="item.optionList"
            :key="'select' + item.prop + keyindex"
            :style="{ width: item.width ? item.width : '200px' }"
            @change="search(item.changeCallback)"
          ></el-cascader>
        </template>
        <!-- 5、输入框 -->
        <template v-if="item.type === 'el-input'">
          <!-- 5.1.ruleNum为true，仅支持输入数字的输入框 -->
          <template v-if="item.ruleNum">
            <el-input
              v-model="formModel[item.prop]"
              :clearable="true"
              :placeholder="item.placeholder || '请输入'"
              :key="item.prop"
              :class="item.class"
              :style="{ width: item.width ? item.width : '200px' }"
              @input="inputContext(formModel[item.prop], item.prop)"
              @compositionstart="typing = true"
              @compositionend="typing = false"
              @clear="inputClear(item.prop)"
              @keyup.enter.native="search"
            ></el-input>
          </template>
          <!-- 5.2.通用输入框 -->
          <template v-else>
            <el-input
              v-model="formModel[item.prop]"
              :clearable="true"
              :placeholder="item.placeholder || '请输入'"
              :key="item.prop"
              :class="item.class"
              :style="{ width: item.width ? item.width : '200px' }"
              @clear="inputClear(item.prop)"
              @keyup.enter.native="search"
            ></el-input>
          </template>
        </template>
        <!-- 6、聚合查询 -->
        <template v-if="item.type === 'cl-searchRegexpMain'">
          <el-input
            placeholder="请选择关键字过滤条件"
            v-model="formModel[item.prop]"
            class="input-with-select"
            readonly
            :style="{ width: item.width ? item.width : '400px' }"
            @click.native.stop="textClick(item.prop, item.propObj)"
          ></el-input>
          <el-popover
            ref="filterPopRef"
            class="div-pop"
            placement="bottom-start"
            width="700px"
            trigger="click"
            popper-class="logSearchPart-popover"
          >
            <div class="pop-centent default-form-style">
              <div class="pop-title">关键字过滤</div>
              <searchRegexpMain ref="searchRegexpMainRef"></searchRegexpMain>
              <div class="pop-btns">
                <el-button
                  size="small"
                  type="primary"
                  @click="commitEvent(item.prop, item.propObj)"
                  >确定</el-button
                >
                <el-button plain size="small" @click="cancelEvent"
                  >取消</el-button
                >
                <el-button size="small" type="text" @click="clearEvent"
                  >清空过滤条件</el-button
                >
              </div>
            </div>
            <el-button ref="popRef" slot="reference">Regexp</el-button>
          </el-popover>
        </template>
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item class="btn-form-item" v-if="defaultOption.showBtn">
        <!-- 展开/收起 -->
        <el-button
          v-if="defaultOption.formType === 2"
          class="show-list-btn"
          type="text"
          size="mini"
          @click="showListEvent"
        >
          {{ showAllList ? '收起' : '展开' }}
          <i class="el-icon-d-arrow-left el-icon--right"></i>
        </el-button>
        <!-- 查询 -->
        <el-button
          plain
          size="small"
          type="primary"
          :class="defaultOption.queryClass"
          @click="search(null, true)"
        >
          查询
        </el-button>
        <!-- 重置 -->
        <el-button
          plain
          size="small"
          :class="defaultOption.resetClass"
          @click="reset"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 二、已选条件 -->
    <div
      id="tableForm-checked"
      class="active-list"
      v-if="defaultOption.formType === 2"
    >
      <div class="list-label">已选条件：</div>
      <div class="list-tags">
        <span v-if="tagsList.length === 0">--</span>
        <el-tabs type="card" @tab-remove="handleCloseTag(item, index)">
          <el-tab-pane
            v-for="(item, index) in tagsList"
            :key="item.prop + index"
          >
            <template slot="label">
              <el-tooltip
                class="item"
                effect="dark"
                placement="top"
                :content="`${item.label}：${item.tagtext}`"
              >
                <div class="tag-item" :class="{ closable: item.closable }">
                  {{ item.tagtext }}
                  <span
                    class="el-icon-close"
                    @click="handleCloseTag(item, index)"
                  ></span>
                </div>
              </el-tooltip>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
/** 表格查询条件表单组件 **/
import searchRegexpMain from '@/components/table/searchRegexp/searchRegexpMain.vue'
import { checkIp, checkIpRange } from '@/utils/ipv4Util'
import { getdictMap } from '@/utils/dict'
export default {
  name: 'tableForm',
  components: { searchRegexpMain },
  props: {},
  data() {
    const self = this
    return {
      /** 可配置参数 **/
      defaultOption: {
        formType: 1, // 1普通表单 2多条件下支持收起展开且有已选的表单
        showBtn: true, // 是否显示按钮区域
        queryClass: '', // 查询按钮的样式类
        resetClass: '', // 重置按钮的样式类
        earliestDates: 0, // 默认为0，0为不限制。用于设置el-time-select、el-date-picker可选的起始时间不能小于近earliestDates天
        rangeMaxDates: 30, // 默认限制30天。用于设置el-time-select选择的时间跨度不超过rangeMaxDates天
        timeRangeListConf: ['1', '7', '30', 'customize'], // 用于设置el-time-select自定义时段下拉选择器的下拉列表数据
        timeRangeEndFormat: '23:59:59', // 用于设置el-time-select自定义时段下拉选择器结束时间的格式
        // 表单项配置列表
        // (1)表单项组件参数：label、prop、type、class、width、clearable、optionList、multiple、labelKey、valueKey、childrenKey、placeholder、changeCallback
        // (2)自定义业务参数：default、rule、ruleNum、notShow
        formList: []
      },
      /** 内部参数 **/
      formModel: {}, // 所有表单项数据
      showAllList: false, // formType=2，是否展开所有查询条件表单项,
      tagsList: [], // formType=2，已选条件列表
      bgHeight: 0, // formType=2，展开时底板遮罩的高度
      collapseTimer: null, // 菜单展开收起定时器
      typing: false, // 输入结束停止标识
      // 日期时间选择器特有的选项
      expireTimeOption: {
        // 设置禁用状态，参数为当前日期date，要求返回Boolean
        disabledDate(date) {
          // 查询时间不能超过今日23:59:59
          const curdate = self.$moment().format('YYYY-MM-DD 23:59:59')
          const curdateTime = new Date(curdate).getTime()
          if (self.defaultOption.earliestDates === 0) {
            // 不限制可选的起始时间
            const dateTime = date.getTime()
            return dateTime > curdateTime
          } else {
            // 可选的起始时间不能小于近earliestDates天
            const monthdata = self
              .$moment()
              .subtract(self.defaultOption.earliestDates - 1, 'days')
              .format('YYYY-MM-DD 00:00:00')
            const monthdataTime = new Date(monthdata).getTime()
            const dateTime = date.getTime()
            return dateTime > curdateTime || dateTime < monthdataTime
          }
        }
      },
      timeSelectProp: '',
      timeSelectOldValue: '',
      timeRangeList: [],
      timeRangePickDate: null,
      keyindex: Date.parse(new Date())
    }
  },
  computed: {
    // 左侧菜单展开收起状态
    isCollapse() {
      return this.$store.getters['system/getIsCollapse']
    },
    // 当前组件样式
    tableFormClass() {
      const list = ['tableForm', 'default-form-style']
      list.push(`tableForm-type${this.defaultOption.formType}`)
      if (this.showAllList) {
        list.push('show-all-list-form2')
      }
      return list.join(' ')
    },
    // 记录时段下拉选择器所属的prop对应的最新的值
    timeSelectValue() {
      return this.formModel[this.timeSelectProp] || ''
    }
  },
  watch: {
    // 记录时段下拉选择器所属的prop对应的改变前的值
    timeSelectValue: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        if (oldVal !== '') {
          this.timeSelectOldValue = oldVal
        } else {
          this.timeSelectOldValue = newVal
        }
      }
    },
    // 监听菜单展开收起状态，重新计算底板背景高度
    isCollapse() {
      if (this.collapseTimer === null) {
        window.setTimeout(() => {
          this.changeBgHeight()
          window.clearTimeout(this.collapseTimer)
          this.collapseTimer = null
        }, 300)
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.changeBgHeight)
  },
  beforeDestroy() {
    document.removeEventListener('resize', this.documentClickEvent)
    window.removeEventListener('resize', this.changeBgHeight)
  },
  methods: {
    // 初始化配置项，进行配置项option的覆盖式合并
    init(option) {
      this.keyindex = Date.parse(new Date())
      // 进行配置项option的覆盖式合并
      this.defaultOption = Object.assign(this.defaultOption, option)
      // 设置自定义时段下拉选择器的下拉列表数据
      this.initTimeRangeList()
      // 设置表单默认值
      this.setDefaultValue()
      // formType=2时的初始化步骤
      if (this.defaultOption.formType === 2) {
        // 事件绑定
        document.addEventListener('click', this.documentClickEvent)
        this.$nextTick(() => {
          // 设置已选条件列表数据
          this.setTagsData()
        })
      }
      return this.formModel
    },
    // 设置表单默认值（参数propKey，指定prop设置默认值）（default数据类型需要根据表单项控件类型确定，支持function类型返回自定义默认值）
    setDefaultValue(isreset = false, propKey = '') {
      if (propKey === '') {
        this.formModel = {}
      }
      const formList = this.defaultOption.formList
      formList.forEach((item) => {
        const prop = item.prop
        if (propKey !== '' && propKey !== prop) {
          return
        }
        // 设置默认值
        let defaultValue = item.default
        if (defaultValue !== undefined) {
          // 自定义默认值为函数
          if (typeof defaultValue === 'function') {
            defaultValue = defaultValue()
          }
          // 设置各表单项默认值
          this.$set(this.formModel, item.prop, defaultValue)
          // 设置日期时间选择器的默认值
          if (item.type === 'el-date-picker' && defaultValue !== null) {
            const time = this.getTimeRange(defaultValue)
            this.$set(this.formModel, item.prop, time)
          }
          if (item.type === 'cl-searchRegexpMain' && defaultValue !== null) {
            this.$set(this.formModel, item.propObj, item.defaultObj)
          }
        }
        // 重置时将输入框类表单项值置为空，不恢复为默认值
        if (isreset && item.type === 'el-input') {
          this.$set(this.formModel, item.prop, '')
        }
        // 记录时段下拉选择器el-time-select所属的prop，并初始化其开始结束时间
        if (item.type === 'el-time-select') {
          this.timeSelectProp = item.prop
          this.timeRangeConvert()
        }
      })
    },
    // 查询事件
    search(callback = null, isBtn = false) {
      if (callback !== null && typeof callback === 'function') {
        // 自定义下拉框数据改变的回调事件changeCallback，不触发查询
        callback(this.formModel)
        return
      }
      // 各表单项校验
      const errMsg = this.checkFormItem()
      if (errMsg.length > 0) {
        const msgStr = []
        errMsg.forEach((errObj) => {
          msgStr.push(`${errObj.label}：${errObj.msg}`)
        })
        this.$message({
          type: 'error',
          dangerouslyUseHTMLString: true,
          message: msgStr.join('<br/>')
        })
        return
      }
      // 判断是否需要在查询按钮触发情况下做的特殊操作
      if (isBtn) {
        if (this.timeSelectProp !== '') {
          // 获取设置快捷选项最新的时间段
          this.timeRangeConvert()
        }
      }
      this.$nextTick(() => {
        // 设置已选条件列表数据
        this.setTagsData()
        // 将表单数据传给父组件
        this.$emit('searchEvent', this.formModel)
      })
    },
    // 表单项校验（rule值为ip、ipRange、ip&ipRange、time、number、required，类型string或array，如['ip&ipRange', 'required']、'ip&ipRange'、'ip'）
    checkFormItem() {
      let errMsg = []
      const formList = this.defaultOption.formList
      formList.forEach((item) => {
        const rule = item.rule
        const label = item.label || ''
        const itemValue = this.formModel[item.prop] || ''
        // 处理rule参数格式，转换为ruleArr
        const ruleType = Object.prototype.toString.call(rule)
        let ruleArr = []
        if (ruleType === '[object Array]') {
          ruleArr = rule
        } else if (ruleType === '[object String]') {
          ruleArr = [rule]
        }
        // 遍历ruleArr进行校验
        ruleArr.forEach((ruleItem) => {
          if (itemValue !== '') {
            if (ruleItem === 'ip' && !checkIp(itemValue)) {
              // ip校验
              errMsg.push({
                label,
                msg: 'IP地址格式不正确'
              })
            } else if (ruleItem === 'ipRange' && !checkIpRange(itemValue)) {
              // ip段校验
              errMsg.push({
                label,
                msg: 'IP段格式不正确，示例：192.168.0.1-192.168.0.16'
              })
            } else if (ruleItem === 'ip&ipRange') {
              // ip和ip段都校验
              if (itemValue.indexOf('-') === -1 && !checkIp(itemValue)) {
                errMsg.push({
                  label,
                  msg: 'IP地址格式不正确'
                })
              } else if (
                itemValue.indexOf('-') !== -1 &&
                !checkIpRange(itemValue)
              ) {
                errMsg.push({
                  label,
                  msg: 'IP段格式不正确，示例：192.168.0.1-192.168.0.16'
                })
              }
            } else if (ruleItem === 'time') {
              // 查询时段的校验
              const st = itemValue[0]
              const et = itemValue[1]
              const interval = new Date(et) - new Date(st)
              const day = 24 * 60 * 60 * 1000
              if (interval > this.defaultOption.rangeMaxDates * day) {
                errMsg.push({
                  label,
                  msg: `查询时间不能超过${this.defaultOption.rangeMaxDates}天`
                })
              }
            } else if (ruleItem === 'number') {
              // 数值类型校验
              const num = parseInt(itemValue.trim())
              if (!Number.isInteger(num)) {
                errMsg.push({
                  label,
                  msg: `${item.label}请输入数字`
                })
              }
            }
          } else {
            // 必填校验
            if (ruleItem === 'required') {
              errMsg.push({
                label,
                msg: '必填'
              })
            }
          }
        })
      })
      return errMsg
    },
    // 输入框限制只能输入数字(ruleNum为true)
    inputContext(text, prop) {
      const self = this
      setTimeout(function () {
        if (!self.typing) {
          self.formModel[prop] = text.replace(/[^0-9]/g, '')
        }
      }, 0)
    },
    // 重置事件
    reset() {
      // 恢复默认值
      this.setDefaultValue(true)
      this.$nextTick(() => {
        // 设置已选条件列表数据
        this.setTagsData()
        // 将表单数据传给父组件
        this.$emit('resetEvent', this.formModel)
      })
    },
    // 输入框清空按钮事件
    inputClear(prop) {
      this.formModel[prop] = ''
      // Reflect.deleteProperty(this.formModel, prop)
      this.search()
    },
    // ---------自定义时段下拉选择器el-time-select start----------
    // 设置自定义时段下拉选择器的下拉列表数据
    initTimeRangeList() {
      this.timeRangeList = []
      const timeRangeListConf = this.defaultOption.timeRangeListConf
      timeRangeListConf.forEach((time, index) => {
        let label = ''
        let value = time
        if (time === '1') {
          label = '最近24小时'
        } else if (time === 'customize') {
          label = `自定义（不超过${this.defaultOption.rangeMaxDates}天）`
        } else {
          label = `最近${time}天`
        }
        const conf = { label, value }
        this.timeRangeList.push(conf)
      })
    },
    // 时段下拉选择器el-time-select单选改变事件
    timeRangeChange(val) {
      if (val === 'customize') {
        // 自定义
        this.$refs.timePickerRef[0].focus()
      } else {
        // 触发查询
        this.timeRangeConvert()
        this.search()
      }
    },
    // 时段下拉选择器自定义时间选择改变事件
    timePickerChange() {
      const time = this.timeRangePickDate
      let timeStr = ''
      if (time !== null) {
        const st = time[0]
        const et = time[1]
        const interval = new Date(et) - new Date(st)
        const day = 24 * 60 * 60 * 1000
        if (interval > this.defaultOption.rangeMaxDates * day) {
          this.$message.warning(
            `查询时间不能超过${this.defaultOption.rangeMaxDates}天`
          )
        } else {
          timeStr = `${time[0]}~${time[1]}`
        }
      }
      if (timeStr !== '') {
        this.timeRangePickDate = null
        this.formModel[this.timeSelectProp] = timeStr
        // 删除自定义时间段
        if (
          this.timeRangeList.length ===
          this.defaultOption.timeRangeListConf.length + 1
        ) {
          this.timeRangeList.splice(0, 1)
        }
        // 在列表前端插入自定义时间段项
        this.timeRangeList.unshift({
          label: timeStr,
          value: timeStr
        })

        // 触发查询
        this.timeRangeConvert()
        this.search()
      } else {
        // 点击清空键或不选或选择的时间超过rangeMaxDates天，恢复之前的选中项
        this.formModel[this.timeSelectProp] = this.timeSelectOldValue
      }
    },
    // 时段下拉选择器根据选项计算开始和结束时间
    timeRangeConvert() {
      const value = this.formModel[this.timeSelectProp]
      const time = this.getTimeRange(value)
      const startTime = time[0]
      const endTime = time[1]
      this.$set(this.formModel, 'startTime', startTime)
      this.$set(this.formModel, 'endTime', endTime)
    },
    // 获取开始结束时间
    getTimeRange(value) {
      let startTime = ''
      let endTime = ''
      if (value.indexOf('~') !== -1) {
        // 自定义
        const times = value.split('~')
        startTime = times[0]
        endTime = times[1]
      } else if (value === '1') {
        // 24小时，精确到时分秒
        startTime = this.$moment()
          .subtract(1, 'days')
          .format('YYYY-MM-DD HH:mm:ss')
        endTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      } else {
        // 7天、30天、180天等等，结束时间默认当天23:59:59，支持格式化参数timeRangeEndFormat
        const format = this.defaultOption.timeRangeEndFormat
        const day = parseInt(value) - 1
        startTime = this.$moment()
          .subtract(day, 'days')
          .format('YYYY-MM-DD 00:00:00')
        endTime = this.$moment().format(`YYYY-MM-DD ${format}`)
      }
      return [startTime, endTime]
    },
    // ---------自定义时段下拉选择器el-time-select end----------
    // ---------自定义formType=2支持展开收起的表单 start----------
    // 所有表单项的展开收起事件
    showListEvent() {
      this.showAllList = !this.showAllList
      this.$nextTick(() => {
        this.changeBgHeight()
      })
    },
    // 计算展底板遮罩的高度
    changeBgHeight() {
      const formDom = document.getElementById('tableForm-form')
      const checkedDom = document.getElementById('tableForm-checked')
      if (formDom && checkedDom) {
        const height1 = formDom.offsetHeight
        const height2 = checkedDom.offsetHeight
        const height = height1 + height2
        this.bgHeight = height
      }
    },
    // 处理已选条件列表数据，最新数据放最前面
    setTagsData() {
      if (this.defaultOption.formType === 2) {
        this.tagsList = [] // 清空列表
        const formList = this.defaultOption.formList
        formList.forEach((item) => {
          const prop = item.prop
          const type = item.type
          const multiple = item.multiple
          let closable = item.clearable === undefined ? true : item.clearable
          const value = this.formModel[prop]
          const tagtextArr = []
          // 设置不同类型表单项的tag数据
          if (type === 'el-select') {
            const optionMap = getdictMap(item.optionList, 'value')
            if (multiple) {
              // 下拉多选
              value.forEach((v) => {
                tagtextArr.push({
                  tagtext: optionMap[v].label,
                  value: v
                })
              })
            } else if (value !== '') {
              // 下拉单选
              tagtextArr.push({
                tagtext: optionMap[value].label,
                value: value
              })
            }
          } else if (type === 'el-cascader') {
            // 级联单选/多选
            const ref = this.$refs[`el-cascaderRef-${prop}`][0]
            if (ref) {
              const nodes = ref.getCheckedNodes(true) // 获取叶子
              nodes.forEach((node) => {
                tagtextArr.push({
                  tagtext: node.label,
                  value: node.path
                })
              })
            }
          } else if (type === 'el-input') {
            // 输入框
            const inputValue = value || ''
            if (inputValue !== '') {
              tagtextArr.push({
                tagtext: inputValue,
                value: inputValue
              })
            }
            closable = true // 在已选中固定可删除
          } else if (type === 'el-date-picker') {
            // 日期时间范围选择器
            const timeValue = value || null
            if (timeValue !== null) {
              tagtextArr.push({
                tagtext: timeValue.join('~'),
                value: timeValue
              })
            }
          } else if (type === 'el-time-select') {
            // 时段下拉选择器（自定义）
            const optionMap = getdictMap(this.timeRangeList, 'value')
            tagtextArr.push({
              tagtext: optionMap[value].label,
              value: value
            })
            closable = false // 在已选中固定不可删除
          } else {
            console.log('不支持该类型表单项', type)
          }
          // 设置标签tag数据
          tagtextArr.forEach((obj) => {
            const tag = {
              ...item,
              tagtext: obj.tagtext,
              value: obj.value,
              closable: closable
            }
            this.tagsList.push(tag)
          })
        })
      }
    },
    // 删除已选条件
    handleCloseTag(tag, index) {
      // 从已选条件列表删除
      this.tagsList.splice(index, 1)
      // 重新设置对应表单项
      const multiple = tag.multiple
      if (multiple) {
        // 多选的选项，仅去除当前选项
        const value = this.formModel[tag.prop] || []
        const newVlue = []
        value.forEach((item) => {
          // item可能是字符串、数组
          const v1 = JSON.stringify(item)
          const v2 = JSON.stringify(tag.value)
          if (v1 !== v2) {
            newVlue.push(item)
          }
        })
        this.$set(this.formModel, tag.prop, newVlue)
      } else {
        // 其他选项，直接恢复默认值
        this.setDefaultValue(true, tag.prop)
      }
      // 将表单数据传给父组件
      this.$emit('searchEvent', this.formModel)
    },
    // 点击空白处收起展开的表单项，根组件加上@click.stop，阻止事件冒泡
    documentClickEvent(e) {
      const target = e.target
      const className = target.className
      if (
        this.showAllList &&
        className.indexOf('loading') === -1 &&
        className.indexOf('tooltip') === -1
      ) {
        this.showAllList = false
      }
    },
    // ---------自定义formType=2支持展开收起的表单 end----------
    // ---------自定义聚合查询 start----------
    // 输入框点击事件，展示或隐藏关键字过滤气泡弹框
    textClick(prop, propObj) {
      if (this.$refs.filterPopRef[0].showPopper) {
        this.closePop()
      } else {
        this.$refs.filterPopRef[0].showPopper = true
        this.$nextTick(() => {
          // 回显当前关键字
          if (this.formModel[prop]) {
            this.$refs.searchRegexpMainRef[0].setForm(this.formModel[propObj])
          } else {
            this.$refs.searchRegexpMainRef[0].resetForm()
          }
        })
      }
    },
    // 确定事件
    commitEvent(prop, propObj) {
      const { isErr, errMsg, rootStr, datas } =
        this.$refs.searchRegexpMainRef[0].getDatas()
      if (isErr) {
        this.$message.warning(errMsg)
      } else {
        this.formModel[propObj] = datas
        this.formModel[prop] = rootStr
        // 触发查询
        this.closePop()
        this.search()
      }
    },
    // pop取消事件
    cancelEvent() {
      this.closePop()
    },
    // pop清除事件
    clearEvent() {
      this.$refs.searchRegexpMainRef[0].resetForm()
    },
    // 手动关闭pop
    closePop() {
      this.$refs.filterPopRef[0].showPopper = false
    }
  }
}
</script>

<style lang="less">
.tableForm {
  .el-form {
    padding: 15px 0 0 30px;
    position: relative;
  }
  // 行内表单样式
  .el-form.el-form--inline {
    &::after {
      content: '';
      position: absolute;
      width: calc(100% - 60px);
      height: 1px;
      background: #d5dbe4;
      left: 30px;
      bottom: 0;
    }
    .el-form-item {
      margin-bottom: 0;
    }
    .el-form-item__content {
      line-height: 1;
    }
    .el-date-editor .el-range-input {
      font-size: 12px;
    }
  }
  // 表单项样式
  .el-form.el-form--inline .el-form-item {
    margin-bottom: 15px;
    margin-right: 15px;
  }
  .el-form-item__label {
    padding: 0 2px 0 0;
  }
  .el-select {
    z-index: 2;
  }
  .el-cascader__tags,
  .el-select__tags {
    flex-wrap: nowrap;
    max-width: 100px !important;
  }
  .inner-date-picker {
    width: 0 !important;
    position: absolute;
    left: 0;
    z-index: 1;
  }
  .input-with-select {
    z-index: 2;
    .el-input__inner {
      background-color: #fff;
      border-color: #dcdfe6;
      color: #606266;
      cursor: pointer;
    }
    .el-input__inner:hover {
      border-color: #c0c4cc;
    }
  }
  .div-pop {
    position: absolute;
    left: 0px;
    z-index: 1;
    .el-button {
      height: 30px;
    }
  }
  // 按钮表单项
  .btn-form-item {
    margin-right: 0;
    .el-button--primary {
      color: #fff;
      background: #409eff;
      border-color: #409eff;
      box-shadow: 0px 3px 0px 0px #f3f3f3;
      &:focus,
      &:hover {
        opacity: 0.7;
      }
      &.is-disabled {
        color: #333;
        background-color: #fff;
        border-color: #409eff;
        box-shadow: none;
        opacity: 0.3;
      }
    }
    .el-button--default {
      color: #333;
      background: #fff;
      border-color: #409eff;
      box-shadow: 0px 3px 0px 0px #f3f3f3;
      &:focus,
      &:hover {
        opacity: 0.7;
      }
      &.is-disabled {
        color: #333;
        background-color: #fff;
        border-color: #409eff;
        box-shadow: none;
        opacity: 0.3;
      }
    }
    .el-button {
      line-height: 1.15;
    }
  }
}
.logSearchPart-popover {
  padding: 15px;
  .pop-title {
    border-bottom: 1px dashed #d5dbe4;
    height: 30px;
    line-height: 30px;
    margin-bottom: 15px;
    font-weight: bold;
  }
  .pop-centent {
    width: 100%;
    .el-select {
      width: 100%;
    }
  }
  .pop-btns {
    margin-top: 25px;
    display: flex;
    justify-content: center;
  }
}
// formType=2，支持收起展开且有已选的表单样式
.tableForm.tableForm-type2 {
  width: 100%;
  height: 103px;
  position: relative;
  // 表单
  .el-form {
    padding: 15px 230px 0 30px;
    position: relative;
    height: 36px;
    overflow: hidden;
    background: #fff;
    &.el-form--inline::after {
      display: none;
    }
    .el-date-editor .el-range-input {
      width: calc((100% - 25px - 30px - 25px) / 2);
    }
    .btn-form-item {
      position: absolute;
      top: 15px;
      right: 30px;
      .show-list-btn {
        .el-icon--right {
          margin-left: 0;
          transform: rotateZ(-90deg);
          transition: transform 0.3s;
        }
      }
    }
  }
  // 已选条件
  .active-list {
    width: calc(100% - 60px);
    margin-left: 30px;
    margin-top: 10px;
    height: 40px;
    line-height: 40px;
    border-top: 1px dashed #d5dbe4;
    border-bottom: 1px solid #d5dbe4;
    background: #fff;
    display: flex;
    .list-label {
      width: 60px;
      font-size: 12px;
      font-weight: 400;
      color: #878d99;
      display: inline-block;
      margin-right: 10px;
    }
    .list-tags {
      width: calc(100% - 70px);
      display: inline-block;
      .el-tabs__header {
        margin: 0;
      }
      .el-tabs__item {
        padding: 0 6px 0 0;
      }
      .el-tabs--card > .el-tabs__header {
        border: none;
      }
      .el-tabs--card > .el-tabs__header .el-tabs__nav {
        border: none;
      }
      .el-tabs__item {
        border: none;
        line-height: 4;
      }
      .tag-item {
        background-color: #ecf5ff;
        display: inline-block;
        font-size: 12px;
        color: #409eff;
        border: 1px solid #d9ecff;
        border-radius: 4px;
        box-sizing: border-box;
        height: 24px;
        padding: 0 8px 0 8px;
        line-height: 22px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        position: relative;
        max-width: 300px;
        .el-icon-close {
          display: none;
          cursor: pointer;
          border-radius: 50%;
          text-align: center;
          font-size: 12px;
          height: 16px;
          width: 16px;
          line-height: 16px;
          vertical-align: middle;
          color: #409eff;
          margin-left: 0;
          position: absolute;
          right: 3px;
          top: 3px;
        }
        .el-icon-close:hover {
          color: #fff;
          background-color: #409eff;
        }
        &.closable {
          padding: 0 30px 0 8px;
          .el-icon-close {
            display: block;
          }
        }
      }
    }
  }
  // 底部背景
  .bottom-bg {
    display: none;
    width: calc(100% - 20px);
    position: absolute;
    background: transparent;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    top: 0;
    left: 10px;
    transition: height 0.3s;
    pointer-events: none;
  }
  // 展开时样式
  &.show-all-list-form2 {
    z-index: 2;
    .bottom-bg {
      display: block;
      z-index: 2;
    }
    .el-form {
      height: auto;
      overflow: auto;
      z-index: 1;
    }
    .el-form .btn-form-item .show-list-btn .el-icon--right {
      transform: rotateZ(90deg);
    }
    .active-list {
      z-index: 1;
      margin-top: 0;
      border-bottom: none;
    }
  }
}
</style>

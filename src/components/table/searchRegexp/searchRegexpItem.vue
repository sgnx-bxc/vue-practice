<template>
  <div class="searchRegexpItem">
    <!-- 字段 -->
    <el-select
      v-model="curRegexpItem.name"
      popper-class="default-select"
      placeholder="关键字段"
      :filterable="true"
      @change="propChange"
    >
      <el-option
        v-for="(item, index) in propList"
        :key="index"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <!-- 运算符 -->
    <el-select
      v-if="symbolList.length !== 0"
      v-model="curRegexpItem.operator"
      popper-class="default-select"
      :filterable="true"
      @change="operatorChange"
    >
      <el-option
        v-for="(item, index) in symbolList"
        :key="index"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <!-- 值（根据字段类型判断1枚举下拉2单值输入3范围输入） -->
    <div class="last-item" v-if="curRegexpItem.inputType === 1">
      <el-select
        popper-class="default-select"
        v-model="curRegexpItem.value"
        :placeholder="placeholderText"
        :filterable="true"
      >
        <el-option
          v-for="(item, index) in valueList"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div class="last-item" v-if="curRegexpItem.inputType === 2">
      <el-input
        maxlength="20"
        v-model.trim="curRegexpItem.value"
        :placeholder="placeholderText"
      ></el-input>
    </div>
    <div class="last-item" v-if="curRegexpItem.inputType === 3">
      <el-input
        maxlength="20"
        v-model.trim="curRegexpItem.value"
        :placeholder="placeholderText"
        class="small-input"
      ></el-input>
      <span>-</span>
      <el-input
        maxlength="20"
        v-model.trim="curRegexpItem.value2"
        :placeholder="placeholderText"
        class="small-input"
      ></el-input>
    </div>
    <!-- 删除按钮 -->
    <div v-if="showDelete" class="delete-item" @click="deleteItem">删除</div>
  </div>
</template>
<script>
import { getdictMap } from '@/utils/dict'
import { getPropList } from '@/components/table/searchRegexp/searchRegexpUtil'

export default {
  name: 'searchRegexpItem',
  props: {
    groupIndex: {
      type: String,
      default: ''
    },
    itemIndex: {
      type: Number,
      default: 0
    },
    regexpItem: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showDelete: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    regexpItem: {
      deep: true,
      immediate: true,
      handler() {
        this.curRegexpItem = JSON.parse(JSON.stringify(this.regexpItem))
        this.propChange()
      }
    }
  },
  data() {
    return {
      // 当前表单数据（name字段英文，operator运算符，inputType输入类型，value值）
      curRegexpItem: {},
      // 可选字段属性
      propList: getPropList(),
      // 运算符字典
      symbolList: [],
      // 枚举列表
      valueList: [],
      // 输入提示
      placeholderText: ''
    }
  },
  computed: {
    propListMap() {
      return getdictMap(this.propList, 'value')
    },
    symbolListMap() {
      return getdictMap(this.symbolList, 'value')
    }
  },
  methods: {
    /*
     * 方法名：propChange
     * 关键参数：text改变的条件字段
     * 功能描述：条件字段改变事件
     * 返回值：无
     */
    propChange(text = '') {
      const propObj = this.propListMap[this.curRegexpItem.name] || {}
      this.symbolList = propObj.symbolList || []
      this.valueList = propObj.valueList || []
      if (text) {
        // 运算符默认值
        this.$set(this.curRegexpItem, 'operator', this.symbolList[0].value)
      }
      this.operatorChange(text)
    },
    /*
     * 方法名：operatorChange
     * 关键参数：text改变的条件字段
     * 功能描述：运算符改变事件
     * 返回值：无
     */
    operatorChange(text = '') {
      const symbolObj = this.symbolListMap[this.curRegexpItem.operator] || {}
      this.curRegexpItem.inputType = symbolObj.inputType || 0
      this.placeholderText = symbolObj.placeholderText || ''
      if (text) {
        // 选择时触发
        if (this.curRegexpItem.inputType === 1) {
          // 下拉框默认值
          this.$set(this.curRegexpItem, 'value', this.valueList[0].value)
        } else if (this.curRegexpItem.inputType === 2) {
          // 单值输入框默认值
          this.$set(this.curRegexpItem, 'value', '')
        } else if (this.curRegexpItem.inputType === 3) {
          // 范围输入框默认值
          this.$set(this.curRegexpItem, 'value', '')
          this.$set(this.curRegexpItem, 'value2', '')
        }
      } else {
        // 回显时触发
        if (this.curRegexpItem.inputType === 3) {
          // 范围输入框回显
          const valueArr = this.curRegexpItem.value.split('-')
          this.$set(this.curRegexpItem, 'value', valueArr[0])
          this.$set(this.curRegexpItem, 'value2', valueArr[1])
        }
      }
    },
    /*
     * 方法名：deleteItem
     * 关键参数：无
     * 功能描述：删除当前条件项
     * 返回值：无
     */
    deleteItem() {
      this.$emit('deleteItem', this.groupIndex, this.itemIndex)
    },
    /*
     * 方法名：getDatas
     * 关键参数：无
     * 功能描述：获取当前条件语句
     * 返回值：data当前条件数据
     */
    getDatas() {
      // 英文字段对应中文
      const data = JSON.parse(JSON.stringify(this.curRegexpItem))
      const propObj = this.propListMap[data.name] || {}
      data.propLable = propObj.label
      // 下拉枚举字段对应中文
      if (data.inputType === 1) {
        const valueListMap = getdictMap(this.valueList, 'value')
        const valueObj = valueListMap[data.value] || {}
        data.valueLable = valueObj.label
      } else if (data.inputType === 2) {
        data.valueLable = data.value
      } else if (data.inputType === 3) {
        // 范围between操作符对应value需要将value和value2以逗号拼接
        data.value1 = data.value
        data.value = `${data.value}-${data.value2}`
        data.valueLable = data.value
      }
      return data
    }
  }
}
</script>

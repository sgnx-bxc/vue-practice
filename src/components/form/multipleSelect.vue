<template>
  <el-select
    multiple
    collapse-tags
    v-model="selectedArray"
    :placeholder="placeholder"
    @change="changeSelect"
    @remove-tag="removeTag"
  >
    <el-option
      :label="allSelectText"
      value="全选"
      @click.native="selectAll"
    ></el-option>
    <el-option
      v-for="(item, index) in options"
      :key="index"
      :label="item[labelField] || item.label || ''"
      :value="item[valueField] || item.value || ''"
    ></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'multipleSelect',
  props: {
    // 选项列表
    options: {
      type: Array,
      default: () => []
    },
    // 当前选中值 （双向绑定）
    inputValue: {
      type: Array,
      default: () => []
    },
    // 占位符
    placeholder: {
      type: String,
      default: '请选择'
    },
    // 全选显示文字
    allSelectText: {
      type: String,
      default: '全选'
    },
    // 值字段名
    valueField: {
      type: String,
      default: 'value'
    },
    // 显示字段名
    labelField: {
      type: String,
      default: 'label'
    }
  },
  data() {
    return {
      selectedArray: [...this.inputValue]
    }
  },
  watch: {
    inputValue(newVal) {
      if (JSON.stringify(newVal) !== JSON.stringify(this.selectedArray)) {
        this.selectedArray = [...newVal]
      }
    },
    selectedArray(newVal) {
      if (JSON.stringify(newVal) !== JSON.stringify(this.inputValue)) {
        this.$emit('update:inputValue', newVal)
      }
    }
  },
  methods: {
    selectAll() {
      if (this.selectedArray.length < this.options.length) {
        this.selectedArray = []
        this.options.map((item) => {
          this.selectedArray.push(item[this.valueField])
        })
        this.selectedArray.unshift('全选')
      } else {
        this.selectedArray = []
      }
    },
    changeSelect(val) {
      if (!val.includes('全选') && val.length === this.options.length) {
        this.selectedArray.unshift('全选')
      } else if (val.includes('全选') && val.length - 1 < this.options.length) {
        this.selectedArray = this.selectedArray.filter((item) => {
          return item !== '全选'
        })
      }
    },
    removeTag(val) {
      if (val === '全选') {
        this.selectedArray = []
      }
    }
  }
}
</script>

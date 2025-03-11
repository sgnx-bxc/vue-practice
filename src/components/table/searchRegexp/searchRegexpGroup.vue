<template>
  <div class="searchRegexpGroup">
    <div class="regexp-content">
      <!-- 1 与或 -->
      <div class="regexp-left">
        <el-select v-model="regexpGroup.flag" popper-class="default-select">
          <el-option
            v-for="(item, index) in typeList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <!-- 2 条件 -->
      <div class="regexp-right">
        <!-- 已选条件/条件组 -->
        <template v-for="(item, index) in regexpGroup.list">
          <searchRegexpItem
            v-if="item.regType === 1"
            :ref="'itemRef' + index"
            :key="groupIndex + '_item_' + index"
            :groupIndex="groupIndex"
            :itemIndex="index"
            :regexpItem="item"
            :showDelete="showDelete"
            @deleteItem="deleteItem"
          ></searchRegexpItem>
          <searchRegexpGroup
            v-if="item.regType === 2"
            :ref="'itemRef' + index"
            :key="'group_' + index"
            :groupLevel="groupLevel + 1"
            :groupIndex="groupIndex + '_' + index"
            :regexpGroup="item"
            :showDelete="showDelete"
            @addItem="addItem"
            @deleteItem="deleteItem"
            @addGroup="addGroup"
          ></searchRegexpGroup>
        </template>
        <!-- 添加条件组/条件 -->
        <div class="addItem-btns" v-if="regexpGroup.list.length < maxCount">
          <el-button
            v-if="showAddGroup"
            size="small"
            type="text"
            @click="addGroup"
            >添加条件组</el-button
          >
          <el-button size="small" type="text" @click="addItem"
            >添加条件</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import searchRegexpItem from '@/components/table/searchRegexp/searchRegexpItem.vue'

export default {
  name: 'searchRegexpGroup',
  components: { searchRegexpItem },
  props: {
    maxCount: {
      type: Number,
      default: 5
    },
    groupLevel: {
      type: Number,
      default: 1
    },
    groupIndex: {
      type: String,
      default: ''
    },
    regexpGroup: {
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
  data() {
    return {
      // 字典-与或
      typeList: [
        {
          label: 'AND',
          value: 'and'
        },
        {
          label: 'OR',
          value: 'or'
        }
      ]
    }
  },
  computed: {
    // 是否展示添加条件组，条件组最大2层
    showAddGroup() {
      return this.groupLevel < 2
    }
  },
  methods: {
    /*
     * 方法名：addItem
     * 关键参数：groupIndex条件组标识
     * 功能描述：添加条件
     * 返回值：无
     */
    addItem(groupIndex) {
      this.addGroupOrItem(groupIndex, 'addItem')
    },
    /*
     * 方法名：addGroup
     * 关键参数：groupIndex条件组标识
     * 功能描述：添加条件组
     * 返回值：无
     */
    addGroup(groupIndex) {
      this.addGroupOrItem(groupIndex, 'addGroup')
    },
    /*
     * 方法名：addGroupOrItem
     * 关键参数：groupIndex条件组标识，emitName自定义事件名称
     * 功能描述：添加条件组/条件
     * 返回值：无
     */
    addGroupOrItem(groupIndex, emitName) {
      const indexType = Object.prototype.toString.call(groupIndex)
      if (indexType === '[object String]') {
        this.$emit(emitName, groupIndex)
      } else {
        this.$emit(emitName, this.groupIndex)
      }
    },
    /*
     * 方法名：deleteItem
     * 关键参数：groupIndex条件组标识，条件标识
     * 功能描述：删除条件
     * 返回值：无
     */
    deleteItem(groupIndex, itemIndex) {
      this.$emit('deleteItem', groupIndex, itemIndex)
    },
    /*
     * 方法名：getDatas
     * 关键参数：无
     * 功能描述：获取条件组的条件数据
     * 返回值：newDatas当前条件组下所有条件数据
     */
    getDatas() {
      const newDatas = {
        ...this.regexpGroup,
        list: []
      }
      this.regexpGroup.list.forEach((item, index) => {
        const ref = this.$refs['itemRef' + index][0]
        const data = ref.getDatas()
        newDatas.list.push(data)
      })
      return newDatas
    }
  }
}
</script>

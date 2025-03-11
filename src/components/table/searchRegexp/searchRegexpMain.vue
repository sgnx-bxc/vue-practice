<template>
  <div class="searchRegexpMain-view default-form-style">
    <searchRegexpGroup
      key="grouproot"
      ref="rootRef"
      :groupLevel="1"
      groupIndex="-1"
      :regexpGroup="selectedObj"
      :maxCount="maxCount"
      :showDelete="showDelete"
      @addItem="addItem"
      @deleteItem="deleteItem"
      @addGroup="addGroup"
    ></searchRegexpGroup>
    <div class="group-line" :style="groupLineStyle"></div>
  </div>
</template>
<script>
/** 复杂多条件查询组件，当前仅支持2层条件组 **/
import searchRegexpGroup from '@/components/table/searchRegexp/searchRegexpGroup.vue'
import { getRootStr } from '@/components/table/searchRegexp/searchRegexpUtil'

export default {
  name: 'searchRegexpMain',
  components: { searchRegexpGroup },
  data() {
    const rootObj = {
      flag: 'and', // 条件或条件组之间的关系 AND/OR
      regType: 2, // 1是条件 2是条件组
      list: []
    }
    const groupObj = {
      flag: 'and', // 条件或条件组之间的关系 AND/OR
      regType: 2, // 1是条件 2是条件组
      list: [{ regType: 1 }]
    }
    return {
      maxCount: 5, // 每个父节点下最大子节点数
      groupLineStyle: {}, // 中间竖线样式
      rootObj: rootObj, // 默认根节点表单
      groupObj: groupObj, // 默认条件组表单
      selectedObj: JSON.parse(JSON.stringify(rootObj)) // 用于展示的数据结构
    }
  },
  computed: {
    // 是否展示删除按钮，限制只有一个条件时不能删除（不限制，因为查询时可以不填）
    showDelete() {
      // if (this.selectedObj.list.length === 1) {
      //   const obj = this.selectedObj.list[0]
      //   const regType = obj.regType
      //   if (regType === 1) {
      //     return false
      //   } else {
      //     const groupsLen = obj.list.length
      //     return groupsLen !== 1
      //   }
      // } else {
      //   return true
      // }
      return true
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
      const itemObj = JSON.parse(JSON.stringify({ regType: 1 }))
      this.addGroupOrItem(groupIndex, itemObj)
    },
    /*
     * 方法名：addGroup
     * 关键参数：groupIndex条件组标识
     * 功能描述：添加条件组
     * 返回值：无
     */
    addGroup(groupIndex) {
      const groupObj = JSON.parse(JSON.stringify(this.groupObj))
      groupObj.regType = 2
      this.addGroupOrItem(groupIndex, groupObj)
    },
    /*
     * 方法名：addGroupOrItem
     * 关键参数：groupIndex条件组标识，obj添加的条件/条件组数据结构
     * 功能描述：添加条件组/条件
     * 返回值：无
     */
    addGroupOrItem(groupIndex, obj) {
      if (groupIndex === '-1') {
        // 1层
        this.selectedObj.list.push(obj)
      } else {
        let group = {}
        const indexArr = groupIndex.split('_')
        if (indexArr.length === 2) {
          // 2层
          group = this.selectedObj.list[indexArr[1]]
        } else {
          console.error('超过条件组最大限制层数')
        }
        group.list.push(obj)
      }
      this.setStyleType()
    },
    /*
     * 方法名：deleteItem
     * 关键参数：groupIndex条件组标识，itemIndex条件标识
     * 功能描述：删除条件
     * 返回值：无
     */
    deleteItem(groupIndex, itemIndex) {
      if (groupIndex === '-1') {
        // 1层
        this.selectedObj.list.splice(itemIndex, 1)
      } else {
        let group = {}
        const indexArr = groupIndex.split('_')
        if (indexArr.length === 2) {
          // 2层
          group = this.selectedObj.list[indexArr[1]]
          if (group.list.length === 1) {
            // 子节点只剩一个则把改组父节点中删掉
            this.selectedObj.list.splice(indexArr[1], 1)
          } else {
            // 删掉子节点
            group.list.splice(itemIndex, 1)
          }
        }
      }
      this.setStyleType()
    },
    /*
     * 方法名：setStyleType
     * 关键参数：无
     * 功能描述：设置样式，主要是为了设置最后一个为条件组时，第一个是条件组时，左侧竖线的高度height
     * 返回值：无
     */
    setStyleType() {
      this.$nextTick(() => {
        const height = this.$refs.rootRef.$el.offsetHeight
        this.groupLineStyle = {
          height: height + 'px'
        }
      })
    },
    /*
     * 方法名：setForm
     * 关键参数：selectedObj当前组件展示所需数据结构
     * 功能描述：设置（回显）表达式结构
     * 返回值：无
     */
    setForm(selectedObj) {
      try {
        this.selectedObj = JSON.parse(JSON.stringify(selectedObj))
      } catch (e) {
        console.error('解析失败', e)
        this.selectedObj = JSON.parse(JSON.stringify(this.rootObj))
      }
      this.setStyleType()
    },
    /*
     * 方法名：resetForm
     * 关键参数：无
     * 功能描述：重置表达式结构
     * 返回值：无
     */
    resetForm() {
      this.selectedObj = JSON.parse(JSON.stringify(this.rootObj))
      this.setStyleType()
    },
    /*
     * 方法名：getDatas
     * 关键参数：无
     * 功能描述：获取最终配置的条件数据
     * 返回值：无
     */
    getDatas() {
      let isErr = false
      let errMsg = ''
      let rootStr = ''
      let datas = null
      try {
        datas = this.$refs.rootRef.getDatas()
        // 解析出对应的查询语句，同时校验语句正确性
        if (datas.list.length > 0) {
          const ret = getRootStr(datas)
          isErr = ret.isErr
          rootStr = ret.rootStr
          errMsg = ret.errMsg
        } else {
          // 根节点下无条件/条件组
          datas = null
        }
        if (isErr) {
          rootStr = ''
        }
      } catch (e) {
        console.error('解析失败', e)
        isErr = true
        errMsg = '关键字过滤表达式解析失败'
      }
      // 返回信息
      const ret = {
        isErr, // 是否错误的标识
        errMsg, // 错误信息
        datas, // 原始json数据
        rootStr // 查询语句
      }
      return ret
    }
  }
}
</script>
<style lang="less">
.searchRegexpMain-view {
  width: 100%;
  min-width: 600px;
  max-height: 350px;
  position: relative;
  overflow: auto;
  line-height: 34px;
  .searchRegexpGroup {
    .el-input__inner {
      padding: 0 8px;
    }
    .regexp-content {
      display: flex;
    }
    .regexp-left {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 80px;
      position: relative;
      &::after {
        content: '';
        height: 1px;
        width: 12px;
        background: #dcdfe6;
        position: absolute;
        left: 100%;
        top: calc(50% - 2px);
      }
    }
    .regexp-right {
      display: inline-block;
      width: calc(100% - 80px - 24px);
      margin-left: 24px;
      position: relative;
      & > div:last-child {
        margin-bottom: 0;
      }
      .searchRegexpGroup {
        position: relative;
        &::before {
          content: '';
          height: 1px;
          width: 12px;
          background: #dcdfe6;
          position: absolute;
          top: 50%;
          left: -12px;
        }
        .regexp-right {
          &::before {
            content: '';
            height: calc(100% - 33px - 10px);
            width: 1px;
            background: #dcdfe6;
            position: absolute;
            right: calc(100% + 12px);
            top: 15px;
          }
        }
        .searchRegexpItem,
        .addItem-btns {
          margin-bottom: 10px;
        }
      }
      .searchRegexpItem {
        margin-bottom: 10px;
        position: relative;
        &::before {
          content: '';
          height: 1px;
          width: 12px;
          background: #dcdfe6;
          position: absolute;
          right: 100%;
          top: 15px;
        }
        & > .el-select:nth-child(1) {
          width: 23%;
          margin-right: 5px;
        }
        & > .el-select:nth-child(2) {
          width: 23%;
          margin-right: 5px;
        }
        .last-item {
          width: calc(100% - 46% - 10px - 30px - 5px);
          display: inline-flex;
          justify-content: space-between;
          .el-input__count-inner {
            padding: 0 2px 0 2px;
          }
          .small-input {
            width: calc((100% - 5px) / 2);
          }
        }
        .delete-item {
          margin-left: 5px;
          width: 30px;
          font-size: 12px;
          cursor: pointer;
          color: #409eff;
          display: inline-block;
          &:hover {
            color: #66b1ff;
          }
        }
      }
      .addItem-btns {
        position: relative;
        height: 34px;
        &::before {
          content: '';
          height: 1px;
          width: 12px;
          background: #dcdfe6;
          position: absolute;
          right: 100%;
          top: 15px;
        }
        .el-button {
          margin-left: 5px;
        }
      }
    }
  }
  .group-line {
    position: absolute;
    width: 1px;
    height: 100%;
    background: #dcdfe6;
    top: 0;
    left: 92px;
  }
}
</style>

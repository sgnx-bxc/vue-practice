<template>
  <div class="treeMain-page">
    <!-- 搜索框 -->
    <div class="search-part" v-if="showSearch">
      <el-input
        size="small"
        :placeholder="searchPlaceholder"
        clearable
        v-model="filterText"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <el-scrollbar style="height: 100%">
      <!-- 全部 -->
      <div
        v-if="isHaveAll"
        class="tree-all"
        :class="{ active: !currentNodeKey && currentNodeKey !== 0 }"
        @click="clickAll"
      >
        全部
      </div>
      <!-- 树主体 -->
      <el-tree
        :node-key="nodeKey"
        class="default-tree-style"
        ref="treeRef"
        highlight-current
        :accordion="accordion"
        :default-expand-all="isDefaultExpandAll"
        :expand-on-click-node="isExpandOnClickNode"
        :data="treeData"
        :props="treeProps"
        :current-node-key="currentNodeKey"
        :filter-node-method="filterNode"
        @node-click="nodeClick"
      >
        <div
          class="slot-t-node"
          slot-scope="{ node, data }"
          @mouseenter="mouseenter(data)"
          @mouseleave="mouseleave(data)"
        >
          <template v-if="isNeedRegisterTemplate">
            <slot :treeNodeInfo="{ data, node }"></slot>
          </template>
          <template v-else-if="operateMenus.length > 0">
            <!-- tree文字 -->
            <div class="noramlLabel" :title="data[treeProps.label]">
              {{ data[treeProps.label] }}
            </div>
            <!-- tree图标 -->
            <div
              v-if="data.show"
              class="normalIcon"
              @click.stop="getOperateMenu($event)"
            >
              <span class="el-icon-menu treeHover"></span>
            </div>
            <!-- 点击图标的菜单 -->
            <div v-if="data.show && showOperateMenu" id="leftOperateMenu">
              <div
                v-for="(item, index) in operateMenus"
                :key="index"
                class="menu-list"
                @click.stop="operateClick(item, node, data)"
              >
                {{ item.label }}
              </div>
            </div>
          </template>
          <template>
            <div class="onlyLabel" :title="data[treeProps.label]">
              {{ data[treeProps.label] }}
            </div>
          </template>
        </div>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: 'treeMain',
  props: {
    // 是否展示过滤框
    showSearch: {
      type: Boolean,
      default: false
    },
    // 过滤框提示
    searchPlaceholder: {
      type: String,
      default: '请输入'
    },
    // 是否展示全部按钮
    isHaveAll: {
      type: Boolean,
      default: false
    },
    // 是否手风琴模式
    accordion: {
      type: Boolean,
      default: false
    },
    // 是否默认打开所有子节点
    isDefaultExpandAll: {
      type: Boolean,
      default: false
    },
    // 是否在点击节点的时候展开或者收缩节点
    isExpandOnClickNode: {
      type: Boolean,
      default: false
    },
    // 树数据
    treeData: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 唯一键
    nodeKey: {
      type: String,
      default: 'id'
    },
    // tree的字段值参数
    treeProps: {
      type: Object,
      default: () => {
        return {
          label: 'label',
          children: 'children',
          disabled: 'disabled',
          isLeaf: 'isLeaf',
          count: 'count'
        }
      }
    },
    // 是否重复点击节点
    repeatClick: {
      type: Boolean,
      default: false
    },
    // 菜单item
    operateMenus: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 是否要自定义内容
    isNeedRegisterTemplate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      filterText: '',
      showOperateMenu: false, // 是否展示菜单
      currentNodeKey: null // 当前节点key
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeRef.filter(val)
    }
  },
  methods: {
    // 初始化tree并设置默认node
    getTree(option) {
      this.$nextTick(() => {
        this.currentNodeKey = option.currentNodeKey
        this.$refs.treeRef.setCurrentKey(this.currentNodeKey)
      })
      return this.$refs.treeRef
    },
    // 节点点击事件
    nodeClick(data, node) {
      if (this.currentNodeKey !== node.key) {
        this.currentNodeKey = node.key
        this.$emit('nodeClick', data, node)
      } else if (this.repeatClick) {
        this.$emit('nodeClick', data, node)
      }
    },
    // 点击全部
    clickAll() {
      this.currentNodeKey = null
      this.$refs.treeRef.setCurrentKey(null)
      this.$emit('clickTreeAll')
    },
    // 鼠标移入显示更多图标
    mouseenter(data) {
      this.$set(data, 'show', true)
    },
    // 鼠标移出隐藏更多图标
    mouseleave(data) {
      this.$set(data, 'show', false)
      this.showOperateMenu = false
    },
    // 点击图标出现菜单
    getOperateMenu(event) {
      this.showOperateMenu = true
      this.$nextTick(() => {
        const menu = document.getElementById('leftOperateMenu')
        menu.style.left = event.clientX - 30 + 'px'
        menu.style.top = event.clientY + 10 + 'px'
      })
    },
    // 点击菜单暴漏事件
    operateClick(item, node, data) {
      this.showOperateMenu = false
      this.$set(data, 'show', false)
      this.$emit('treeNemuClickHandle', item, node, data)
    },
    // 树过滤
    filterNode(value, data) {
      if (!value) return true
      return data[this.treeProps.label].indexOf(value) !== -1
    }
  }
}
</script>

<style lang="less">
.treeMain-page {
  width: 100%;
  height: 100%;
  .search-part {
    width: 100%;
    height: 64px;
    border-bottom: 1px solid #d5dbe4;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-input-group {
      width: calc(100% - 30px);
    }
    .el-input-group__append,
    .el-input-group__prepend {
      background-color: #409eff;
      color: #fff;
      border: 1px solid #409eff;
      padding: 0 12px;
    }
  }
  .tree-part {
    width: 100%;
    height: calc(100% - 65px);
  }
  .tree-all {
    cursor: pointer;
    color: #181818;
    height: 17px;
    font-size: 13px;
    font-weight: 600;
    line-height: 17px;
    padding: 9px 12px;
    &.active {
      background: #eff5fb;
      color: #3291f7;
      position: relative;
      &::before {
        display: inline-block;
        content: '';
        width: 4px;
        height: 100%;
        background: #3291f7;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
  .default-tree-style {
    &.el-tree--highlight-current
      .el-tree-node.is-current
      > .el-tree-node__content {
      background: #eff5fb;
      color: #3291f7;
      position: relative;
      &::before {
        display: inline-block;
        content: '';
        width: 4px;
        height: 100%;
        background: #3291f7;
        position: absolute;
        left: 0;
      }
    }
    .el-tree-node__expand-icon {
      color: rgba(55, 73, 92, 0.6);
    }
    .el-tree-node__expand-icon.is-leaf {
      color: transparent;
      border-radius: 100%;
      height: 3px;
      width: 3px;
      padding: 0;
      margin: 0 11px;
    }
    .el-tree-node__content {
      height: 35px;
      .slot-t-node {
        position: relative;
        width: calc(100% - 24px);
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 35px;
        .noramlLabel {
          width: calc(100% - 40px);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .normalIcon {
          position: absolute;
          top: 1px;
          right: 15px;
          .treeHover {
            font-size: 16px;
            color: #3291f7;
            &:hover {
              opacity: 0.7;
            }
          }
        }
        #leftOperateMenu {
          width: 119px;
          position: fixed;
          top: 300px;
          left: 100px;
          border-radius: 4px;
          z-index: 9;
          box-shadow: 0px 4px 12px 0px rgba(14, 41, 109, 0.3);
          background-color: #fff;
          .menu-list {
            border-bottom: 1px solid #efefef;
            color: #333333;
            line-height: 32px;
            padding: 0 42px;
            &:hover {
              background-color: #eff5fb;
              color: #3291f7;
            }
            &:last-child {
              border-bottom: none;
            }
          }
        }
        .onlyLabel {
          width: calc(100% - 10px);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>

<template>
  <div class="dashboardFilterBoard-page">
    <div class="filter_board">
      <div class="left_tree" :class="{ left_border: url }">
        <el-tree
          :data="treeData"
          node-key="id"
          ref="cardTree"
          show-checkbox
          default-expand-all
          :expand-on-click-node="false"
          @check="getCheckednodes"
          @node-click="nodeClick"
        ></el-tree>
      </div>
      <div class="right_img_view" v-if="url">
        <div class="view_title">预览</div>
        <div class="view_content">
          <el-image fit="contain" :src="url">
            <div class="image-slot" slot="error">
              <i class="ismc-nonedata"></i>
            </div>
          </el-image>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dashboardFilterBoard',
  data() {
    return {
      url: '',
      // 默认选中的子项
      selectedIds: [],
      treeData: [
        {
          id: -1,
          label: '全部',
          children: []
        }
      ]
    }
  },
  watch: {},
  methods: {
    // 初始化数据
    initData(allCards) {
      this.selectedIds = []
      this.url = ''
      this.treeData[0].children = []
      // 更新树型目录的数据，和选中的状态点
      allCards.forEach((a) => {
        this.treeData[0].children.push({
          id: a.cardId,
          label: a.cardName,
          value: a.cardValue,
          url: require('@/assets/img/aboutGrid/card/' + a.cardValue + '.png')
        })
        if (a.isChecked) {
          this.selectedIds.push(a.cardId)
        }
      })
      // 需要等待树生成后在设置选中状态
      this.$nextTick(() => {
        this.selectedIds.forEach((item) => {
          this.$refs.cardTree.setChecked(item, true, false)
        })
      })
    },
    getCheckednodes(datas, selectedNodes) {
      let { checkedKeys, checkedNodes } = selectedNodes
      this.$emit('checkedCards', { checkedKeys, checkedNodes })
    },
    nodeClick(data) {
      this.$nextTick(() => {
        this.url = data.url
      })
    }
  },
  mounted() {}
}
</script>

<style lang="less">
.dashboardFilterBoard-page {
  height: 100%;
  font-size: 13px;
  max-width: 600px;
  .filter_board {
    display: flex;
    .left_tree {
      width: 210px;
      &.left_border {
        border-right: 1px solid #e6eef4;
      }
      .el-tree-node.is-expanded {
        margin: 5px 0;
      }
      .el-tree-node__label {
        margin-left: 7px;
      }
      .el-tree-node__content:hover {
        color: #409eff;
        background: #f4f7fa;
      }
    }
    .right_img_view {
      width: calc(100% - 210px);
      padding: 0 12px;
      display: flex;
      flex-direction: column;
      .view_title {
        height: 24px;
        font-size: 14px;
        line-height: 24px;
        color: #606266;
        padding: 5px 0;
        border-bottom: 1px solid #d5dbe4;
      }
      .view_content {
        flex: 1;
        display: flex;
        align-items: center;
        .el-image {
          height: calc(100% - 24px);
          width: 100%;
          .image-slot {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            background: #f5f7fa;
            color: #909399;
            .ismc-nonedata {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
}
</style>

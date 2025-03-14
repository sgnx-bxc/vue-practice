<template>
  <div class="assetManageTab-page">
    <!-- 1.左 -->
    <div class="div-left">
      <!-- 资产类别和资产分区的切换tab -->
      <div class="tab-part">
        <div
          :class="{ active: currentIndex === index }"
          v-for="(item, index) in showTabList"
          @click="changeTab(index)"
          :key="index"
        >
          {{ item }}
        </div>
      </div>
      <!-- 树形分类 -->
      <div class="tree-part">
        <treeMain
          ref="assetTreeRef"
          isHaveAll
          isDefaultExpandAll
          :treeData="assetTreeDict"
          :treeProps="defaultProps"
          @nodeClick="nodeClick"
          @clickTreeAll="clickTreeAll"
        >
        </treeMain>
      </div>
    </div>
    <!-- 2.右 -->
    <assetTable ref="assetTableRef" class="div-right"></assetTable>
  </div>
</template>

<script>
import treeMain from '@/components/tree/treeMain.vue'
import assetTable from '@/views/aboutTab/pageTabs/assetManageTab/assetTable.vue'
import { getAssetTreePort } from '@/api/request/aboutTab'

export default {
  name: 'assetManageTab',
  components: { treeMain, assetTable },
  data() {
    return {
      // tab
      currentIndex: 0,
      showTabList: ['资产类别', '资产分区'],
      // tree
      defaultProps: {
        children: 'childrenTypeList',
        label: 'typeName'
      },
      assetTreeDict: []
    }
  },
  mounted() {
    this.getAssetTree()
  },
  methods: {
    async getAssetTree() {
      const params = {
        assetSearch: this.currentIndex
      }
      const res = await getAssetTreePort(params)
      if (res && res.data && res.data.errorCode === 110000) {
        const info = res.data.list || []
        this.assetTreeDict = info
        this.$refs.assetTreeRef.getTree({ currentNodeKey: null })
      }
    },
    // 更新tab
    changeTab(index) {
      if (index !== this.currentIndex) {
        this.currentIndex = index
        this.getAssetTree()
        this.clickTreeAll()
      }
    },
    nodeClick(data) {
      const params = {
        assetSearch: this.currentIndex,
        assetTypeTree: data.id
      }
      this.$refs.assetTableRef.searchByAside(params)
    },
    clickTreeAll() {
      const params = {
        assetSearch: this.currentIndex,
        assetTypeTree: ''
      }
      this.$refs.assetTableRef.searchByAside(params)
    }
  }
}
</script>

<style lang="less">
.assetManageTab-page {
  width: 100%;
  height: 100%;
  display: flex;
  .div-left {
    width: 199px;
    height: 100%;
    border-right: 1px solid #e2e9ed;
    .tab-part {
      display: flex;
      width: 100%;
      height: 63px;
      > div {
        width: 50%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 15px;
        font-weight: 600;
        color: #000;
        line-height: 20px;
        position: relative;
        cursor: pointer;
      }
      .active {
        display: flex;
        &::after {
          content: '';
          width: 40px;
          height: 3px;
          position: absolute;
          background: linear-gradient(180deg, #409eff 0%, #0063da 100%);
          bottom: -1px;
          left: 50%;
          transform: translate(-50%, 0);
        }
      }
    }
    .tree-part {
      width: 100%;
      height: calc(100% - 63px);
    }
  }
  .div-right {
    width: calc(100% - 200px);
    height: 100%;
  }
}
</style>

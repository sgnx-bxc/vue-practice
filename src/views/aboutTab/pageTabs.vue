<template>
  <div class="pageTabs-page">
    <el-tabs v-model="tabName" class="default-page-tabs">
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="index"
        :name="index + ''"
        :label="item.text"
      >
      </el-tab-pane>
    </el-tabs>
    <div class="div-main">
      <component
        :is="tabList[tabName].component"
        :ref="`componentRef`"
      ></component>
    </div>
  </div>
</template>

<script>
import assetManageTab from '@/views/aboutTab/pageTabs/assetManageTab.vue'
import userManageTab from '@/views/aboutTab/pageTabs/userManageTab.vue'
import roleManageTab from '@/views/aboutTab/pageTabs/roleManageTab.vue'

export default {
  name: 'pageTabs',
  components: { assetManageTab, userManageTab, roleManageTab },
  data() {
    return {
      tabName: '0',
      tabList: [
        {
          text: '资产管理',
          component: 'assetManageTab'
        },
        {
          text: '用户管理',
          component: 'userManageTab'
        },
        {
          text: '角色管理',
          component: 'roleManageTab'
        }
      ]
    }
  },
  mounted() {
    this.$message.info('页面还在建设中。。。')
  }
}
</script>

<style lang="less">
.pageTabs-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 4px;
  box-sizing: border-box;
  .div-main {
    border-radius: 4px;
    width: 100%;
    height: calc(100% - 66px);
    background: #fff;
    margin-top: 10px;
  }
}
</style>

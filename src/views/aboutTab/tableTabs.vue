<template>
  <div class="tableTabs-page">
    <el-tabs v-model="tabName" class="default-tabs">
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
import fillContentOne from '@/views/aboutTab/tableTabs/fillContentOne.vue'
import fillContentTwo from '@/views/aboutTab/tableTabs/fillContentTwo.vue'

export default {
  name: 'tableTabs',
  components: { fillContentOne, fillContentTwo },
  data() {
    return {
      tabName: '0',
      tabList: [
        {
          text: '填充内容1',
          component: 'fillContentOne'
        },
        {
          text: '填充内容2',
          component: 'fillContentTwo'
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
.tableTabs-page {
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow: hidden;
  border-radius: 4px;
  box-sizing: border-box;
  .div-main {
    width: 100%;
    height: calc(100% - 48px);
  }
}
</style>

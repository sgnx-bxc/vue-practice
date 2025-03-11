<template>
  <div class="sideBarItem">
    <!-- 1 有子菜单 -->
    <el-submenu
      v-if="item.children"
      :index="item.menuPath || item.menuName"
      :class="{ rootItem: item.menuIcon }"
    >
      <!-- 1.1 一级菜单 -->
      <template slot="title">
        <i
          v-if="item.menuIcon"
          :class="'el-icon-document icon ' + item.menuIcon"
        ></i>
        <span
          class="menu-span"
          :class="{ 'rootItem-menu-span': item.menuIcon }"
          >{{ item.menuName }}</span
        >
      </template>
      <!-- 1.2 二级菜单 -->
      <template v-for="menu in item.children">
        <sideBarItem
          class="sub-sideBarItem"
          :key="menu.menuName"
          :item="menu"
        ></sideBarItem>
      </template>
    </el-submenu>
    <!-- 2 没有子菜单的一级菜单 -->
    <el-menu-item
      v-else
      :class="{ rootItem: item.menuIcon }"
      :index="item.menuPath || item.menuName"
    >
      <i
        v-if="item.menuIcon"
        :class="'el-icon-document icon ' + item.menuIcon"
      ></i>
      <template slot="title">
        <span
          class="menu-span"
          :class="{ 'rootItem-menu-span': item.menuIcon }"
          >{{ item.menuName }}</span
        >
      </template>
    </el-menu-item>
  </div>
</template>

<script>
export default {
  name: 'sideBarItem',
  props: ['item']
}
</script>

<style lang="less">
.sideBarItem {
  .sub-sideBarItem {
    padding: 10px 20px 0 20px;
    &:last-child {
      padding-bottom: 10px;
    }
    .el-menu-item {
      min-width: 160px;
      border-radius: 6px;
    }
  }
}
</style>

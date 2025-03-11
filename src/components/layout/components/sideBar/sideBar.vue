<template>
  <div class="sideBar">
    <div class="menu">
      <el-scrollbar style="height: 100%">
        <el-menu
          mode="vertical"
          ref="menu"
          @select="menuSelect"
          :default-active="menuActive"
          :collapse="isCollapse"
          :unique-opened="true"
          :collapse-transition="false"
          :key="keyChange"
        >
          <sideBarItem
            v-for="menu in menuList"
            :key="menu.menuPath"
            :item="menu"
          ></sideBarItem>
        </el-menu>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
// 左侧菜单
import sideBarItem from './sideBarItem'
export default {
  name: 'sideBar',
  components: { sideBarItem },
  props: ['isCollapse'],
  data() {
    return {
      menuActive: '',
      keyChange: ''
    }
  },
  computed: {
    menuList() {
      return this.$store.getters['account/getMenusBack']
    },
    userName() {
      return this.$store.state.account.user.name
    }
  },
  watch: {
    $route() {
      this.getActiveIndex()
    }
  },
  mounted() {
    this.getActiveIndex()
    this.$bus.$on('menuActiveChange', this.getActiveIndex)
  },
  methods: {
    getActiveIndex(keyChange) {
      if (keyChange) {
        this.keyChange = new Date().getTime()
      }
      let rightList = this.$store.getters['system/getAsyncRouter']
      const findUnqiue = rightList.find(
        (item) => item.path === this.$route.path
      )
      if (!findUnqiue) {
        this.gotoNonePage()
      }
      this.menuActive = findUnqiue.path
    },
    menuSelect(path) {
      this.$router.push(path)
    },
    gotoNonePage() {
      this.$router.push({
        path: '/403'
      })
    }
  }
}
</script>

<style lang="less">
.sideBar {
  background: transparent;
  .menu {
    height: 100%;
    width: 100%;
    .el-scrollbar .el-scrollbar__bar .el-scrollbar__thumb {
      background-color: rgba(191, 193, 197, 0.7);
    }
  }
  .el-menu {
    border-right: 0px;
    background: transparent;
    .el-submenu .el-menu-item {
      height: 42px;
      line-height: 42px;
      padding-left: 60px !important;
    }
    .el-submenu__title {
      transition: none;
      background-color: transparent;
      color: #fff;
    }
    .el-menu--popup {
      background: #37495c;
    }
    .el-menu-item {
      color: #fff;
      font-size: 12px;
    }
    .el-menu-item.is-active {
      color: #fff;
      background: linear-gradient(
        270deg,
        rgba(0, 99, 218, 1) 0%,
        rgba(64, 158, 255, 1) 100%
      ) !important;
      &.rootItem {
        background: transparent !important;
        color: #64b6ff;
      }
    }
    .el-submenu.is-active {
      .rootItem-menu-span,
      .el-submenu__title i {
        color: #64b6ff;
      }
    }
    .el-menu-item:focus,
    .el-menu-item:hover {
      background: linear-gradient(
        270deg,
        rgba(0, 99, 218, 1) 0%,
        rgba(64, 158, 255, 1) 100%
      );
    }
    .el-submenu__title i {
      color: #fff;
    }
    .el-menu-item.is-active,
    .el-submenu.is-active {
      .icon1 {
        background-image: url('~@/assets/img/layout/menu/icon1-hover.png');
      }
      .icon2 {
        background-image: url('~@/assets/img/layout/menu/icon2-hover.png');
      }
      .icon3 {
        background-image: url('~@/assets/img/layout/menu/icon3-hover.png');
      }
      .icon4 {
        background-image: url('~@/assets/img/layout/menu/icon4-hover.png');
      }
      .icon5 {
        background-image: url('~@/assets/img/layout/menu/icon5-hover.png');
      }
      .icon6 {
        background-image: url('~@/assets/img/layout/menu/icon6-hover.png');
        height: 20px;
      }
      .icon7 {
        background-image: url('~@/assets/img/layout/menu/icon7-hover.png');
      }
      .icon8 {
        background-image: url('~@/assets/img/layout/menu/icon8-hover.png');
      }
      .icon9 {
        background-image: url('~@/assets/img/layout/menu/icon9-hover.png');
      }
      .icon10 {
        background-image: url('~@/assets/img/layout/menu/icon10-hover.png');
      }
    }
    .el-icon-document {
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
      width: 20px;
      height: 20px;
      &.icon {
        background-color: transparent;
        &::before {
          content: '';
        }
      }
      &.icon1 {
        background-image: url('~@/assets/img/layout/menu/icon1.png');
      }
      &.icon2 {
        background-image: url('~@/assets/img/layout/menu/icon2.png');
      }
      &.icon3 {
        background-image: url('~@/assets/img/layout/menu/icon3.png');
      }
      &.icon4 {
        background-image: url('~@/assets/img/layout/menu/icon4.png');
      }
      &.icon5 {
        background-image: url('~@/assets/img/layout/menu/icon5.png');
      }
      &.icon6 {
        background-image: url('~@/assets/img/layout/menu/icon6.png');
        height: 20px;
      }
      &.icon7 {
        background-image: url('~@/assets/img/layout/menu/icon7.png');
      }
      &.icon8 {
        background-image: url('~@/assets/img/layout/menu/icon8.png');
      }
      &.icon9 {
        background-image: url('~@/assets/img/layout/menu/icon9.png');
      }
      &.icon10 {
        background-image: url('~@/assets/img/layout/menu/icon10.png');
      }
    }
  }

  .rootItem {
    .el-menu--inline {
      background: #294494;
    }
    .el-menu .el-submenu__title {
      background: #1f2d3d;
    }
    .menu-span {
      font-size: 12px;
    }
    .rootItem-menu-span {
      margin-left: 20px;
      font-size: 14px;
    }
  }

  .el-menu--collapse {
    .rootItem .el-submenu__icon-arrow {
      display: none;
    }
    .menu-span {
      display: none;
    }
  }
  .el-submenu [class^='el-icon-'] {
    width: 24px;
    height: 24px;
    font-size: 24px;
  }
}

// 菜单收起，isCollapse为true时的样式
.el-menu--popup {
  background: #294494 !important;
  .el-menu-item {
    color: #fff;
    line-height: 45px;
    height: 45px;
    font-size: 12px;
    border-radius: 6px;
    margin: 10px 15px;
  }
  .el-menu-item.is-active {
    color: #fff;
    background: linear-gradient(
      270deg,
      rgba(0, 99, 218, 1) 0%,
      rgba(64, 158, 255, 1) 100%
    ) !important;
  }
  .el-menu-item:focus,
  .el-menu-item:hover {
    background: linear-gradient(
      270deg,
      rgba(0, 99, 218, 1) 0%,
      rgba(64, 158, 255, 1) 100%
    );
  }
  .el-submenu__title {
    color: #fff;
    &:hover {
      background: #294494;
    }
  }
  .el-submenu__title i {
    color: #95a6c0;
  }
}
</style>

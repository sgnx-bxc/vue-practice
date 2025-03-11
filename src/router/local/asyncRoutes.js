export default [
  {
    path: '/aboutEcharts',
    component: () => import('@/views/aboutEcharts/dashboard.vue'),
    name: 'dashboard',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/aboutGrid',
    component: () => import('@/views/aboutGrid/gridLayout.vue'),
    name: 'gridLayout',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/aboutTable/baseTable',
    component: () => import('@/views/aboutTable/baseTable.vue'),
    name: 'baseTable',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/aboutTable/complexTable',
    component: () => import('@/views/aboutTable/complexTable.vue'),
    name: 'complexTable',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/aboutTable/complexSearchTable',
    component: () => import('@/views/aboutTable/complexSearchTable.vue'),
    name: 'complexSearchTable',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/aboutTab/pageTabs',
    component: () => import('@/views/aboutTab/pageTabs.vue'),
    name: 'pageTabs',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/aboutTab/tableTabs',
    component: () => import('@/views/aboutTab/tableTabs.vue'),
    name: 'tableTabs',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/aboutTree/baseTree',
    component: () => import('@/views/aboutTree/baseTree.vue'),
    name: 'baseTree',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/aboutTree/complexTree',
    component: () => import('@/views/aboutTree/complexTree.vue'),
    name: 'complexTree',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/aboutG6OrX6/baseG6',
    component: () => import('@/views/aboutG6OrX6/baseG6.vue'),
    name: 'baseG6',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/aboutG6OrX6/baseX6',
    component: () => import('@/views/aboutG6OrX6/baseX6.vue'),
    name: 'baseX6',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/aboutG6OrX6/editorG6',
    component: () => import('@/views/aboutG6OrX6/editorG6.vue'),
    name: 'editorG6',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/aboutG6OrX6/editorX6',
    component: () => import('@/views/aboutG6OrX6/editorX6.vue'),
    name: 'editorX6',
    meta: {
      keepAlive: true
    }
  }
]

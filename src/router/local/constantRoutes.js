// 固定路由
export default [
  {
    path: '/404',
    component: () => import('@/views/errorPage/404.vue')
  },
  {
    path: '/login',
    component: () => import('@/views/login/login.vue')
  }
]

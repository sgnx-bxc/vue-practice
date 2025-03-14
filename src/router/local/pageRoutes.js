/**
 * 需要登录后鉴权的，脱离布局容器的组件页面
 * meta参数说明
 * activeId：对应父页面菜单id
 * name：菜单项或路由页面名称
 **/
export default [
  {
    path: '/situationAwareness/assetSituation',
    component: () => import('@/views/situationAwareness/assetSituation.vue')
  },
  {
    path: '/situationAwareness/interAttackSituation',
    component: () =>
      import('@/views/situationAwareness/interAttackSituation.vue')
  },
  {
    path: '/situationAwareness/exterAttackSituation',
    component: () =>
      import('@/views/situationAwareness/exterAttackSituation.vue')
  }
]

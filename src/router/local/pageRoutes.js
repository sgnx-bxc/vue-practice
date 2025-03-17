/**
 * 需要登录后鉴权的，脱离布局容器的组件页面
 * name：缓存标识，也是组件名
 **/
export default [
  {
    path: '/situationAwareness/assetSituation',
    component: () => import('@/views/situationAwareness/assetSituation.vue'),
    name: 'assetSituation'
  },
  {
    path: '/situationAwareness/interAttackSituation',
    component: () =>
      import('@/views/situationAwareness/interAttackSituation.vue'),
    name: 'interAttackSituation'
  },
  {
    path: '/situationAwareness/exterAttackSituation',
    component: () =>
      import('@/views/situationAwareness/exterAttackSituation.vue'),
    name: 'exterAttackSituation'
  }
]

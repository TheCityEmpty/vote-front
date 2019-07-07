import index from '@/view/index.vue'

export default [
  {
    path: '/error',
    name: 'error',
    component: () => import('@/view/error.vue')
  },
  {
    path: '/',
    component: index,
    children: [
      {
        path: '/model1',
        name: 'model1',
        redirect: '/m1Index',
        component: () => import('@/view/model1/model1.vue'),
        children: [
          {
            path: '/my1',
            name: 'my1',
            component: () => import('@/view/model1/my.vue')
          },
          {
            path: '/zs1',
            name: 'zs1',
            component: () => import('@/view/model1/zs.vue')
          },
          {
            path: '/info1',
            name: 'info1',
            component: () => import('@/view/model1/info.vue')
          },
          {
            path: '/gift1',
            name: 'gift1',
            component: () => import('@/view/model1/gift.vue')
          },
          {
            path: '/chart1',
            name: 'chart1',
            component: () => import('@/view/model1/chart.vue')
          },
          {
            path: '/m1Index1',
            name: 'm1Index1',
            component: () => import('@/view/model1/m1Index.vue')
          },
          {
            path: '/records1',
            name: 'records1',
            component: () => import('@/view/model1/records.vue')
          }
        ]
      },
      {
        path: '/model2',
        name: 'model2',
        component: () => import('@/view/model2/model2.vue')
      }
    ]
  }
]

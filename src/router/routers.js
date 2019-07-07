import index from '@/view/index.vue'

export default [
  {
    path: '/',
    component: index,
    children: [
      {
        path: '/vote',
        name: 'vote',
        component: () => import('@/view/index/vote.vue')
      },
      {
        path: '/model1',
        name: 'model1',
        redirect: '/m1Index',
        component: () => import('@/view/model1/model1.vue'),
        children: [
          {
            path: '/info',
            name: 'info',
            component: () => import('@/view/model1/info.vue')
          },
          {
            path: '/gift',
            name: 'gift',
            component: () => import('@/view/model1/gift.vue')
          },
          {
            path: '/chart',
            name: 'chart',
            component: () => import('@/view/model1/chart.vue')
          },
          {
            path: '/m1Index',
            name: 'm1Index',
            component: () => import('@/view/model1/m1Index.vue')
          },
          {
            path: '/records',
            name: 'records',
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

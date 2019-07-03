import index from '@/view/index.vue'

export default [
  {
    path: '/',
    redirect: '/vote',
    component: index,
    children: [
      {
        path: '/vote',
        name: 'vote',
        component: () => import('@/view/index/vote.vue')
      }
    ]
  }
]

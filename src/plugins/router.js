import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../components/DefaultView.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../components/HomeView.vue')
      },
      {
        path: '/byoto',
        name: 'byoto',
        component: () => import('../components/HomeByoto.vue')
      },
      {
        path: '/doctor',
        name: 'doctor',
        component: () => import('../components/ForDoctor.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

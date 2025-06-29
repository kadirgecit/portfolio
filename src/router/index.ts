import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminLogin from '../views/AdminLogin.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import AdminProjects from '../views/AdminProjects.vue'
import AdminContacts from '../views/AdminContacts.vue'

// Auth guard
function requireAuth(to: any, from: any, next: any) {
  const token = localStorage.getItem('admin_token')
  if (token) {
    next()
  } else {
    next('/admin/login')
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLogin,
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: AdminDashboard,
      beforeEnter: requireAuth,
    },
    {
      path: '/admin/projects',
      name: 'admin-projects',
      component: AdminProjects,
      beforeEnter: requireAuth,
    },
    {
      path: '/admin/contacts',
      name: 'admin-contacts',
      component: AdminContacts,
      beforeEnter: requireAuth,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router

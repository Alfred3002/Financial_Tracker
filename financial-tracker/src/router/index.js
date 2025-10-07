import { createRouter, createWebHistory } from 'vue-router'

// Lazy load views
const LoginView = () => import('../views/LoginView.vue')
const RegisterView = () => import('../views/RegisterView.vue')
const DashboardView = () => import('../views/DashboardView.vue')
const BudgetView = () => import('../views/BudgetView.vue')

// Optional: NotFound view (create this file if it doesn't exist)
const NotFoundView = () => import('../views/NotFoundView.vue')

const routes = [
  { path: '/', component: LoginView },
  { path: '/register', component: RegisterView },
  { 
    path: '/dashboard', 
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/budget', 
    component: BudgetView,
    meta: { requiresAuth: true }
  },
  // 404 route
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Simple auth check (replace with your actual auth logic)
function isLoggedIn() {
  return !!localStorage.getItem('user') // or use your store
}

// Navigation guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next('/')
  } else if (to.path === '/' && isLoggedIn()) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
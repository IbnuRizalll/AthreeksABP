import Vue from 'vue'
import Router from 'vue-router'

// 1. PASTIKAN SEMUA IMPORT INI ADA DI ATAS
import Awal from './views/DashboardAwal.vue'
import Login from './views/DashboardLogin.vue'
import Registrasi from './views/DashboardRegister.vue'
import DashboardAdmin from './views/DashboardAdmin.vue'
import DashboardPembeli from './views/DashboardPembeli.vue'
import DashboardGuest from './views/DashboardGuest.vue'
import ProsesPesanan from './views/ProsesPesanan.vue'
import Pembayaran from './views/Pembayaran.vue'
import HistoryPembeli from './views/HistoryPembeli.vue'
import RincianProduk from './views/RincianProduk.vue'
import ProfilePengguna from './views/ProfilePengguna.vue'
import KelolaProduk from './views/KelolaProduk.vue'
import KelolaPesanan from './views/KelolaPesanan.vue'
import HistoryAdmin from './views/HistoryAdmin.vue'

Vue.use(Router)

const originalPush = Router.prototype.push
const originalReplace = Router.prototype.replace

const isIgnoredNavigationFailure = (error) => (
  Router.isNavigationFailure(error, Router.NavigationFailureType.redirected) ||
  Router.isNavigationFailure(error, Router.NavigationFailureType.duplicated)
)

Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject)
  }

  return originalPush.call(this, location).catch((error) => {
    if (isIgnoredNavigationFailure(error)) {
      return error
    }

    throw error
  })
}

Router.prototype.replace = function replace(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalReplace.call(this, location, onResolve, onReject)
  }

  return originalReplace.call(this, location).catch((error) => {
    if (isIgnoredNavigationFailure(error)) {
      return error
    }

    throw error
  })
}

const VALID_ROLES = ['admin', 'customer']

const clearAuthState = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
  localStorage.removeItem('userRole')
}

const getDefaultRouteByRole = (role) => {
  if (role === 'admin') return '/dashboard-admin'
  if (role === 'customer') return '/dashboard-pembeli'
  return '/login'
}

// 2. INI ADALAH DAFTAR RUTE DENGAN META GUARDS
const routes = [
  // Rute Publik (Bisa diakses siapa saja)
  { path: '/', component: Awal },
  { path: '/dashboard-guest', component: DashboardGuest },

  // Rute Khusus Tamu (Hanya bisa diakses jika BELUM login)
  { path: '/login', component: Login, meta: { guestOnly: true } },
  { path: '/registrasi', component: Registrasi, meta: { guestOnly: true } },

  // Rute Admin (Dilindungi - Harus login & role 'admin')
  { path: '/dashboard-admin', component: DashboardAdmin, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/kelola-produk', component: KelolaProduk, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/kelola-pesanan', component: KelolaPesanan, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/history-admin', component: HistoryAdmin, meta: { requiresAuth: true, role: 'admin' } },

  // Rute Pembeli (Dilindungi - Harus login & role 'customer')
  { path: '/dashboard-pembeli', component: DashboardPembeli, meta: { requiresAuth: true, role: 'customer' } },
  { path: '/proses-pesanan', component: ProsesPesanan, meta: { requiresAuth: true, role: 'customer' } },
  { path: '/pembayaran', component: Pembayaran, meta: { requiresAuth: true, role: 'customer' } },
  { path: '/history-pembeli', component: HistoryPembeli, meta: { requiresAuth: true, role: 'customer' } },
  { path: '/profile', component: ProfilePengguna, meta: { requiresAuth: true, role: 'customer' } },
  { path: '/produk/:id', component: RincianProduk, meta: { requiresAuth: true, role: 'customer' } }, 
  { path: '*', redirect: '/' },
]

const router = new Router({
  mode: 'history',
  routes
})

// 3. INI ADALAH ROUTER GUARD YANG BENAR (Anti-Loop)
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const authToken = localStorage.getItem('authToken');
  const loggedIn = !!authToken;
  const userRole = localStorage.getItem('userRole');
  const hasValidRole = VALID_ROLES.includes(userRole);

  if (requiresAuth) {
    if (!loggedIn) {
      next('/login');
      return;
    }

    if (!hasValidRole) {
      clearAuthState();
      next('/login');
      return;
    }

    const requiredRole = to.meta.role;
    if (requiredRole && userRole !== requiredRole) {
      next(getDefaultRouteByRole(userRole));
    } else {
      next();
    }
    return;
  }
  
  if (to.meta.guestOnly && loggedIn) {
     if (!hasValidRole) {
       clearAuthState();
       next();
       return;
     }
     
     next(getDefaultRouteByRole(userRole));
  } else {
    next();
  }
});

export default router;

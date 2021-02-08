
export default function({ store }) {
  // eslint-disable-next-line no-unused-vars
  const isLoggedIn = (to, from, next) => {
    store.dispatch('auth/authenticate').then(() => {
      next();
    }).catch(() => {
      next('/');
    });
  };
  const routes = [
    {
      path: '/',
      component: () => import('layouts/MainLayout.vue'),
      children: [
        { path: '', component: () => import('pages/Index.vue') },
        { path: 'register', component: () => import('pages/Register.vue'),meta: { requiresAuth: false },},
        { path: 'account', component: () => import('pages/Account.vue'),meta: { requiresAuth: true },}
      ]
    },

    // Always leave this as last one,
    // but you can also remove it
    {
      path: '*',
      component: () => import('pages/Error404.vue')
    }
  ]
// Always leave this as last one
  if (process.env.MODE !== 'ssr') {
    routes.push({
      path: '*',
      component: () => import('pages/Error404.vue')
    });
  }
  return routes;
}

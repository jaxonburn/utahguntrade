
export default function({ store }) {
  // eslint-disable-next-line no-unused-vars
  const routes = [
    {
      path: '/',
      component: () => import('layouts/MainLayout.vue'),
      children: [
        { path: '', component: () => import('pages/Index.vue') },
        { path: 'register', name: 'register', component: () => import('pages/Account/Register.vue'),meta: { requiresAuth: false },},
        { path: 'account', component: () => import('pages/Account/Account.vue'),meta: { requiresAuth: true },},
        { path: 'create-posting', name: 'create-posting', component: () => import('pages/CreatePosting'), meta: { requiresAuth: true } },
        { path: 'listings', name: 'listings', component: () => import('pages/Listings') },
        { path: 'my-watched', name: 'my-watched', component: () => import('pages/MyWatched'), meta: { requiresAuth: true } },
        { path: 'my-listings', name: 'my-listings', component: () => import('pages/MyListings'), meta: { requiresAuth: true } },
        { path: 'listing-details/:id', component: () => import('pages/ListingDetails') },
      ],
    },
    {
      path: '/manage',
      component: () => import('layouts/Manage'),
      children: [
        {path: '', component: () => import('pages/Manage/Manage.vue'), meta: {requiresAuth: true}},
        {path: 'reports', component: () => import('pages/Manage/Reports'), meta: {requiresAuth: true}},
        {path: 'articles', component: () => import('pages/Manage/Articles'), meta: {requiresAuth: true}},
        {path: 'articles/:id', component: () => import('pages/Manage/ArticleView'), meta: {requiresAuth: true}},
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

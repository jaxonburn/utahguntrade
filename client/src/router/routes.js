
export default function({ store }) {
  // eslint-disable-next-line no-unused-vars
  const routes = [
    {
      path: '/',
      component: () => import('layouts/MainLayout.vue'),
      children: [
        { path: '', component: () => import('pages/Index.vue') },
        { path: 'register', name: 'register', component: () => import('pages/Account/OAuthRegistration/OAuthRegisterForm/OAuthRegisterForm'),meta: { requiresAuth: false },},
        { path: 'login', name: 'logIn', component: () => import('pages/Account/OAuthRegistration/OAuthLoginForm/OAuthLoginForm'),meta: { requiresAuth: false },},
        { path: 'account', component: () => import('pages/Account/Account.vue'),meta: { requiresAuth: true },},
        { path: 'create-posting', name: 'create-posting', component: () => import('pages/Listings/CreatePosting'), meta: { requiresAuth: true } },
        { path: 'bill-of-sale', name: 'billOfSale', component: () => import('pages/Resources/billOfSale') },
        { path: 'listings', name: 'listings', component: () => import('pages/Listings') },
        { path: 'my-watched', name: 'my-watched', component: () => import('pages/Listings/MyWatched'), meta: { requiresAuth: true } },
        { path: 'my-listings', name: 'my-listings', component: () => import('pages/Listings/MyListings'), meta: { requiresAuth: true } },
        { path: 'listing-details/:id', component: () => import('pages/Listings/ListingDetails2') },
        { path: 'messages', name: 'messages', component: () => import('pages/Chats'), meta: { requiresAuth: true } },
        { path: 'articles', name: 'articleSearch', component: () => import('pages/BrowseArticles'), },
        { path: 'articles/:id', name: 'article', component: () => import('pages/Manage/ArticleView'),},
        { path: 'premium', name: 'premium', component: () => import('pages/Subscriptions/Premium'),  meta: { requiresAuth: true } },
        { path: 'report-bug', name: 'report-bug', component: () => import('pages/ReportBug'), meta: { requiresAuth: true } }
      ],
    },
    {
      path: '/manage',
      component: () => import('layouts/Manage'),
      meta: {requiresAuth: true, role: 'Admin'},
      children: [
        // {path: '', component: () => import('pages/Manage/Manage.vue'), meta: {requiresAuth: true}},
        {path: '', redirect: 'reports', meta: {requiresAuth: true, role: 'Admin'}},
        {path: 'reports', component: () => import('pages/Manage/Reports'), meta: {requiresAuth: true, role: 'Admin'}},
        {path: 'articles', component: () => import('pages/Manage/Articles'), meta: {requiresAuth: true, role: 'Admin'}},
        {path: 'articles/:id', component: () => import('pages/Manage/ArticleView'), meta: {requiresAuth: true, role: 'Admin'}},
        {path: 'bugs', component: () => import('pages/Manage/Bugs'), meta: { requiresAuth: true, role: 'Admin' }},
        {path: 'notifications', component: () => import('pages/Manage/Notifications'), meta: { requiresAuth: true, role: 'Admin' }}
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

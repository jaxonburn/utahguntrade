import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)
import Routes from './routes';
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (/* { store, ssrContext } */{ store}) {
  const routes = Routes({store});
  const Router = new VueRouter({
    scrollBehavior: (to, from, savedPosition) => {
      if (savedPosition) {
        return savedPosition;
      } else {
        return {x: 0, y: 0};
      }
    },
    routes,
    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  });


  Router.beforeEach((to, from, next) => {
    if (!store.getters['auth/isAuthenticated']) {
      store.dispatch('auth/authenticate')
        .then(() => {
          // console.log('authenticated');
          // console.log('getters user', store.getters['auth/user']);
          if (to.meta.requiresAuth) {
            if (store.getters['auth/isAuthenticated']) {
              // console.log('pass');
              next();
            } else {
              // console.log('not pass', store.state.auth.user);
              Notify.create({
                type: 'negative',
                message: 'Page is restricted',
                timeout: 10000,
                actions: [
                  {
                    icon: 'close', color: 'white', handler: () => {
                      /* ... */
                    }
                  }
                ]
              });
              next('/');
            }
          } else {
            next();
          }
        })
        .catch(() => {
          // console.log('not authenticated');
          if (to.meta.requiresAuth) {
            if (store.getters['auth/isAuthenticated']) {
              next();
            } else {
              Notify.create({
                type: 'negative',
                message: 'Page is restricted. Please login or register.',
                timeout: 10000,
                actions: [
                  {
                    icon: 'close', color: 'white', handler: () => {
                      /* ... */
                    }
                  }
                ]
              });
              next('/');
            }
          } else {
            next();
          }
        });
    } else {
      next();
    }
  });

  return Router
}

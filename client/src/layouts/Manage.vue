<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white" height-hint="98" style="-webkit-box-shadow: 0 5px 10px 2px rgba(0,0,0,0.5);
box-shadow: 0 5px 10px 2px rgba(0,0,0,0.5);">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title class="bg-white">

        </q-toolbar-title>
      </q-toolbar>

<!--      <q-tabs align="left">-->
<!--        <q-route-tab to="/page1" label="Page One" />-->
<!--        <q-route-tab to="/page2" label="Page Two" />-->
<!--        <q-route-tab to="/page3" label="Page Three" />-->
<!--      </q-tabs>-->
    </q-header>

    <q-drawer show-if-above v-model="left" side="left" elevated>
      <q-scroll-area class="fit" style="height: 100vh;">
        <q-list>

          <template v-for="(menuItem, index) in menuList">
            <q-item :key="index" clickable :active="$route.path === menuItem.path" v-ripple @click="$route.path !== menuItem.path ? $router.push(menuItem.path) : ''">
              <q-item-section avatar>
                <img :src="menuItem.img" height="50" width="50" alt="icon image"/>
              </q-item-section>
              <q-item-section class="text-weight-medium">
                {{ menuItem.label }}
              </q-item-section>
            </q-item>
            <q-separator :key="'sep' + index"  v-if="menuItem.separator" />
          </template>

        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
  import news from '../assets/newIcon.png';
  import reports from '../assets/icons/ReportIcon.png';
  import bug from '../assets/bug.png';
  import notification from '../assets/notification.png';

  export default {
    name: 'Manage',
    data(){
      return {
        left: true
      }
    },
    computed: {
      menuList(){
        return [
          {
            img: news,
            label: 'Articles',
            separator: true,
            path: '/manage/articles',
          },
          {
            img: reports,
            label: 'Reports',
            separator: true,
            path: '/manage/reports',
          },
          {
            img: bug,
            label: 'Bugs',
            separator: true,
            path: '/manage/bugs'
          },
          {
            img: notification,
            label: 'Home Page Popup',
            separator: true,
            path: '/manage/notifications'
          },
          {
            img: null,
            label: 'Reported listings/comments etc...',
            separator: true,
            path: '/manage/user-reports'
          },
          {
            img: null,
            label: 'Manage Gun Stores',
            separator: true,
            path: '/manage/gun-stores'
          }
        ]
      }
    }
  };
</script>

<style scoped>

</style>

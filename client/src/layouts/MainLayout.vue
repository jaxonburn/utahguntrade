<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white" elevated style="display: flex;flex-direction: column;"
              :style="$route.path === '/register' ? 'height: 90px;' : 'height: 150px'">
      <div class="row" style="height: 90px;width: 100%;display: flex; justify-content: space-between;">
        <div>
          <img @click="$router.push('/')"
               height="auto"
               width="200px"
               src="https://www.freelogoservices.com/api/main/images/1j+ojFVDOMkX9Wytexe43D6kif+EqhZNmBfIwXs1M3EMoAJtliEvhfVt9vU4"
               class="q-ml-lg cursor-pointer"/>
        </div>
        <div class="q-ma-md flex justify-center" v-if="$route.path !== '/register'">
          <q-input
            v-model="searchAll"
            filled
            placeholder="Search Marketplace..."
            style="width: 600px;"
          >
            <template v-slot:append>
              <q-icon name="search" color="primary"/>
            </template>
          </q-input>
        </div>
        <div class="text-primary" style="display: flex; justify-content: flex-end; align-items: center;"
             v-if="$route.path !== '/register'">
          <div class="q-pa-md" v-if="user">
            <q-btn-dropdown
              class="glossy"
              color="primary"
              icon="account_circle"
              label="Account"
            >
              <div class="row q-pa-md">
                <div class="column flex justify-between">
                  <div class="text-h6 q-mb-md text-center text-weight-thin" style="border-bottom: 1px solid black;">
                    Notifications
                  </div>
                  <q-btn outlined label="Messages" icon="chat" size="sm" color="secondary" @click="chat = !chat">
                    <q-badge color="red" floating>0</q-badge>
                  </q-btn>
                  <div class="row flex-between">
                    <q-btn outlined label="Listings" icon="receipt" size="sm" color="secondary" class="q-mr-sm">
                    </q-btn>

                    <q-btn outlined label="Watched" icon="fas fa-eye" size="sm" color="secondary" class="q-ml-sm">
                    </q-btn>
                  </div>
                </div>

                <q-separator vertical inset class="q-mx-lg"/>

                <div class="column items-center">
                  <q-avatar size="72px">
                    <img :src="user.avatar">
                  </q-avatar>

                  <div class="text-subtitle1 q-mt-md q-mb-xs"></div>
                  <q-btn
                    color="primary"
                    label="My Account"
                    @click="$router.push('/account')"
                    push
                    size="sm"
                    class="q-mb-md"
                    v-close-popup
                  >

                  </q-btn>
                  <q-btn
                    color="primary"
                    label="Logout"
                    push
                    size="sm"
                    @click="logOut"
                    v-close-popup
                  />
                </div>
              </div>
            </q-btn-dropdown>
          </div>
          <div class="row">
            <div class="q-pr-xl">
              <router-link to="/register" style="text-decoration: none;" v-if="!this.user">
                <q-btn outlined color="primary" icon="account_circle" label="log in"></q-btn>
              </router-link>
            </div>
            <div class="q-pr-xl" v-if="this.user && this.$route.name !== 'create-posting'">
              <q-btn @click="$router.push({name: 'create-posting'})" label="Create posting" color="primary"/>
            </div>
            <div class="q-pr-xl" v-if="this.user && this.$route.name === 'create-posting'">
              <q-btn @click="$router.push('/')" label="Home page" color="primary" />
            </div>
          </div>
        </div>
      </div>
      <category-drop-down></category-drop-down>
    </q-header>


    <q-page-container>
      <router-view/>
        <chat-box v-if="chat === true" @close="chat = !chat" :user="user"></chat-box>
    </q-page-container>
  </q-layout>
</template>

<script>
  import {mapState} from 'vuex';
  import CategoryDropDown from 'components/Nav/CategoryDropDown';
  import ChatBox from 'components/Chat/chatBox';

  export default {
    name: 'MainLayout',
    components: {
      ChatBox,
      CategoryDropDown
    },
    data() {
      return {
        searchAll: '',
        chat: false,
      }
    },
    computed: {
      ...mapState('auth', {
        user: 'user'
      }),
    },
    methods: {
      logOut() {
        this.$store.dispatch('auth/logout').then(() => {
          this.$router.push('/');
          this.$q.notify({
            color: 'secondary',
            textColor: 'white',
            icon: 'check_circle',
            message: `Logged out`,
            position: 'top-right',
            timeout: 3000,
          })
        })
      }
    }
  }
</script>

<style>
  body.desktop .q-focusable:focus .q-focus-helper,
  body.desktop .q-hoverable:hover .q-focus-helper {
    background: inherit;
    opacity: 0;
  }

  body.ios .q-hoverable:active .q-focus-helper {
    background: inherit;
    opacity: 0;
  }

  .q-focus-helper {
    opacity: 0;
    transition: unset;
  }


  .slide-fade-enter-active {
    transition: all 1s ease;
  }
  .slide-fade-leave-active {
    transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateX(150px) translateY(150px);
  }
</style>

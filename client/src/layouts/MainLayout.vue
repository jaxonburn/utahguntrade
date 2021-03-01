<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white" elevated style="display: flex;flex-direction: column"
              :style="$route.path === '/register' || $q.platform.is.mobile ? 'height: 90px;' : 'height: 130px'">
      <div class="row" style="height: 90px;width: 100%;display: grid; grid-template-columns: 0.3fr 2fr 0.3fr 0.3fr;"
           :style="!user ? 'grid-template-columns: 0.5fr 2fr 0.5fr 0.2fr;' : 'grid-template-columns: 0.5fr 2fr 0.3fr 0.3fr;'">
        <div>
          <img @click="$router.push('/')"
               height="100px"
               width="130"
               src="../assets/utahgunhub.png"
               class="q-ml-lg cursor-pointer"
               alt="MainLogo"
          />
        </div>
        <div class="q-ma-md flex justify-center" v-if="$route.path !== '/register'">
          <q-input
            v-model="searchAll"
            filled
            placeholder="Search Marketplace..."
            style="width: 100%;"
            @keyup.enter="searchMarketPlace"
          >
            <template v-slot:append>
              <q-icon @click="searchMarketPlace" name="search" color="primary"/>
            </template>
          </q-input>
        </div>
        <div class="text-primary" style="display: flex;align-items: center;"
             :style="!user ? 'justify-content: space-between;' : 'justify-content: center'"
             v-if="$route.path !== '/register'">
          <div class="flex flex-center cursor-pointer">
            <q-btn round @click="$router.push({name: 'articleSearch'})">
              <q-avatar size="60px">
                <img src="../assets/newIcon.png" alt="NewsPaper" width="50" height="50"/>
              </q-avatar>
            </q-btn>
          </div>
          <div class="row" v-if="!user">
            <div class="q-pr-xl">
              <router-link to="/register" style="text-decoration: none;">
                <q-btn outlined color="primary" label="log in"></q-btn>
              </router-link>
            </div>
          </div>
        </div>
        <div @mouseover="category.open = true;" class="flex flex-center" v-if="$route.path !== '/register'">
          <q-btn-dropdown
            v-model="category.open"
            class="bg-white text-weight-regular q-mr-lg"
            :class="category.open ? 'text-primary text-weight-bold' : 'text-black'"
            :label="category.label"
            flat
            :ripple="false"
            dropdown-icon="list"
            size="lg"
          >
            <q-list>
              <q-item clickable v-ripple @click="changeRoute('/')" class="cursor-pointer" v-if="$route.path !== '/'">
                <q-item-section avatar>
                  <q-icon color="primary" name="home"/>
                </q-item-section>
                <q-item-section class="side-menu-link">Home</q-item-section>
              </q-item>
              <q-separator/>
              <q-item clickable v-ripple @click="changeRoute('/messages')" class="cursor-pointer"
                      v-if="$route.path !== '/messages'">
                <q-item-section avatar>
                  <q-icon color="primary" name="message"/>
                </q-item-section>
                <q-item-section class="side-menu-link">Messages</q-item-section>
              </q-item>
              <q-separator/>
              <q-item clickable v-ripple @click="changeRoute('/create-posting')"
                      class="cursor-pointer side-menu-link double-side-menu">
                <q-item-section avatar>
                  <q-icon color="primary" name="add_box"/>
                </q-item-section>
                <q-item-section class="side-menu-link">Create Listing</q-item-section>
              </q-item>
              <q-separator/>
              <q-item clickable v-ripple @click="changeRoute('/my-listings')"
                      class="cursor-pointer side-menu-link double-side-menu">
                <q-item-section avatar>
                  <q-icon color="primary" name="grading"/>
                </q-item-section>
                <q-item-section class="side-menu-link">My listings</q-item-section>
              </q-item>
              <q-separator/>
              <q-item clickable v-ripple @click="changeRoute('/my-watched')"
                      class="cursor-pointer side-menu-link double-side-menu">
                <q-item-section avatar>
                  <q-icon color="primary" name="visibility"/>
                </q-item-section>
                <q-item-section class="side-menu-link">My watched</q-item-section>
              </q-item>
              <q-separator/>
              <q-item clickable v-ripple @click="changeRoute('/listings')" class="cursor-pointer">
                <q-item-section avatar>
                  <q-icon color="primary" name="mdi-text-box-search"/>
                </q-item-section>
                <q-item-section class="side-menu-link">Browse Listings</q-item-section>
              </q-item>
              <div style="width: 100%;" v-if="user">
                <q-btn-dropdown
                  class="bg-white text-primary"
                  icon="account_circle"
                  label="Account"
                  style="width: 100%;"
                  flat
                >
                  <div class="row q-pa-md">
                    <div class="column flex justify-between">
                      <div class="text-h6 q-mb-md text-center text-weight-thin" style="border-bottom: 1px solid black;">
                        Notifications
                      </div>
                      <div>
                        <q-btn outlined label="Messages" icon="chat" size="sm" color="secondary" @click="chat = !chat">
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
            </q-list>
          </q-btn-dropdown>
        </div>

      </div>
      <category-drop-down v-if="!$q.platform.is.mobile && $route.path === '/'"></category-drop-down>
    </q-header>

    <q-page-container>
      <router-view/>
      <transition name="lide-fade" appear>
        <q-avatar v-if="!chat && $lget(user, '_id', false) && $route.name !== 'messages'"
                  class="chatIcon cursor-pointer" @click="chat = !chat">
          <img alt="Chat Box" src="../assets/isometricchat.png" class="chatImage q-pa-sm">
        </q-avatar>
      </transition>
      <chat-box v-if="chat" @close="chat = !chat" :user="user"></chat-box>
    </q-page-container>
    <div style="height: 20px;position: absolute; bottom: 0;width: 100%;"
         class="bg-blue-grey-6a text-center row flex justify-start">
      <p class="text-white text-xxs text-mb-xxs q-mx-sm" style="text-decoration: underline;">Report a bug?</p>
      <p class="text-white text-xxs text-mb-xxs q-mx-sm" style="text-decoration: underline;">Contact Owners</p>
    </div>
  </q-layout>
</template>

<script>
  import {mapState, mapActions, mapGetters} from 'vuex';
  import CategoryDropDown from 'components/Nav/CategoryDropDown';
  import ChatBox from 'components/Chat/chatBox';
  import {StripeCheckout} from '@vue-stripe/vue-stripe';

  export default {
    name: 'MainLayout',
    components: {
      ChatBox,
      CategoryDropDown,
      StripeCheckout,
    },
    mounted() {
      if (this.user && this.user.takeToListings && this.$route.path !== '/listings') {
        this.$router.push({name: 'listings'});
      }
      if(this.user && this.user.notifications) {
        this.loadNotifications({ query: { $limit: 200, _id: {$in: this.user.notifications} } }).then(res => {
          if(res.data.length === 0) return;
          let last = res.data[res.data.length - 1];
          this.lastNotification = last._id;
        })
      }
    },
    data() {
      return {
        loading: false,
        searchAll: '',
        chat: false,
        category: {
          open: false,
          label: ''
        },
        lastNotification: ''
      }
    },
    watch: {
      user: {
        deep: true,
        async handler(newVal){
          if(this.$lget(newVal, 'notifications', []).length === 0) return;
          if(this.lastNotification !== this.$lget(newVal.notifications[newVal.notifications.length - 1])) {
            let noti = await this.getNotification(newVal.notifications[newVal.notifications.length - 1]);
            if(!noti) return;
            if(noti.type !== 'Chat') return;
            setTimeout(() => {
              let box = document.getElementById(('chatBox'));
              if(!box) return;
              box.scrollTop = box.scrollHeight;
            }, 100)
            this.$q.notify({
              message: `<div>${noti._fastjoin.messageObj.sentBy.username} Said: ${noti.text.length > 35 ? noti.text.substr(0, 33) + '...' : noti.text}</div>`,
              avatar: noti._fastjoin.messageObj.sentBy.avatar,
              actions: [
                { label: 'View', color: 'green', handler: () => this.viewNotification(noti) },
                { label: 'Dismiss', color: 'yellow', handler: () => this.dismissNotification(noti) },
              ],
              position: 'top-right',
              html: true
            })
          }
          this.lastNotification = newVal.notifications[newVal.notifications.length - 1];
        }
      }
    },
    computed: {
      ...mapState('auth', {
        user: 'user'
      }),
      ...mapGetters('notifications', {
        getNotification: 'get'
      }),
      notifications(){
        console.log(this.getNotifications({query: {notifications: {$in: this.user.notifications}}}))
        return 'hello';
      }
    },
    methods: {
      ...mapActions('create-customer-portal-session', {
        createPortal: 'create'
      }),
      ...mapActions('notifications', {
        loadNotifications: 'find',
        deleteNotification: 'remove'
      }),
      openCustomerPortal () {
        this.createPortal({stripeId: this.user.stripeId}).then((res) => {
          console.log(res);
          window.location = res.result;
        }).catch((err) => {
          console.log(err);
        })
      },
      submit() {
        this.$refs.checkoutRef.redirectToCheckout();
      },
      viewNotification(noti) {
        this.deleteNotification(noti._id).then(res => {
          if(this.$route.path === '/messages') return;
          this.$router.push({ name: 'messages', params: { chatId: String(noti.modelId), created: 'false' } });
        })
      },
      dismissNotification(noti){
        this.deleteNotification(noti._id);
      },
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
      },
      searchMarketPlace() {
        this.$router.push({name: 'listings', query: {search: this.searchAll}});
        this.searchAll = '';
      },
      changeRoute(route) {
        if (this.$route.fullPath === route) return;
        this.$router.push(route);
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

  .lide-fade-enter-active {
    transition: all 1s ease;
  }

  .lide-fade-leave-active {
    transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .lide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */
  {
    transform: translateX(150px) translateY(150px);
  }


  .slide-fade-enter-active {
    transition: all 1.5s ease;
  }

  .slide-fade-leave-active {
    transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */
  {
    transform: translateX(150px) translateY(150px);
  }

  .side-menu-link {
    transition: 0.3s all;
    font-size: 1.1em;
  }

  .side-menu-link:hover {
    color: red !important;
  }

  .double-side-menu {
    display: flex;
    align-items: center;
  }

  .chatIcon {
    position: fixed;
    bottom: 30px;
    right: 20px;
    width: 80px;
    height: 80px;
    z-index: 5;
    -webkit-box-shadow: 0px 0px 18px 5px rgba(0, 0, 0, 0.51);
    box-shadow: 0px 0px 13px 1px rgba(0, 0, 0, 0.31);
    background: rgba(255, 255, 255, 0.8);
  }

  .chatImage {
    width: 80px;
    height: 80px;
  }
</style>

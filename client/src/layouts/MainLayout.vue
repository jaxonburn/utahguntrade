<template>
  <q-layout view="hHh lpR fff">
    <q-header elevated>
      <q-toolbar class="bg-white" style="display: flex; flex-direction: column;width: 100%;">
        <div style="width: 100%;display: grid; grid-template-columns: 0.4fr 3fr 0.5fr;">
          <div class="flex flex-center">
            <img src="../assets/Logos/utahgunhublogo.png" style="height: 100px;width: 125px;" @click="$router.push('/')"
                 class="cursor-pointer">
          </div>
          <div class="q-ma-md flex justify-center"
               v-if="$route.path !== '/register' && !$q.screen.lt.md && $route.path !== '/login'">
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
          <div class="flex items-center" v-if="$route.path !== '/login' && $route.path !== '/register'" :class="user ? 'justify-end' : 'justify-center'">
            <q-btn-dropdown style="width: 60px; height: 40px;" class="q-mr-lg text-white bg-secondaryGradient" v-if="user"
                            dropdown-icon="notifications_active">
              <q-list>
                <q-btn  v-if="notifications" @click="clearAllNotifications" class="q-pa-md"
                        label="Clear all notifications" color="blue" flat style="background-color: black; width: 100%"/>
                <q-btn v-else class="q-pa-md" label="No notifications" color="blue" flat
                       style="background-color: black;"/>
                <transition-group name="list">
                  <q-item style="background-color: black; color: white;" clickable v-for="(noti, idx) of notifications"
                          :key="noti._id" class="list-item">
                    <q-item-section>
                      <q-item-label>
                        <div style="display: flex;align-items: center;">
                          <q-avatar size="45px">
                            <img :src="$lget(noti, '_fastjoin.messageObj.sentBy.avatar', '')">
                          </q-avatar>
                          <div class="details" style="display: flex;align-items: center;">
                            <div class="q-mx-sm">{{ $lget(noti, '_fastjoin.messageObj.sentBy.username', '') }}:</div>
                            <div class="q-mr-sm">{{
                                noti.text.length > 60 ? noti.text.substr(0, 60) + '...' : noti.text
                              }}
                            </div>
                          </div>
                        </div>
                        <div class="actions">
                          <q-btn @click="viewNotification(noti)" flat color="green" label="View"/>
                          <q-btn @click="dismissNotification(noti)" flat color="yellow" label="Dismiss"/>
                        </div>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </transition-group>

              </q-list>
            </q-btn-dropdown>
            <router-link to="/login" style="text-decoration: none;" v-if="!user && $route.path !== '/login'">
              <q-btn outlined color="dark" label="log in" flat></q-btn>
            </router-link>
            <div @mouseover="category.open = true;" class="flex justify-end" v-else>
              <dropdown-links :user="user" :category="category"></dropdown-links>
            </div>
          </div>
        </div>
        <category-drop-down v-if="!$q.platform.is.mobile && $route.path !== '/register'"></category-drop-down>
      </q-toolbar>
    </q-header>
    <q-page-container style="height: 100%;">
      <router-view/>
      <transition name="lide-fade" appear>
        <q-avatar v-if="!chat && $lget(user, '_id', false) && $route.name !== 'messages'"
                  class="chatIcon cursor-pointer" @click="chat = !chat">
          <q-img alt="Chat Box" src="../assets/isometricchat.png" class="chatImage q-pa-md" />
        </q-avatar>
      </transition>
      <chat-box v-if="chat" @close="chat = !chat" :user="user"></chat-box>
    </q-page-container>
        <main-footer></main-footer>
  </q-layout>
</template>

<script>
  import {mapState, mapActions, mapGetters} from 'vuex';
  import CategoryDropDown from 'components/Nav/CategoryDropDown';
  import ChatBox from 'components/Chat/chatBox';
  import {StripeCheckout} from '@vue-stripe/vue-stripe';
  import DropdownLinks from 'components/Nav/DropdownLinks';
  import MainFooter from 'components/Nav/MainFooter';

  export default {
    name: 'MainLayout',
    components: {
      MainFooter,
      DropdownLinks,
      ChatBox,
      CategoryDropDown,
      StripeCheckout,
    },
    async mounted() {
      if (this.user) {
        Promise.all(this.user.notifications.map(async noti => {
          let not = await this.$store.dispatch('notifications/patch', [noti, {
            displayed: true
          }]);
          return not;
        })).then(res => {
          console.log(res);
        }).catch(err => {
          this.$q.notify({
            message: err.message,
            color: 'negative'
          })
        })
      }
      if (this.user && this.user.takeToListings && this.$route.path !== '/listings') {
        this.$router.push({name: 'listings'});
      }
      if (this.$lget(this.user, 'notifications', false)) {
        this.loadNotifications({query: {$limit: 200, _id: {$in: this.user.notifications}}}).then(res => {
          if (res.data.length === 0) return;
          let last = res.data[res.data.length - 1];
          this.lastNotification = last._id;
        })
      }
    },
    data() {
      return {
        isScrolled: false,
        loading: false,
        searchAll: '',
        chat: false,
        category: {
          open: false,
          label: ''
        },
        lastNotification: '',
        lastUserNotification: ''
      }
    },
    watch: {
      user: {
        deep: true,
        async handler(newVal, oldVal) {
          console.log(newVal.notifications, oldVal.notifications, this.user.notifications);
          if (this.$lget(newVal, 'notifications', []).length === 0) return;
          if (this.lastNotification !== this.$lget(newVal.notifications[newVal.notifications.length - 1])) {
            if (this.lastUserNotification === newVal.notifications[newVal.notifications.length - 1]) return;
            let noti = await this.getNotification(newVal.notifications[newVal.notifications.length - 1]);
            if (!noti) return;
            if (noti.type === 'Chat') {
              setTimeout(() => {
                let box = document.getElementById(('chatBox'));
                if (!box) return;
                box.scrollTop = box.scrollHeight;
              }, 100)
              if (noti.displayed || noti.displayed) return;
              this.$q.notify({
                message: `<div>${this.$lget(noti, '_fastjoin.messageObj.sentBy.username', '')} Said: ${noti.text.length > 35 ? noti.text.substr(0, 33) + '...' : noti.text}</div>`,
                avatar: noti._fastjoin.messageObj.sentBy.avatar,
                actions: [
                  {label: 'View', color: 'green', handler: () => this.viewNotification(noti)},
                  {label: 'Dismiss', color: 'yellow', handler: () => this.dismissNotification(noti)},
                ],
                position: 'top-right',
                html: true,
                timeout: 10000
              })
              this.expireNoti(noti);
            }
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
        getNotification: 'get',
        allNotifications: 'find'
      }),
      notifications() {
        if (!this.$lget(this.user, 'notifications', false)) return;
        return this.allNotifications({query: {$limit: 200, _id: {$in: this.user.notifications}}}).data;
      }
    },
    methods: {
      ...mapActions('notifications', {
        loadNotifications: 'find',
        deleteNotification: 'remove',
        patchNotification: 'patch'
      }),
      async expireNoti(noti) {
        await this.patchNotification([noti._id, {
          displayed: true
        }]);
        setTimeout(async () => {
          let res = await this.getNotification(noti._id);
          if (res == null) return;
          this.patchNotification([noti._id, {
            expired: true
          }])
        }, 10000)
      },
      viewNotification(noti) {
        this.deleteNotification(noti._id).then(res => {
          if (this.user.notifications.length > 0) {
            this.lastUserNotification = this.user.notifications[this.user.notifications.length - 1];
          }
          if (this.$route.path === '/messages') return;
          this.$router.push({name: 'messages', params: {chatId: String(noti.modelId), created: 'false'}});
        })
      },
      dismissNotification(noti) {
        this.deleteNotification(noti._id).then((res) => {
          console.log(res);
          if (this.user.notifications.length > 0) {
            this.lastUserNotification = this.user.notifications[this.user.notifications.length - 1];
          }
        })
      },
      clearAllNotifications() {
        Promise.all(this.notifications.map(async noti => {
          let not = await this.$store.dispatch('notifications/remove', noti._id);
          return not;
        })).then(res => {
          this.$store.dispatch('users/patch', [this.user._id, {
            notifications: []
          }]);
        }).catch(err => {
          this.$q.notify({
            message: err.message,
            color: 'negative'
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

  .slide-fadeBack-enter-active {
    transition: all 1.5s ease;
  }

  .slide-fadeBack-leave-active {
    position: absolute;
    transition: all 0s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fadeBack-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */
  {
    transform: translateX(-300px);
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

  .list-enter-active, .list-leave-active {
    transition: all 1s;
  }

  .list-enter, .list-leave-to {
    opacity: 0;
    transform: translateX(150px);
  }

  .list-item {
    /*display: inline-block;*/
    /*margin-right: 10px;*/
  }

  .secondaryFont {
    font-family: 'Roboto', sans-serif;
  }

  .centerCenter {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

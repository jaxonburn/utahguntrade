<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white" elevated style="display: flex;flex-direction: column"
              :style="$route.path === '/register' || $q.platform.is.mobile ? 'height: 90px;' : 'height: 130px'">
      <div class="row" style="height: 90px;width: 100%;display: grid; grid-template-columns: 0.3fr 2fr 0.3fr 0.3fr;"
           :style="!user ? 'grid-template-columns: 0.2fr 1.5fr 0.5fr 0.2fr;' : 'grid-template-columns: 0.2fr 1.5fr 0.3fr 0.3fr;'">
        <div>
          <img @click="$router.push('/')"
               height="80%"
               width="100"
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
            <q-btn @click="$router.push({name: 'articleSearch'})" flat>
              <q-avatar size="60px">
                <img src="../assets/newIcon.png" alt="NewsPaper" width="50" height="50"/>
              </q-avatar>
            </q-btn>

            <q-btn-dropdown class="q-ml-lg text-white bg-secondaryGradient" v-if="user"
                            dropdown-icon="notifications_active">
              <q-list>
                <q-btn v-if="notifications" @click="clearAllNotifications" class="q-pa-md"
                       label="Clear all notifications" color="blue" flat style="background-color: black;"/>
                <q-btn v-else class="q-pa-md" label="No notifications" color="blue" flat
                       style="background-color: black;"/>
                <transition-group name="list">
                  <q-item style="background-color: black; color: white;" clickable v-for="(noti, idx) of notifications"
                          :key="idx" class="list-item">
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

          </div>
          <div class="row" v-if="!user">
            <div>
              <router-link to="/register" style="text-decoration: none;">
                <q-btn outlined color="primary" label="log in"></q-btn>
              </router-link>
            </div>
          </div>
        </div>
        <div @mouseover="category.open = true;" class="flex flex-center" v-if="$route.path !== '/register'">
          <dropdown-links :user="user" :category="category"></dropdown-links>
        </div>
      </div>
      <category-drop-down v-if="!$q.platform.is.mobile && $route.path === '/'"></category-drop-down>
    </q-header>

    <q-page-container style="height: 100%;">
      <router-view/>
      <transition name="lide-fade" appear>
        <q-avatar v-if="!chat && $lget(user, '_id', false) && $route.name !== 'messages'"
                  class="chatIcon cursor-pointer" @click="chat = !chat">
          <img alt="Chat Box" src="../assets/isometricchat.png" class="chatImage q-pa-sm">
        </q-avatar>
      </transition>
      <chat-box v-if="chat" @close="chat = !chat" :user="user"></chat-box>
    </q-page-container>
    <div style="height: 20px;width: 100%;"
         class="bg-blue-grey-6 text-center row flex justify-start">
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
  import DropdownLinks from 'components/Nav/DropdownLinks';

  export default {
    name: 'MainLayout',
    components: {
      DropdownLinks,
      ChatBox,
      CategoryDropDown,
      StripeCheckout,
    },
    async mounted() {
      if(this.user) {
        Promise.all(this.user.notifications.map(async noti => {
          let not = await this.$store.dispatch('notifications/remove', noti);
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
</style>

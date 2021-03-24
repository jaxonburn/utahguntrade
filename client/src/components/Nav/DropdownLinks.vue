<template>
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
    <q-list separator>
      <q-item clickable v-ripple @click="item.handler" class="cursor-pointer"
              v-if="$lget(item, 'if', true)" v-for="item in items" :key="item.label">
        <q-item-section avatar>
          <q-icon color="white" :name="item.icon" :class="item.class" style="border-radius: 10px;"/>
        </q-item-section>
        <q-item-section class="side-menu-link">{{item.label}}</q-item-section>
      </q-item>
      <q-separator/>
    </q-list>
<!--    <div style="width: 100%;" v-if="user">-->
<!--      <q-btn-dropdown-->
<!--        class="bg-secondaryGradient text-white"-->
<!--        style="width: 100%;"-->
<!--        flat-->
<!--      >-->
<!--        <template v-slot:label>-->
<!--          <div style="display: flex; flex-direction: row; justify-content: space-between;width: 100%;">-->
<!--            <q-avatar size="sm" style="border: 1px solid black;">-->
<!--              <img :src="user.avatar"/>-->
<!--            </q-avatar>-->
<!--            <div>-->
<!--              Account-->
<!--            </div>-->
<!--          </div>-->
<!--        </template>-->
<!--        <div class="row q-pa-md">-->
<!--          <div class="column flex justify-between">-->
<!--            <div class="text-h6 q-mb-md text-center text-weight-thin" style="border-bottom: 1px solid black;">-->
<!--              Notifications-->
<!--            </div>-->
<!--            <div>-->
<!--              <q-btn outlined label="Messages" icon="chat" size="sm" class="bg-secondaryGradient text-white"-->
<!--                     @click="chat = !chat">-->
<!--              </q-btn>-->
<!--            </div>-->
<!--          </div>-->

<!--          <q-separator vertical inset class="q-mx-lg"/>-->

<!--          <div class="column items-center">-->
<!--            <q-avatar size="72px">-->
<!--              <img :src="user.avatar">-->
<!--            </q-avatar>-->

<!--            <div class="text-subtitle1 q-mt-md q-mb-xs"></div>-->
<!--            <q-btn-->
<!--              label="My Account"-->
<!--              @click="$router.push('/account')"-->
<!--              push-->
<!--              size="sm"-->
<!--              class="q-mb-md bg-primaryGradient text-white"-->
<!--              v-close-popup-->
<!--            >-->

<!--            </q-btn>-->
<!--            <q-btn-->
<!--              class="bg-primaryGradient text-white"-->
<!--              label="Logout"-->
<!--              push-->
<!--              size="sm"-->
<!--              @click="logOut"-->
<!--              v-close-popup-->
<!--            />-->
<!--          </div>-->
<!--        </div>-->
<!--      </q-btn-dropdown>-->
<!--    </div>-->
  </q-btn-dropdown>
</template>

<script>
  export default {
    name: 'DropdownLinks',
    props: {
      user: Object,
      category: Object,
    },
    data(){
      return {
        items: [
          {
            if: this.$route.path !== '/',
            label: 'Home',
            icon: 'home',
            class: 'bg-primaryGradient q-pa-xs',
            handler: () => {
              this.changeRoute('/');
            }
          },
          {
            label: 'Create Listing',
            icon: 'add_box',
            class: 'bg-primaryGradient q-pa-xs',
            handler: () => {
              this.changeRoute('/create-posting');
            }
          },
          {
            label: 'My Listings',
            icon: 'grading',
            class: 'bg-primaryGradient q-pa-xs',
            handler: () => {
              this.changeRoute('/my-listings');
            }
          },
          {
            label: 'My Watched',
            icon: 'visibility',
            class: 'bg-primaryGradient q-pa-xs',
            handler: () => {
              this.changeRoute('/my-watched');
            }
          },
          {
            label: 'Browse Listings',
            icon: 'mdi-text-box-search',
            class: 'bg-primaryGradient q-pa-xs',
            handler: () => {
              this.changeRoute('/listings');
            }
          },
          {
            if: this.$route.path !== '/messages',
            label: 'Messages',
            icon: 'message',
            class: 'bg-primaryGradient q-pa-xs',
            handler: () => {
              this.changeRoute('/messages');
            }
          },
          {
            if: this.$route.path !== '/account',
            label: 'Account',
            icon: 'far fa-user-circle',
            class: 'bg-secondaryGradient q-pa-xs',
            handler: () => {
              this.changeRoute('/account');
            }
          },
          {
            label: 'Log Out',
            icon: 'fas fa-sign-out-alt',
            class: 'bg-secondaryGradient q-pa-xs',
            handler: () => {
              this.logOut();
            }
          },
        ]
      }
    },
    methods: {
      changeRoute(route) {
        if (this.$route.fullPath === route) return;
        this.$router.push(route);
      },
      logOut() {
        let userId = this.user._id;
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
        });
        this.$store.dispatch('users/patch', [userId, {
          active: false
        }]);
      },
    }
  };
</script>

<style scoped>

</style>

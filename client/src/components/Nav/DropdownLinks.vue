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
            class: 'bg-primaryGradient q-pa-xs',
            handler: () => {
              this.changeRoute('/account');
            }
          },
          {
            label: 'Log Out',
            icon: 'fas fa-sign-out-alt',
            class: 'bg-primaryGradient q-pa-xs',
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

<template>
  <q-page class="flex flex-center">
    <q-card class="row">
      <div class="row">
        <div class="q-ma-lg">
          <q-avatar size="300px">
            <img :src="user.avatar" style="border: 2px solid var(--q-color-primary)"/>
          </q-avatar>
        </div>
        <div class="q-ma-lg row" style="display: flex; flex-direction: column;">
          <div>
            <span v-if="!editing" class="text-weight-bold text-h4">{{ user.username }}</span>
            <q-input v-if="editing" label="Username" v-model="clonedUser.username" :placeholder="user.username"/>
          </div>
          <q-separator/>
          <div class="column q-mt-lg">
          <span class="text-h6">
            <q-icon name="email" color="secondary"/>
            &nbsp; &nbsp;<span>{{ user.email }}</span>
          </span>
            <q-separator/>
            <span class="text-h6">
            <q-icon v-if="!editing" name="call" color="secondary"/>
            &nbsp; &nbsp;<span v-if="!editing">{{ user.phone }}</span>
              <q-input v-if="editing" label="Phone" v-model="clonedUser.phone" :placeholder="user.phone"
                       mask="###-###-####"
                       unmasked-value/>
          </span>
            <q-separator/>
          </div>
        </div>
        <div class="flex justify-start items-end" style="width: 100%;">
          <span class="text-subtitle1 q-ma-xs">Member since: {{
              date.formatDate($lget(user, 'createdAt', new Date()), 'MMM DD, YYYY')
            }}</span>
        </div>
      </div>
      <div class="column">
        <q-btn class="q-ma-md" outlined icon="receipt" label="Watched Listings" color="secondary"></q-btn>
        <q-btn class="q-ma-md" outlined icon="chat" label="Messages" color="secondary">
          <q-badge color="red" floating>5+</q-badge>
        </q-btn>
        <q-space/>
        <q-btn v-if="!editing" rounded outline label="Edit Profile" icon="create" color="primary" class="q-ma-sm"
               @click="editing = true">

        </q-btn>
        <q-btn v-if="editing" rounded outline label="Save" icon="save" color="primary" class="q-ma-sm"
               @click="saveAccount">

        </q-btn>
        <div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
  import {mapState} from 'vuex';
  import {date} from 'quasar'

  export default {
    name: 'Account',
    data() {
      return {
        editing: false,
        date: date,
      }
    },
    computed: {
      ...mapState('auth', {
        user: 'user'
      }),
      clonedUser() {
        return this.user.clone();
      }
    },
    methods: {
      saveAccount() {
        this.$q.loading.show();
        this.editing = !this.editing;
        this.clonedUser.save().then((res) => {
          this.$q.loading.hide();
          this.$q.notify({
            color: 'secondary',
            textColor: 'white',
            icon: 'check_circle',
            message: 'Account Saved',
            position: 'top-right',
            timeout: 3000,
          })
        }).catch((err) => {
          this.$q.loading.hide();
          if (err.code === 409) {
            this.$q.notify({
              color: 'secondary',
              textColor: 'white',
              icon: 'cancel',
              message: 'That username is already taken.',
              position: 'bottom',
              timeout: 5000,
            })
          } else {
            this.$q.loading.hide();
            if (err.code === 409) {
              this.$q.notify({
                color: 'secondary',
                textColor: 'white',
                icon: 'cancel',
                message: 'Something went wrong, please refresh your connection and try again.',
                position: 'bottom',
                timeout: 5000,
              })
            }
          }
        })
      }
    }
  };
</script>

<style scoped>

</style>

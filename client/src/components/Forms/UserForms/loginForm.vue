<template>
  <q-card :style="$q.screen.lt.md ? 'width: 80vw;' : 'width: 50vw;'">
    <q-card-section>
      <span class="text-h6 text-weight-bolder">Log In</span>
      <div style="height: 5px;" class="bg-primary">

      </div>
    </q-card-section>
    <q-card-section>
      <q-form style="display: flex;flex-direction: column; justify-content: space-evenly;align-content: space-evenly;"
              @submit="loginUser">

        <div class="q-my-md">
          <q-input :lazy-rules="true" rounded outlined v-model="userData.email" label="Email"
                   :rules="[ val => isEmail || 'Must be an email']">
            <template v-slot:prepend>
              <q-icon name="email"/>
            </template>

          </q-input>
        </div>

        <div class="q-my-md">
          <q-input rounded outlined v-model="userData.password" label="Password" :type="showPassword ? '' : 'password'">
            <template v-slot:prepend>
              <q-icon name="fas fa-unlock"/>
            </template>
            <template v-slot:append>
              <div class="cursor-pointer" @click="showPassword = !showPassword">

                <q-icon :name="showPassword ? 'visibility' : 'visibility_off'"/>
                <span class="text-weight-regular text-xs">Show</span>
              </div>
            </template>

          </q-input>
        </div>
        <div>
          <span class="text-weight-bold text-primary cursor-pointer" @click="$emit('register')" v-if="!mini">Don't have an account?</span>
          <div class="flex justify-end">
            <q-btn rounded type="submit" color="primary">
              Log in
            </q-btn>
          </div>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
  import {mapActions} from 'vuex';
  export default {
    name: 'loginForm',
    props: {
      mini: Boolean,
    },
    data() {
      return {
        showPassword: false,
        userData: {
          email: '',
          password: '',

        }
      }
    },
    computed: {
      isEmail() {
        let reg = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
        return reg.test(this.userData.email);
      }
    },
    methods: {
      ...mapActions('auth', {
        authenticate: 'authenticate'
      }),
      loginUser() {
        this.$q.loading.show();
        this.authenticate({...this.userData, strategy: 'local'}).then((res) => {
          this.$q.loading.hide();
          this.$q.notify({
            color: 'secondary',
            textColor: 'white',
            icon: 'check_circle',
            message: `Welcome back ${res.user.username}`,
            position: 'top-right',
            timeout: 3000,
          })
          if(!this.mini){
            this.$router.push('/');
          }else {
            this.$emit('close');
          }

        }).catch((err) => {
          this.$q.loading.hide();
          console.log(err);
          this.$q.notify({
            color: 'secondary',
            textColor: 'white',
            icon: 'check_circle',
            message: 'Wrong email or password',
            position: 'top-right',
            timeout: 5000,
          })
        })
      }
    }
  };
</script>

<style scoped>

</style>

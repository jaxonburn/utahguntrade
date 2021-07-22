<template>
  <q-card :style="$q.screen.lt.md ? 'width: 80vw;' : 'width: 50vw;'">

    <q-card-section>
      <span class="text-h6 text-weight-bolder">Create an Account</span>
      <div style="height: 5px;" class="bg-primary">

      </div>
    </q-card-section>
    <q-card-section>
      <q-form style="display: flex;flex-direction: column; justify-content: space-evenly;align-content: space-evenly;" @submit.stop="createUser">

        <div class="q-my-md">
          <q-input rounded outlined v-model="userData.username" label="Username">
            <template v-slot:prepend>
              <q-icon name="contact_page"/>
            </template>

          </q-input>
        </div>

        <div class="q-my-md">
          <q-input :lazy-rules="true" rounded outlined v-model="userData.email" label="Email" :rules="[ val => isEmail || 'Must be an email']">
            <template v-slot:prepend>
              <q-icon name="email"/>
            </template>

          </q-input>
        </div>

        <div class="q-my-md">
          <q-input rounded outlined hint="Phone number is recommended for people who plan to sell" v-model="userData.phone" label="Phone" mask="###-###-####"
                   unmasked-value>
            <template v-slot:prepend>
              <q-icon name="call"/>
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

        <div class="q-my-md">
          <q-input rounded outlined v-model="confirmPassword" label="Confirm Password"
                   :type="showPassword ? '' : 'password'" :rules="[ val => passwordsMatch || 'Passwords must match']">

          </q-input>
        </div>
        <div>
          <span class="text-weight-bold text-primary cursor-pointer" @click="$emit('login')">Already have an account?</span>
        <div class="flex justify-end">
          <q-btn rounded type="submit" color="primary">
            Create User
          </q-btn>
        </div>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
  import {models} from 'feathers-vuex';
  import {mapActions} from 'vuex';

  export default {
    name: 'registerForm',
    data() {
      return {
        showPassword: false,
        confirmPassword: '',
        userData: {
          username: '',
          email: '',
          phone: '',
          password: '',
        },
      }
    },
    computed: {
      passwordsMatch(){
        return this.confirmPassword === this.userData.password;
      },
      isEmail(){
        let reg = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
        return reg.test(this.userData.email);
      }
    },
    methods: {
      ...mapActions('auth', {
        authenticate: 'authenticate'
      }),
      createUser(){
        this.$q.loading.show();
        let user = new models.api.Users(this.userData);
        if(!user.username){
          this.$q.notify({
            message: 'Must create a username',
            color: 'negative'
          });
          return;
        }
        if(!user.email || !user.password){
          this.$q.notify({
            message: 'User must have valid email and password',
            color: 'negative'
          });
          return;
        }
        let userData = {email: user.email, password: user.password};
        user.create().then(() => {
          this.$q.loading.hide();
          this.$q.notify({
            color: 'secondary',
            textColor: 'white',
            icon: 'check_circle',
            message: 'Account Created',
            position: 'top-right',
            timeout: 3000,
          })
          this.authenticate({...userData, strategy: 'local'});
          this.$router.push('/');
        }).catch((err) => {
          this.$q.loading.hide();
          console.error(err);
          if(err.name === 'Conflict'){
            this.$q.notify({
              color: 'primary',
              textColor: 'white',
              icon: 'cancel',
              message: 'That username/email is already taken.',
              position: 'top-right',
              timeout: 10000,
            })
          }
          console.error(err);
        })
      }
    }
  };
</script>

<style scoped>

</style>

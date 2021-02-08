<template>
  <q-card style="width: 40vw;">

    <q-card-section>
      <span class="text-h6 text-weight-bolder">Create an Account</span>
      <div style="height: 5px;" class="bg-primary">

      </div>
    </q-card-section>
    <q-card-section>
      <q-form style="display: flex;flex-direction: column; justify-content: space-evenly;align-content: space-evenly;" @submit="createUser">

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
          <q-input rounded outlined v-model="userData.phone" label="Phone" mask="###-###-####"
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
      createUser(){
        this.$q.loading.show();
        let user = new models.api.Users(this.userData);
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
          this.$router.push('/');
        }).catch((err) => {
          this.$q.loading.hide();
          console.error(err);
        })
      }
    }
  };
</script>

<style scoped>

</style>

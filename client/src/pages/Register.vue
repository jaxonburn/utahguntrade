<template>
    <q-page class="flex flex-center q-mt-lg">
      <div style="position: relative;display: flex; justify-content: center;align-items: center;" v-if="register === true">
        <register-form @login="register = !register"></register-form>
      </div>
      <div v-if="register === false" style="position: relative;display: flex; justify-content: center;align-items: center;">
        <login-form @register="register = !register"></login-form>
      </div>
      <div style="position: absolute; top: -250px; height: 100vh;width: 100vw; z-index: -1">
        <div style="height: 100%; width: 100%; opacity: .2">
          <blobs style-in="height: 100%;"></blobs>
        </div>
      </div>
    </q-page>
</template>

<script>
  import Blobs from 'components/Background/Blobs';
  import RegisterForm from 'components/Forms/UserForms/registerForm';
  import LoginForm from 'components/Forms/UserForms/loginForm';

  export default {
    name: 'Register',
    components: {
      LoginForm,
      RegisterForm,
      Blobs
    },
    data(){
      return {
        register: false,
      }
    }
  };
</script>

<style scoped>
</style>

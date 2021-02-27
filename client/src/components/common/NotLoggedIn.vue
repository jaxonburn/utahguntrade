<template>
  <q-card style="max-width: 800px; width: 100%;height: 600px;display: flex; flex-direction: column;overflow: hidden;">
    <div class="flex justify-between">
      <div style="height: 60px;">
        <img @click="$router.push('/')"
             width="140"
             src="../../assets/utahgunhub.png"
             class="q-ma-sm cursor-pointer"
             alt="MainLogo"
        />
      </div>
      <div style="display: flex; flex-direction: column;">
      <q-btn round icon="close" color="black" class="q-ma-sm" @click="$emit('close')"/>
      <q-btn v-if="!notLogging" round icon="reply" class="q-ma-sm text-primary" @click="notLogging = !notLogging" style="display: inline-block;transform: rotate(360deg) scaleX(-1);"/>
      </div>
    </div>
    <transition name="slide-fade" appear>
      <div style="display: flex; flex-direction: row;height: 100%;" class="q-mx-xl q-mb-xl" v-if="notLogging">
        <div class="halfDivs" style="width: 65%;">
          <h4 class="specialFont">Login or Register <br>to like,comment, post gun listings and more.</h4>
        </div>
        <q-separator vertical></q-separator>
        <div class="halfDivs" style="width: 30%;">
          <div style="display: flex; justify-content: center; align-items: center;flex-direction: column;">
            <q-btn push size="lg" label="Log In" color="primary" @click="notLogging = false"></q-btn>
            <h6 class="specialFont q-my-md">Or</h6>
            <q-btn push size="lg" label="Register" color="secondary" @click="$router.push({name: 'register',  params: { register: 'register' }})"></q-btn>
          </div>
        </div>
      </div>
    </transition>
    <transition name="slide-fade">
      <div v-if="!notLogging" class="flex flex-center q-mt-md" style="height: 90%;">
        <login-form :mini="true" @close="$emit('close')"></login-form>
      </div>
    </transition>

  </q-card>
</template>

<script>
  import LoginForm from 'components/Forms/UserForms/loginForm';

  export default {
    name: 'NotLoggedIn',
    components: {LoginForm},
    data() {
      return {
        notLogging: true,
      }
    }
  };
</script>

<style scoped>
  @font-face {
    font-family: Kuchek;
    src: url("../../assets/Poppins/Poppins-Bold.ttf") format("opentype");
  }

  .specialFont {
    font-family: "Kuchek", Times, serif;
    line-height: 1.3em;
    font-weight: 500;
    font-size: 3.3em;
  }

  .halfDivs {
    display: flex;
    justify-content: center;
    align-items: center;
  }


  .slide-fade-enter-active {
    transition: all 1.5s ease;
  }

  .slide-fade-leave-active {
    transition: all 0.2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
    transform: translateX(-100px);
  }
</style>

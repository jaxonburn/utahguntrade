<template>
  <div class="fullscreen bg-black text-white text-center q-pa-md"
       style="display: flex; flex-direction: column;justify-content: center; align-items: center;">
    <div>
      <vLottiePlayer
        name="workoutMonkeyAnim"
        loop
        :animationData="require('../assets/404Error.json')"
        width="700px"
        height="500px"
      />
    </div>
    <div>
      <h4>Not sure this page exists yet, head back?</h4>
      <q-btn
        color="white"
        text-color="primary"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

<script>

  import VueLottiePlayer from "vue-lottie-player";

  export default {
    name: 'Error404',
    components: {
      vLottiePlayer: VueLottiePlayer
    }
  }
</script>

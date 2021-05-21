<template>
  <div class="fullscreen bg-white text-black text-center q-pa-md"
       style="display: flex; flex-direction: column;justify-content: center; align-items: center;">
    <div>
      <vLottiePlayer
        name="workoutMonkeyAnim"
        loop
        :animationData="require('../assets/LottieAnimations/other404Error.json')"
        width="700px"
        height="500px"
      />
    </div>
    <div>
      <h4>Oops! We can't seem to find the page you're looking for.</h4>
      <q-btn
        color="black"
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

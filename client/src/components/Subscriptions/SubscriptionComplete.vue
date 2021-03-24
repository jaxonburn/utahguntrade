<template>
    <div style="width: 70%;height: 500px;background: white;border-radius: 25px;" v-else>
      <div style="display: flex; flex-direction: column;">
        <span class="specialFont text-secondary">Your subscription has been activated.<q-icon name="verified" color="positive" size="md"></q-icon></span>
        <span class="nameFont text-secondary">The UtahGunHub team thanks you for your support.</span>
      </div>
      <div style="display: flex; justify-content: center; align-items: flex-end;height: 300px;" class="q-ma-xs">
        <vLottiePlayer
          name="Thanks"
          loop
          autoplay
          :animationData="require('../../assets/LottieAnimations/PeopleWorking.json')"
          width="600px"
          height="300px"
          style="display: flex; justify-content: center; align-items: center;"
        />
      </div>
      <div>
        <q-btn label="Browse Listings" color="primary" class="q-mx-sm" @click="$router.push({name: 'listings'})"> </q-btn>
<!--        <q-btn label="Go to Utah Gun Community" color="primary" class="q-mx-sm" @click=""> </q-btn>-->
      </div>
    </div>
</template>

<script>
  import VueLottiePlayer from "vue-lottie-player";


  export default {
    name: 'SubscriptionComplete',
    components: {
      vLottiePlayer: VueLottiePlayer,
    },
  };
</script>

<style scoped>
  .specialFont {
    font-family: "Kuchek", Times, Serif;
    font-weight: 900;
    font-size: 2em;
    white-space: nowrap;
  }

  .nameFont {
    font-family: "KuchekThin", Times, Serif;
    line-height: 1em;
    font-weight: 600;
    font-size: 1.4em;
  }
</style>

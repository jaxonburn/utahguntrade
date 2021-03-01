<template>
  <q-page style="width: 100%;height: 100%;">
    <div style="width: 100%; height: 100%;">
      <div class="header">

        <!--Content before waves-->
        <div style="height: 70vh;width: 100%;display: flex; flex-direction: row;">
            <div style="width: 50%;" class="flex flex-center">
              <div class="boxShadow premiumCard">
                <div>

                </div>
              </div>
            </div>
            <div style="width: 50%;" class="flex flex-center">
              <div class="boxShadow premiumCard" >
                <div style="display: flex; justify-content: center;flex-direction: column;">
                  <div><span class="specialFont text-center text-primary">Premium Membership</span></div>
                  <div style="display: flex; justify-content: center; align-items: center;">
                  <vLottiePlayer
                    name="Gold"
                    loop
                    autoplay
                    :animationData="require('../../assets/LottieAnimations/Gold.json')"
                    width="500px"
                    height="300px"
                    style="display: flex; justify-content: center; align-items: center;"
                  />
                  </div>
                </div>
                <q-list style="display: flex; justify-content: center; align-items: center;flex-direction: column;">
                  <q-item class="text-secondary nameFont">
                    Unlimited Listings
                  </q-item>
                  <q-item class="text-secondary nameFont">
                    Attach documents to sold listings
                  </q-item>
                  <q-item class="text-secondary nameFont">
                    Access to GunHubCommunity
                  </q-item>
                  <q-item>
                    <q-btn size="lg" style="background: linear-gradient(0deg, #2F80ED, #B2FFDA)" push>Go Premium</q-btn>
                  </q-item>
                </q-list>
              </div>
            </div>
        </div>

        <div>
          <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
               viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
            <defs>
              <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
            </defs>
            <g class="parallax">
              <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
              <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
              <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
              <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
            </g>
          </svg>
        </div>

      </div>
    </div>
  </q-page>
</template>

<script>
  import VueLottiePlayer from "vue-lottie-player";

  export default {
    name: 'Premium',
    components: {
      vLottiePlayer: VueLottiePlayer
    }
  };
</script>

<style scoped>

  .premiumCard {
    width: 65%;
    height: 600px;
    background: rgba(250, 250, 250, 0.90);
    border-radius: 25px;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }


  .header {
    position:relative;
    text-align:center;
    background: rgb(253,255,91);
    background: linear-gradient(145deg, #0B63F6 11%, #0d4bdb 31%);
    color:white;
  }
  .logo {
    width:50px;
    fill:white;
    padding-right:15px;
    display:inline-block;
    vertical-align: middle;
  }

  .inner-header {
    height:65vh;
    width:100%;
    margin: 0;
    padding: 0;
  }

  .flex { /*Flexbox for containers*/
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .waves {
    position:relative;
    width: 100%;
    height:15vh;
    margin-bottom:-7px; /*Fix for safari gap*/
    min-height:100px;
    max-height:150px;
  }

  .content {
    position:relative;
    height:20vh;
    text-align:center;
    background-color: white;
  }

  /* Animation */

  .parallax > use {
    animation: move-forever 25s cubic-bezier(.55,.5,.45,.5)     infinite;
  }
  .parallax > use:nth-child(1) {
    animation-delay: -2s;
    animation-duration: 7s;
  }
  .parallax > use:nth-child(2) {
    animation-delay: -3s;
    animation-duration: 10s;
  }
  .parallax > use:nth-child(3) {
    animation-delay: -4s;
    animation-duration: 13s;
  }
  .parallax > use:nth-child(4) {
    animation-delay: -5s;
    animation-duration: 20s;
  }
  @keyframes move-forever {
    0% {
      transform: translate3d(-90px,0,0);
    }
    100% {
      transform: translate3d(85px,0,0);
    }
  }
  /*Shrinking for mobile*/
  @media (max-width: 768px) {
    .waves {
      height:40px;
      min-height:40px;
    }
    .content {
      height:30vh;
    }
    h1 {
      font-size:24px;
    }
  }


  .specialFont {
    font-family: "Kuchek", Times, Serif;
    font-weight: 900;
    font-size: 2em;
    white-space: nowrap;
  }

  .nameFont {
    font-family: "KuchekMedium", Times, Serif;
    line-height: 1em;
    font-weight: 600;
    font-size: 1.4em;
  }

</style>

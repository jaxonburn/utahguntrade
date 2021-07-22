<template>
  <q-page style="width: 100%;height: 100%;">
    <div style="width: 100%; height: 100%;">
      <div class="header">

        <!--Content before waves-->
        <div style="height: 70vh;width: 100%;display: flex; flex-direction: row;"
             :style="paymentSucceeded ? 'justify-content: center; align-items: center;' : ''">
          <transition name="slide-fade" :appear="!paymentSucceeded">
          <div style="width: 50%;" class="flex flex-center q-pt-md" v-if="!paymentSucceeded">
            <div class="boxShadow premiumCard" style="justify-content: flex-start;">
              <div style="display: flex; justify-content: center;flex-direction: column;">
                <div><span class="specialFont text-center text-grey-7">Free Plan</span></div>
                <div style="display: flex; justify-content: center; align-items: center;">
                  <vLottiePlayer
                    name="Silver"
                    loop
                    autoplay
                    :animationData="require('../../assets/LottieAnimations/Silver.json')"
                    width="500px"
                    height="300px"
                    style="display: flex; justify-content: center; align-items: center;"
                  />
                </div>
              </div>
              <q-list style="display: flex; justify-content: center; align-items: center;flex-direction: column;">
                <q-item class="text-secondary nameFont">
                  Up to 3 Active Listings
                </q-item>
                <q-item class="text-secondary nameFont">
                  Browse unlimited listings
                </q-item>
                <q-item class="text-secondary nameFont">
                  Unlimited Chats
                </q-item>
                <q-item class="text-secondary nameFont">
                  Access to all UtahGunHub.com articles
                </q-item>
              </q-list>
            </div>
          </div>
          </transition>
          <transition name="slide-fade">
            <subscription-complete v-if="paymentSucceeded" style="position: absolute;z-index: 10;">

            </subscription-complete>
          </transition>
          <transition name="slide-fade" :appear="!paymentSucceeded">
          <div style="width: 50%;" class="flex flex-center q-pt-md" v-if="!paymentSucceeded">
            <div class="boxShadow premiumCard" style="justify-content: flex-start;">
              <div style="display: flex; justify-content: center;flex-direction: column;">
                <div><span class="specialFont text-center text-primary">Premium Membership</span></div>
                <div style="display: flex; justify-content: center; align-items: center;">
                  <vLottiePlayer
                    name="Gold"
                    loop
                    autoplay
                    :animationData="require('../../assets/LottieAnimations/Gold.json')"
                    width="500px"
                    height="250px"
                    style="display: flex; justify-content: center; align-items: center;"
                  />
                </div>
              </div>
              <q-list style="display: flex; justify-content: center; align-items: center;flex-direction: column;">
                <q-item class="text-secondary nameFont">
                  <q-item-section>
                    <q-item-label>Unlimited Active Listings</q-item-label>
                    <q-item-label caption lines="1">Sell as many listings as you'd like</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item class="text-secondary nameFont">
                  <q-item-section>
                    <q-item-label>Store Bill of Sales Info on each Listing</q-item-label>
                    <q-item-label caption lines="2">Store information related to a sold gun like serial number, bill of
                      sales, date...
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item class="text-secondary nameFont">
                  <q-item-section>
                    <q-item-label>Supports UtahGunhub & Further Development</q-item-label>
                    <q-item-label caption lines="2">We made this to help connect Utah Firearm owners. Supporting
                      UtahGunHub means supporting that cause.
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item class="text-secondary nameFont">
                  <q-item-section>
                    <q-item-label>Access to GunHubCommunity</q-item-label>
                    <q-item-label caption lines="2">A community for posting, chatting, and organizing. Supporting free
                      speech and connecting gun enthusiasts.
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <div class="row">
                    <stripe-checkout
                      ref="checkoutRef"
                      mode="subscription"
                      pk="pk_test_51IPfrSJZXWwylQALUNgUyfEtrVlbnV1nQ4nrUD4ZQ0FMkV0oKMDNkpubR4F6GalGhOuxYuZ5YBVcLt2CtWtCHIxb00JJXfQGgU"
                      :line-items="[
                              {
                                price: 'price_1IPfucJZXWwylQALdYqBL2yN',
                                quantity: 1,
                              }
                            ]"
                      :customerEmail="$lget(user, 'email', '')"
                      success-url="http://localhost:8080/premium?confirm=true?subscription=accepted"
                      cancel-url="http://localhost:8080"
                      @loading="v => loading = v"
                    />
                    <q-btn size="lg" style="background: linear-gradient(0deg, #2F80ED, #B2FFDA);z-index: 5;" push @click="submit">
                      Go Premium
                    </q-btn>
                  </div>

                </q-item>
              </q-list>
            </div>
          </div>
          </transition>
        </div>

        <div>
          <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
               viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
            <defs>
              <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"/>
            </defs>
            <g class="parallax">
              <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7"/>
              <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)"/>
              <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)"/>
              <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff"/>
            </g>
          </svg>
        </div>

      </div>
    </div>
  </q-page>
</template>

<script>
  import VueLottiePlayer from "vue-lottie-player";
  import {StripeCheckout} from '@vue-stripe/vue-stripe';
  import {mapActions, mapState} from 'vuex';
  import SubscriptionComplete from 'components/Subscriptions/SubscriptionComplete';

  export default {
    name: 'Premium',
    components: {
      SubscriptionComplete,
      vLottiePlayer: VueLottiePlayer,
      StripeCheckout,
    },
    mounted() {
      if (this.$route.query.confirm === 'true?subscription=accepted') {
        this.paymentSucceeded = true;
      }
    },
    data() {
      return {
        paymentSucceeded: false
      }
    },
    computed: {
      ...mapState('auth', {
        user: 'user'
      }),
    },
    methods: {
      ...mapActions('create-customer-portal-session', {
        createPortal: 'create'
      }),
      submit() {
        this.$refs.checkoutRef.redirectToCheckout();
      },
      openCustomerPortal() {
        this.createPortal({stripeId: this.user.stripeId}).then((res) => {
          window.location = res.result;
        }).catch((err) => {
          console.error(err);
        })
      },
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
    position: relative;
    text-align: center;
    background: rgb(253, 255, 91);
    background: linear-gradient(145deg, #0B63F6 11%, #0d4bdb 31%);
    color: white;
  }

  .logo {
    width: 50px;
    fill: white;
    padding-right: 15px;
    display: inline-block;
    vertical-align: middle;
  }

  .inner-header {
    height: 65vh;
    width: 100%;
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
    position: relative;
    width: 100%;
    height: 15vh;
    margin-bottom: -7px; /*Fix for safari gap*/
    min-height: 100px;
    max-height: 150px;
  }

  .content {
    position: relative;
    height: 20vh;
    text-align: center;
    background-color: white;
  }

  /* Animation */

  .parallax > use {
    animation: move-forever 25s cubic-bezier(.55, .5, .45, .5) infinite;
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
      transform: translate3d(-90px, 0, 0);
    }
    100% {
      transform: translate3d(85px, 0, 0);
    }
  }

  /*Shrinking for mobile*/
  @media (max-width: 768px) {
    .waves {
      height: 40px;
      min-height: 40px;
    }

    .content {
      height: 30vh;
    }

    h1 {
      font-size: 24px;
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
    font-size: 1.3em;
  }

  .slide-fade-enter-active {
    transition: all 1.5s ease;
  }
  .slide-fade-leave-active {
    transition: all 1.5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateX(50px);
    opacity: 0;
  }

</style>

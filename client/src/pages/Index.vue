<template>
  <q-page style="width: 100vw;overflow: hidden;">
    <div style="display: flex; flex-direction: column;">
      <div style="height: 70vh;display: flex; justify-content: center; align-items: center;">
        <div
          class="mainBackground">
          <div class="mainBackGroundText q-pa-md" data-aos="fade-up" data-aos-duration="800">
            <div class="flex flex-center mainCard">
              <div class="text-mb-xxl mainTitleFont" style="text-align: center;">Browse Gun Listings all over Utah</div>
            </div>
            <div style="text-align: center; color: white; margin-top: 13px; font-size: 1.3em;">
              <div class="readFont">Trade | Connect | Educate</div>
            </div>
            <div style="text-align: center;">
              <q-btn @click="$router.push('listings')" class="q-mt-md bg-primaryGradient text-white"
                     label="Browse listings" size="lg"/>
            </div>
          </div>
        </div>
      </div>
      <div style="width: 100%;" class="q-py-md" data-aos="fade-left" data-aos-duration="600">
        <near-you-map></near-you-map>
      </div>
<!--      <div>-->
<!--        <div class="mainTitleFont bg-primaryGradient text-white boxShadow" style="font-size: 2em;text-indent: 20px;height: 50px;">Recently Posted Listings</div>-->
<!--        <carousel :perPage="$q.screen.lt.md ? 1 : $q.screen.gt.lg ? 5 : 4" :speed="30" paginationActiveColor="#011d80" easing="ease">-->
<!--          <slide v-for="(listing,index) in latestListings" :key="index">-->
<!--            <listing-card :listing="listing">-->

<!--            </listing-card>-->
<!--          </slide>-->
<!--        </carousel>-->
<!--      </div>-->
    </div>
  </q-page>
</template>

<script>

  import NearYouMap from 'components/common/NearYouMap';
  import { Carousel, Slide } from 'vue-carousel';
  import Listing from 'components/common/Listing';
  import {mapActions} from 'vuex';
  import AOS from 'aos'
  import 'aos/dist/aos.css'

  export default {
    name: 'PageIndex',
    components: {
      ListingCard: Listing,
      NearYouMap,
      Carousel,
      Slide
    },
    created () {
      AOS.init()
    },
    mounted(){
      this.createAnalytic({reqFrom: 'layout'});
    },
    data() {
      return {
        swiperOption: {
          effect: 'coverflow',
          grabCursor: true,
          centeredSlides: true,
          slidesPerView: 3,
          loop: true,
          autoplay: {
            delay: 2500,
            stopOnLastSlide: false,
            disableOnInteraction: false
          },
          coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true
          },
          pagination: {
            el: '.swiper-pagination'
          }
        }
      }
    },
    methods: {
      ...mapActions('analytics', {
        createAnalytic: 'create'
      }),
    }
  }
</script>


<style lang="scss" scoped>

  .mainBackground {
    background-image: url('https://images.unsplash.com/photo-1591123720164-de1348028a82?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1525&q=80');
    background-size: contain;
    background-repeat: no-repeat;
    height: 90%; width: 90%;
    background-position: center;
    background-attachment: fixed;
    display: flex;
    justify-content: center;
    align-items: center;

    // temp changes
    width: 100vw;
    height: 100%;
    background-size: cover;
  }
  .mainBackGroundText {
    background: rgba(225, 225, 225, 0.45);
    border-radius: 15px;
  }

  .mainCard {
    background: rgba(255, 255, 255, 0.7);
    font-size: 4em;
    border-radius: 15px;
    font-family: 'alegreyaregular', 'Arial', 'sans-serif';

    // temp changes
    background: none;
    color: white;
    font-family: 'Arial';
    font-weight: 450;
    font-size: 3.5em;
  }

  .mainTitleFont {
    font-family: "Kuchek", Times, Serif;
    line-height: 1.2em;
    font-weight: 500;
    font-size: 1.15em;
  }

  .readFont {
    font-family: "KuchekLight", Times, Serif;
    line-height: 1.6em;
    font-size: 1.4em;
    font-weight: 300;
  }
</style>


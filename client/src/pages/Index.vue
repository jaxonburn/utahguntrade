<template>
  <q-page style="width: 100%;">
    <div style="display: flex; flex-direction: column;">
      <div style="height: 600px;display: flex; justify-content: center; align-items: center;">
        <div
          class="mainBackground">
          <div>
<!--            <q-card class="flex flex-center mainCard">-->
<!--              <div class="text-xxl text-mb-xxl" style="text-align: center;">Browse Gun Listings all over Utah</div>-->
<!--            </q-card>-->
<!--            temp changes-->
            <div class="flex flex-center mainCard">
              <div class="text-mb-xxl mainTitleFont" style="text-align: center;">Browse Gun Listings all over Utah</div>
            </div>
            <div style="text-align: center; color: white; margin-top: 13px; font-size: 1.3em;">
              <div class="readFont">Trade | Connect | Educate</div>
            </div>
            <div style="text-align: center;">
              <q-btn @click="$router.push('listings')" class="q-mt-md" style="text-align: center;" color="primary"
                     label="Browse listings" size="lg"/>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-center q-mb-md"
           style="border-bottom: 3px solid var(--q-color-primary); border-top: 3px solid var(--q-color-primary)">
        <!--        <span class="text-weight-thin text-h4">Featured Listings</span>-->
      </div>
      <div style="width: 100%;" class="q-py-md">
        <near-you-map></near-you-map>
      </div>
      <q-separator/>
      <div>
        <div class="readFont bg-primary text-white boxShadow" style="font-size: 2em;text-indent: 20px;height: 50px;">Recently Posted Listings</div>
        <carousel :perPage="$q.screen.lt.md ? 1 : 3" :speed="30" paginationActiveColor="#011d80">
          <slide v-for="(listing,index) in latestListings" :key="index">
            <listing-card :listing="listing">

            </listing-card>
          </slide>
        </carousel>
      </div>
    </div>
    <q-separator color="primary" size="5px"/>
    <div style="height: 100px;width: 100%;background: white;">

    </div>
  </q-page>
</template>

<script>

  import NearYouMap from 'components/common/NearYouMap';
  import { Carousel, Slide } from 'vue-carousel';
  import Listing from 'components/common/Listing';
  import {mapActions} from 'vuex';

  export default {
    name: 'PageIndex',
    components: {
      ListingCard: Listing,
      NearYouMap,
      Carousel,
      Slide
    },
    mounted(){
      this.findListings({query: {$limit: 6,$sort: {createdAt: -1},sold: false,archived: false}}).then((res) => {
        console.log(res);
        this.latestListings = res.data;
      })
    },
    data() {
      return {
        latestListings: [],
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
      ...mapActions('listings', {
        findListings: 'find'
      })
    }
  }
</script>


<style lang="scss" scoped>

  .mainBackground {
    background-image: url('../assets/mainPagePhoto.jpeg');
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
    font-size: 1.3em;
    font-weight: 100;
  }
</style>


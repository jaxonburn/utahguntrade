<template>
  <q-page>
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
      <!--      <div style="display: flex; justify-content: center; align-items: center;height: 450px;">-->
      <!--        <div style="width: 95vw;height: 90%;display: flex; justify-content: center; align-items: center;-->
      <!--"-->
      <!--        >-->

      <!--          <swiper class="swiper" :options="swiperOption">-->
      <!--            <swiper-slide v-for="(product,index) in featuredProducts" :key="index"-->
      <!--                          :style="{backgroundImage: `url(${product.image})`}">-->
      <!--              <div :style="{'background-image': product.image}">-->
      <!--                <div class="q-pa-sm"-->
      <!--                     style="display: flex; flex-direction: column;background: rgba(130, 130, 130, 0.6);">-->
      <!--                  <span class="text-xxs text-mb-xxs">{{ product.artist }}</span>-->
      <!--                </div>-->
      <!--              </div>-->
      <!--            </swiper-slide>-->
      <!--            <div class="swiper-pagination" slot="pagination"></div>-->
      <!--          </swiper>-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="map-wrapper">
        <near-you-map></near-you-map>
      </div>
    </div>
  </q-page>
</template>

<script>

  import NearYouMap from 'components/common/NearYouMap';


  export default {
    name: 'PageIndex',
    components: {
      NearYouMap,
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


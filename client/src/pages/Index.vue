<template>
  <q-page>
    <div style="display: flex; flex-direction: column;">
      <div style="height: 500px;display: flex; justify-content: center; align-items: center;">
        <div
          style="background-image: url('https://images.unsplash.com/photo-1481140717212-b0124736c90a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80');background-size: contain;background-repeat: no-repeat;height: 90%; width: 90%;background-position: center;background-attachment: fixed;display: flex; justify-content: center; align-items: center;">
          <div>
            <q-card class="flex flex-center mainCard" >
              <div>Rated Utah's #1 Best Gun Marketplace</div>
            </q-card>
            <div style="text-align: center;">
              <q-btn @click="$router.push('listings')" class="q-mt-lg" style="text-align: center;" color="primary" label="Browse listings" />
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-center" style="border-bottom: 3px solid var(--q-color-primary); border-top: 3px solid var(--q-color-primary)">
        <span  class="text-weight-thin text-h4">Featured Listings</span>
      </div>
      <div style="display: flex; justify-content: center; align-items: center;height: 450px;">
        <div style="width: 95vw;height: 90%;display: flex; justify-content: center; align-items: center;
"
        >

          <swiper class="swiper" :options="swiperOption">
            <swiper-slide v-for="(product,index) in featuredProducts" :key="index"
                          :style="{backgroundImage: `url(${product.image})`}">
              <div :style="{'background-image': product.image}">
                <div class="q-pa-sm"
                     style="display: flex; flex-direction: column;background: rgba(130, 130, 130, 0.6);">
                  <span class="text-xxs text-mb-xxs">{{ product.artist }}</span>
                </div>
              </div>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
        <div style="height: 400px;">
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>

  import {Swiper, SwiperSlide, directive} from 'vue-awesome-swiper';
  import 'swiper/css/swiper.css';

  export default {
    name: 'PageIndex',
    components: {
      Swiper,
      SwiperSlide,
    },
    data() {
      return {
        featuredProducts: [
          {
            artist: '',
            image: 'https://images.unsplash.com/photo-1545915312-f6e4a6de60fb?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
          },
          {
            artist: '',
            image: 'https://images.unsplash.com/photo-1592698426264-d5a81aaa4ec8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80',
          },
          {
            artist: '',
            image: 'https://images.unsplash.com/photo-1551485913-b5dbedb723bb?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTR8fGd1bnxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
          },
          {
            artist: '',
            image: 'https://images.unsplash.com/photo-1559740983-b9c5ffbac1ff?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=975&q=80'
          },
          {
            name: '',
            image: 'https://images.unsplash.com/photo-1579541814924-49fef17c5be5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=919&q=80'
          }

        ],
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
  .example-3d {
    width: 80px;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .swiper {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .swiper-slide {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 20px;
      height: 300px;
      text-align: center;
      font-weight: bold;
      font-size: 1.5rem;
      border-radius: 5px;
      //background-position: center;
      background-size: cover;
      color: #ffffff;
    }

    .swiper-pagination {
      .swiper-pagination-bullet.swiper-pagination-bullet-active {
        background-color: black;
      }
    }
  }


  .mainCard {

    background: rgba(255, 255, 255, 0.7);
    font-size: 4em;
    border-radius: 15px;
    font-family: 'alegreyaregular', 'Arial', 'sans-serif';
  }
</style>


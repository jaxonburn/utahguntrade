<template>
  <div>
    <div class="images" v-if="imageArr">
      <q-icon v-if="selectedImageIdx !== 0" @click="lowerImage" name="chevron_left" class="left-icon" size="xl"/>
      <div>
        <div v-for="(image, idx) of imageArr" :key="idx">
          <transition name="fade">
            <img v-if="idx === selectedImageIdx" :src="image.url" alt="Listing image"/>
          </transition>
        </div>
      </div>
      <q-icon v-if="selectedImageIdx + 1 < imageArr.length" @click="raiseImage" name="chevron_right" class="right-icon" size="xl"/>
    </div>
    <div v-else>
      <div class="images">
        <img :src="defaultImg" alt="No image found"/>
      </div>
    </div>
  </div>
</template>

<script>

  import NoImage from 'assets/no_image.png'

  export default {
    name: "ImageSlider",
    props: {
      images: Array,
    },
    data() {
      return {
        imageArr: [],
        defaultImg: NoImage,
        selectedImageIdx: 0,
        selectedImageUrl: ''
      }
    },
    mounted() {
      this.imageArr = this.images;
      if (this.images.length) {
        this.selectedImage = this.imageArr[0];
        this.selectedImageIdx = 0;
      }
    },
    methods: {
      lowerImage() {
        this.selectedImageIdx--;
      },
      raiseImage() {
        this.selectedImageIdx++;
      }
    }
  }
</script>

<style scoped lang="scss">
  img {
    width: 100%;
    max-height: 55vh;
    //border: 1px solid black;
    position: absolute;
  }

  .images {
    position: relative;
  }

  .left-icon {
    position: absolute;
    left: -50px;
    top: 190px;
    cursor: pointer;
  }

  .right-icon {
    cursor: pointer;
    position: absolute;
    right: -50px;
    top: 190px;
  }

  .footer {
    position: absolute;
    bottom: 75vh;
    display: flex;
    justify-content: space-between;
    width: 45vw;
  }


  .fade-enter {
    transform: translateX(250px);
    opacity: 0;
  }

  .fade-enter-active, .fade-leave-active {
    transition: 0.6s all ease;
  }

  .fade-leave-to {
    transform: translateX(-250px);
    opacity: 0;
  }

</style>

<template>
  <div class="announcement-card" v-if="value && Object.keys(value).length">
    <div class="close" >
      <q-icon name="close" size="md" @click="$emit('close')" />
    </div>
    <div class="header">
      GUNHUB ANNOUNCEMENTS <br>
      {{ value.announcementHeader }}
    </div>
    <div class="img">
      <img :src="value.announcementImage.url" />
    </div>

    <div class="body">
      {{ value.announcementBody }}
    </div>
    <q-btn class="q-mt-sm" label="Close" @click="$emit('close')" color="primary" />
  </div>
</template>

<script>
  export default {
    name: 'AnnouncementCard',
    mounted() {
      let lastDate = JSON.parse(localStorage.getItem('LA_AN'));
      if (!lastDate) {
        localStorage.setItem('LA_AN', JSON.stringify(new Date()));
      } else {
        let now = new Date();
        let difference = (now - new Date(lastDate)) / 1000;
        console.log(difference);
        if (difference > 120) {
          localStorage.setItem('LA_AN', JSON.stringify(new Date()));
        } else {
          this.$emit('close');
        }
      }
    },
    props: {
      value: {
        type: Object,
        default: () => {}
      }
    }
  };
</script>

<style scoped lang="scss">
  .announcement-card {
    background-color: white;
    border-radius: 3px;
    padding: 12px;
    width: 50vw;
    position: relative;
  }
  .close {
    position: absolute;
    cursor: pointer;
    color: red;
    top: 15px;
    right: 15px;
  }
  .header {
    font-size: 2em;
    margin-bottom: 10px;
  }
  img {
    object-fit: cover;
    max-width: 100% !important;
  }
  .body {
    font-weight: 300;
    font-size: 1.3em;
    margin-top: 10px;
  }

  @media only screen and (max-width: 900px) {
    .announcement-card {
      font-size: .8em;
      width: 100vw;
    }
  }
</style>

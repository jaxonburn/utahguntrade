<template>
  <div>
    <h1>Listings</h1>
    <div class="listings-wrapper">
      <Listing :listing="listing" :key="idx" v-for="(listing, idx) of listings"></Listing>
    </div>
  </div>
</template>

<script>

  import { mapActions, mapGetters } from 'vuex';
  import Listing from "components/common/Listing";

  export default {
    name: "Listings",
    components: {Listing},
    mounted(){
      this.loadListings();
    },
    methods: {
      ...mapActions('listings', {
        loadListings: 'find'
      })
    },
    computed: {
      ...mapGetters('listings', {
        getListings: 'find'
      }),
      listings(){
        return this.getListings().data;
      }
    }
  }
</script>

<style scoped lang="scss">
  .listings-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 20px;
  }
</style>

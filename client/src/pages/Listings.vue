<template>
  <div>
    <h1>Listings</h1>
    <div>{{ listings }}</div>
  </div>
</template>

<script>

  import { mapActions, mapGetters } from 'vuex';

  export default {
    name: "Listings",
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

</style>

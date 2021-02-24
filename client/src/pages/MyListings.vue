<template>
  <div class="my-listings">
    <div class="header" v-if="isLoaded">
      <span>My listings</span>
      <span style="margin-left: 30px;">
        <q-select v-model="showResults" :options="['Posted listings', 'Archived listings', 'Sold listings']"></q-select>
      </span>
    </div>
    <div class="body">
      <Loading v-if="!isLoaded"/>
      <div class="listings-wrapper">
        <div v-if="listings.length === 0 && showResults === 'Posted listings'" class="no-listings">No listings found, try checking archived</div>
        <div v-if="listings.length === 0 && showResults === 'Archived listings'" class="no-listings">No Archived found, try checking posted listings</div>
        <div v-if="listings.length === 0 && showResults === 'Sold listings'" class="no-listings">No Sold listings found</div>
        <Listing :is-my-listing="true" :listing="listing" :key="idx" v-for="(listing, idx) of listings"></Listing>
      </div>
    </div>
  </div>
</template>

<script>

  import Loading from 'components/common/Loading';
  import Listing from "components/common/Listing";
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: "MyWatched",
    components: {
      Listing,
      Loading
    },
    data(){
      return {
        isLoaded: false,
        showResults: 'Posted listings',
      }
    },
    mounted(){
      this.loadListings({listedBy: {$in: this.user._id}, $limit: 200}).then(this.isLoaded = true);
      console.log(this.user);
    },
    computed: {
      ...mapGetters('listings', {
        getListings: 'find'
      }),
      ...mapGetters('auth', {
        user: 'user'
      }),
      listings(){
        return this.getListings(this.query).data;
      },
      query(){
        if(this.showResults !== 'Sold listings') {
          return {
            query: {
              listedBy: {$in: this.user._id},
              archived: this.showResults === 'Posted listings' ? false : true,
              sold: false,
              $limit: 200
            }
          }
        } else {
          return {
            query: {
              listedBy: {$in: this.user._id},
              archived: false,
              sold: true,
              $limit: 200
            }
          }
        }
      }
    },
    methods: {
      ...mapActions('listings', {
        loadListings: 'find'
      })
    }
  }
</script>

<style scoped lang="scss">
  .listings-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    justify-items: center;
    grid-gap: 40px;
    padding: 50px 20px;
  }
  .header {
    font-size: 2em;
    padding: 40px 40px 0 40px;
    display: flex;
    align-items: center;
  }
</style>

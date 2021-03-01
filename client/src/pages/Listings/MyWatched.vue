<template>
  <div class="my-watched">
    <div class="header" v-if="isLoaded">My watched items</div>
    <div class="body">
      <Loading v-if="!isLoaded"/>
      <div class="listings-wrapper">
        <Listing :listing="listing" :key="idx" v-for="(listing, idx) of listings"></Listing>
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
        isLoaded: false
      }
    },
    mounted(){
      this.loadListings(this.query).then(this.isLoaded = true);
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
        return {
          query: {
            _id: {$in: this.user.watched},
            $limit: 200
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
  }

  @media screen and (max-width: 1050px) {
    .listings-wrapper {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }

  @media screen and (max-width: 700px) {
    .listings-wrapper {
      grid-template-columns: 1fr;
    }
    .listing {
      width: 60%;
    }
  }

  @media screen and (max-width: 500px) {
    .listings-wrapper {
      grid-template-columns: 1fr;
    }
    .listing {
      width: 90%;
    }
  }
</style>

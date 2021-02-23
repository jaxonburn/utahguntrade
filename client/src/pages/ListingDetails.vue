<template>
  <div class="listing-details">
    <Loading v-if="!listing"/>
    <div v-else class="listing">
      {{ listing }}
    </div>
  </div>
</template>

<script>

  import { mapActions, mapGetters } from 'vuex';
  import Loading from "components/common/Loading";

  export default {
    name: "ListingDetails",
    components: {Loading},
    mounted(){
      this.loadListing(this.$route.params.id).then((res) => {
        if(!res.viewed.includes(this.user._id)){
          this.patchListing([this.res._id, {
            $push: {
              viewed: this.user._id
            }
          }])
        }
      }).catch(err => this.$q.notify({
        message: err.message,
        color: 'negative'
      }))
    },
    methods: {
      ...mapActions('listings', {
        loadListing: 'get'
      }),
      ...mapActions('listings', {
        patchListing: 'patch'
      })
    },
    computed: {
      ...mapGetters('listings', {
        getListing: 'get'
      }),
      ...mapGetters('auth', {
        user: 'user'
      }),
      listing(){
        return this.getListing(this.$route.params.id);
      }
    }
  }
</script>

<style scoped>

</style>

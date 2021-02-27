<template>
  <div class="listing-details">
    <Loading v-if="!listing"/>
    <div v-else class="listing">

      <div class="left">
        <ImageSlider :images="$lget(listing, 'images', [])"/>
        <div class="footer">
          <div class="left-footer">
            <div class="description q-mb-lg text-h6" style="width: 100%;">
              {{ listing.description ? listing.description : 'No description' }}
            </div>
            <q-chip class="q-mr-md" :key="tag" square v-for="tag of listing.tags">
              <q-avatar color="red" text-color="white" icon="sell"></q-avatar>
              <span class="q-pl-sm">{{ tag }}</span>
            </q-chip>
          </div>
        </div>
      </div>

      <div class="right">
<!--        title, condition, price, category, address, watchedBy, user._fastjoin.email, phone-->
        <div class="title text-h4">
          {{ listing.title }}
        </div>
        <div class="condition text-h6 q-mt-lg">
          Condition: <span :style="{color: getConditionColor(listing.condition)}">{{ listing.condition }}</span>
        </div>
        <div class="price text-h6 q-mt-lg">
          Price: ${{ listing.price }}
        </div>
        <div class="category text-h6 q-mt-lg">
          Category: {{ listing.category }}
        </div>
        <div class="text-h6 q-mt-lg">
          Watched by {{ listing.watchedBy.length }} {{ listing.watchedBy.length === 1 ? 'Person' : 'People' }}
        </div>
        <div class="text-primary text-h6 q-mt-lg">
          Address: <span>{{ $lget(listing.address, 'address.freeformAddress', 'No address') }}</span><q-icon name="location_on" class="q-ml-sm q-mb-xs"  size="sm" />
        </div>
        <div class="q-mt-lg">
          <div class="text-h5">Contact seller</div>
          <div class="q-my-sm" v-if="listing._fastjoin.listedBy.email">Email: {{ listing._fastjoin.listedBy.email }}</div>
          <div v-if="listing._fastjoin.listedBy.phone">Phone: {{ listing._fastjoin.listedBy.phone }}</div>
        </div>
        <div v-if="listing.listedBy !== user._id" class="text-h6 q-mt-lg">
          <q-btn @click="startChat" class label="Start chat with user" color="primary"/>
        </div>

      </div>
    </div>
  </div>
</template>

<script>

  import Loading from "components/common/Loading";
  import {mapActions, mapGetters} from "vuex";
  import { models } from 'feathers-vuex';
  import ImageSlider from "components/common/ImageSlider";

  export default {
    name: "ListingDetails",
    components: {ImageSlider, Loading},
    mounted() {
      this.loadListing(this.$route.params.id).then((res) => {
        this.slide = res.images[0].url;
        if (!res.viewed.includes(this.user._id)) {
          this.patchListing([this.listing._id, {
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
      }),
      startChat(){
        this.$q.loading.show();
        let newChat = new models.api.Chats({users: [{user: this.user._id, unreadMessages: []}, {user: this.listing._fastjoin.listedBy._id, unreadMessages: []}]});
        newChat.create().then((res) => {
          this.$q.loading.hide();
          this.$router.push({name: 'messages', params: { chatId: String(res._id) }});
        }).catch(err => {
          if(err.name === 'GeneralError') {
            this.$q.loading.hide();
            console.log(err.message);
            this.$router.push({name: 'messages', params: { chatId: String(err.message) }});
          }
        })
      },
      getConditionColor(condition) {
        if (condition === 'New') return 'green'
        else if (condition === 'Like New') return 'orange';
        else if (condition === 'Used') return '#e6bf25';
        else return 'red';
      },
    },
    computed: {
      ...mapGetters('listings', {
        getListing: 'get'
      }),
      ...mapGetters('auth', {
        user: 'user'
      }),
      listing() {
        return this.getListing(this.$route.params.id);
      }
    }
  }
</script>

<style scoped lang="scss">
  .listing {
    padding: 50px;
    display: flex;
    justify-content: space-between;

    .left {
      flex: 0.5;
      position: relative;
      height: 70vh;

      .footer {
        position: absolute;
        bottom: 20px;
        display: flex;
        justify-content: space-between;
        width: 100%;
      }
    }
    .right {
      flex: 0.42;

      .text-h6 {
        font-weight: 400 !important;
        font-size: 1.2em !important;
      }

      .title {
        padding-bottom: 5px;
        border-bottom: 2px solid black;
      }
    }
  }
</style>

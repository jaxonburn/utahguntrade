<template>
  <q-page class="listing-details" >
    <Loading v-if="!listing"/>
    <div v-else class="listing">

      <div class="left">

        <VueAgile class="agile-comp" :initial-slide="0" :dots="false" :fade="true" :nav-buttons="listing.images.length ? true : false">
<!--          <img class="slide" v-for="(image, idx) of listing.images" :src="image.url" :key="idx"/>-->

<!--          <div v-if="listing.images.length">-->
          <div class="agile-comp" v-if="listing.images.length === 0" :style="{backgroundImage: `url(${defaultImage})`, height: '45vh', backgroundSize: 'contain', backgroundRepeat: 'no-repeat'}"></div>

            <div class="slide-img" v-for="(image, idx) of listing.images" :key="idx" :style="{backgroundImage: `url(${image.url})`}"></div>
            <template slot="prevButton">
              <q-icon size="md" name="chevron_left"/>
            </template>
            <template slot="nextButton">
              <q-icon size="md" name="chevron_right"/>
            </template>
            <template slot="caption">
              <div class="text-center q-my-md text-h6">Swipe to view images</div>
            </template>
<!--          </div>-->
<!--          <div class="agile-comp" v-else :style="{backgroundImage: `url(${defaultImage})`, height: '45vh', backgroundSize: 'contain', backgroundRepeat: 'no-repeat'}">-->
<!---->
<!--          </div>-->
        </VueAgile>

        <div v-if="!$q.platform.is.mobile" class="footer q-pb-xl">
          <div class="q-mt-xl right-footer">
            <div class="text-h4">Contact seller</div>
            <div class="q-my-sm" v-if="listing._fastjoin.listedBy.email && listing.contactMethods.includes('Email')">
              Email: {{
                listing._fastjoin.listedBy.email
              }}
            </div>
            <div v-if="listing._fastjoin.listedBy.phone && listing.contactMethods.includes('Phone')">Phone: {{ listing._fastjoin.listedBy.phone }}</div>
          </div>
          <div class="left-footer">
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
          <div>{{ listing.title }}</div>
          <div>${{ listing.price }}</div>
        </div>

        <div v-if="$q.platform.is.mobile" class="footer">
          <div class="q-mt-lg right-footer">
            <div class="text-h4">Contact seller</div>
            <div class="q-my-sm" v-if="listing._fastjoin.listedBy.email && listing.contactMethods.includes('Email')">
              Email: {{
                listing._fastjoin.listedBy.email
              }}
            </div>
            <div v-if="listing._fastjoin.listedBy.phone && listing.contactMethods.includes('Phone')">Phone: {{ listing._fastjoin.listedBy.phone }}</div>
          </div>
          <div class="left-footer">
            <q-chip class="q-mr-md" :key="tag" square v-for="tag of listing.tags">
              <q-avatar color="red" text-color="white" icon="sell"></q-avatar>
              <span class="q-pl-sm">{{ tag }}</span>
            </q-chip>
          </div>
        </div>
        <div class="condition text-h6 q-mt-lg">
          Condition: <span :style="{color: getConditionColor(listing.condition)}">{{ listing.condition }}</span>
        </div>
        <div class="category text-h6 q-mt-lg">
          Category: {{ listing.category }}
        </div>
        <div class="text-h6 q-mt-lg">
          Watched by {{ listing.watchedBy.length }} {{ listing.watchedBy.length === 1 ? 'Person' : 'People' }}
        </div>
        <div class="text-primary text-h6 q-mt-lg">
          Address: <span>{{ $lget(listing.address, 'address.freeformAddress', 'No address') }}</span>
          <q-icon name="location_on" class="q-ml-sm q-mb-xs" size="sm"/>
        </div>
        <div class="q-my-lg text-h6" v-if="listing.openToTrades">
          <q-icon name="check" class="q-mr-sm" size="sm" color="green" /> Open to trades
        </div>
<!--        <div class="q-my-lg text-h6">-->
<!--          Methods of contact: <span class="q-mr-sm text-secondary" v-for="(method, idx) of listing.contactMethods" :key="idx">{{ method }}</span>-->
<!--        </div>-->
        <div class="description q-my-lg text-h6" style="width: 100%;">
          Description: {{ listing.description ? listing.description : 'No description' }}
        </div>
        <div v-if="listing.listedBy !== $lget(user, '_id')" class="text-h6 q-mt-lg">
          <q-btn @click="startChat" class label="Start chat with user" color="primary"/>
        </div>

      </div>
    </div>
  </q-page>
</template>

<script>

  import Loading from "components/common/Loading";
  import {mapActions, mapGetters} from "vuex";
  import {models} from 'feathers-vuex';
  import {VueAgile} from "vue-agile";
  import NoImage from 'assets/no_image.png'

  export default {
    name: "ListingDetails",
    components: {Loading, VueAgile},
    data(){
      return {
        defaultImage: NoImage
      }
    },
    mounted() {
      this.loadListing(this.$route.params.id).then((res) => {
        this.slide = res.images[0] ? res.images[0].url : NoImage;
        if (!res.viewed.includes(this.$lget(this.user, '_id'))) {
          this.patchListing([this.listing._id, {
            $push: {
              viewed: this.$lget(this.user, '_id')
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
      startChat() {
        this.$q.loading.show();
        let newChat = new models.api.Chats({
          users: [{
            user: this.user._id,
            unreadMessages: []
          }, {user: this.listing._fastjoin.listedBy._id, unreadMessages: []}]
        });
        newChat.create().then((res) => {
          this.$q.loading.hide();
          this.$router.push({name: 'messages', params: {chatId: String(res._id), created: 'true'}});
        }).catch(err => {
          if (err.name === 'GeneralError') {
            this.$q.loading.hide();
            this.$router.push({name: 'messages', params: {chatId: String(err.message), created: 'false'}});
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
    width: 80vw;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;

    .left {
      //flex: 0.55;
      width: 40vw;
      position: relative;
      height: 70vh;
      left: 0;

      .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        margin-top: -20px;

        .right-footer {
          flex: .3;
        }

        .left-footer {
          flex: .7;
          margin-top: 25px;
        }
      }

    }

    .right {
      flex: 0.65;

      .text-h6 {
        font-weight: 400 !important;
        font-size: 1.2em !important;
      }

      .title {
        padding-bottom: 5px;
        border-bottom: 2px solid black;
        display: flex;
        align-items: center;
        justify-content: space-between;

        div:last-child {
          font-weight: 300;
          color: #089808;
        }
      }
    }
  }

  .slide-img {
    height: 50vh;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  .agile-comp {
    width: 50vw;
  }

  .agile {
    &__nav-button {
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 24px;
      height: 100%;
      position: absolute;
      top: 0;
      transition-duration: 0.3s;
      width: 80px;

      &:hover {
        background-color: rgba(black, 0.5);
        opacity: 1;
      }

      &--prev {
        left: 0;
      }

      &--next {
        right: 0;
      }
    }

    &__dots {
      bottom: 10px;
      left: 50%;
      position: absolute;
      transform: translateX(-50%);
    }

    &__dot {
      margin: 0 10px;

      button {
        background-color: transparent;
        border: 1px solid white;
        border-radius: 50%;
        cursor: pointer;
        display: block;
        height: 10px;
        font-size: 0;
        line-height: 0;
        margin: 0;
        padding: 0;
        transition-duration: 0.3s;
        width: 10px;
      }

      &--current,
      &:hover {
        button {
          background-color: white;
        }
      }
    }
  }

  // Slides styles
  .slide {
    display: block;
    height: 500px;
    object-fit: cover;
    width: 100%;
    border-color: black;
    border-width: 2px;

    border-top-style: solid;
    border-bottom-style: solid;
    -webkit-box-shadow: 0px 14px 29px 0px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px 14px 29px 0px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 14px 29px 0px rgba(0, 0, 0, 0.75);
  }

  @media screen and (max-width: 1050px) {
    .listing {
      flex-direction: column;
      padding: 0;
    }

    .title {
      flex-direction: column;

      div:first-child {
        margin-bottom: 15px;
      }
    }

    .agile-comp {
      width: 80vw;
    }

    .right {
      margin-top: 40px;
    }

    .footer .right-footer {
      text-align: center;
      margin-bottom: 30px;
    }
  }

  @media screen and (max-width: 550px) {
    .agile-comp {
      width: 80vw;
      margin-right: 15px;
    }
  }
</style>

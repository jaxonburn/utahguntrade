<template>
  <q-page class="listing-details" v-if="listing">
    <div class="left">
      <VueAgile v-if="listing.images.length" class="agile-comp" :initial-slide="0" :dots="false" :fade="true" :nav-buttons="listing.images.length ? true : false">
        <div class="agile-comp" v-if="listing.images.length === 0" :style="{backgroundImage: `url(${defaultImage})`, height: '45vh', backgroundSize: 'contain', backgroundRepeat: 'no-repeat'}"></div>
        <img class="slide-img" v-for="(image, idx) of listing.images" :key="idx" :src="image.url" />
        <template slot="prevButton">
          <q-icon size="md" name="chevron_left " />
        </template>
        <template slot="nextButton">
          <q-icon size="md" name="chevron_right"/>
        </template>
        <template slot="caption">
          <div class="text-center q-my-md text-h6">Swipe to view images</div>
        </template>
      </VueAgile>
      <div v-else class="agile-comp">
        No Listing Images
      </div>
    </div>
    <div class="right">
      <div class="top">
        <div>{{ listing.title }}</div>
        <div class="price">${{ listing.price }}</div>
        <div style="margin-top: 5px; color: #a4a1a1;">Posted {{ Math.floor((new Date().getTime() - new Date(listing.createdAt).getTime())  / (1000 * 3600 * 24)) === 0 ? 'Today' : Math.floor((new Date().getTime() - new Date(listing.createdAt).getTime())  / (1000 * 3600 * 24)) + ' Days ago' }}</div>
        <div class="buttons">
          <div @click="startChat" class="action-btn" v-if="user && user._id !== listing.listedBy">Message user</div>
          <div class="action-btn" @click="addToWatchList" v-if="user && !user.watched.includes(listing._id)">
            <q-icon name="visibility" />
            <q-tooltip>Add to watch list</q-tooltip>
          </div>

          <div class="action-btn" @click="removeFromWatchList" v-if="user && user.watched.includes(listing._id)">
            <q-icon name="remove_done" />
            <q-tooltip>Remove from watch list</q-tooltip>
          </div>
          <div v-if="user" class="action-btn" @click="reportDio = true">
            <q-icon name="more_horiz" />

          </div>
        </div>
      </div>

      <div class="middle">
        <div>About This Listing</div>
        <div class="details">
          <div><q-icon class="q-mr-sm" size="sm" name="inventory_2" /> Category: {{ listing.category }}</div>
          <div><q-icon class="q-mr-sm" size="sm" name="info" /> Condition: {{ listing.condition }}</div>
          <div v-if="listing.openToTrades"><q-icon class="q-mr-sm" size="sm" name="thumb_up" /> Open To Trades</div>
        </div>
        <div v-if="user" class="address">Available In <span>{{ $lget(listing, 'address.address.freeformAddress', 'No Address') }}</span></div>
        <div v-else class="address">Must be logged in to view address</div>
        <span class="description">{{ listing.description || 'No Description' }}</span>
        <div class="watched-by">
          Watched By {{ listing.watchedBy.length }} {{ listing.watchedBy.length === 1 ? 'Person' : 'People' }}
          <q-icon class="q-ml-xs" name="visibility" />
        </div>
      </div>

      <div class="bottom">
        <div v-if="user" style="font-size: 1.5em; font-weight: 500; margin-bottom: 10px;">Location</div>
        <img v-if="user" class="location" src="data:image/jpeg;base64,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" />
        <div v-if="user" style="font-size: 1.5em; font-weight: 500; margin-top: 10px;">Seller Information</div>
        <span class="seller-details" v-if="user">
          <span>
            <q-avatar class="avatar">
              <div class="img" :style="{backgroundImage: `url(${$lget(listing, '_fastjoin.listedBy.avatar')})`}" />
            </q-avatar>
          </span>
          <span class="right-avatar" v-if="user">
            <div>{{ $lget(listing, '_fastjoin.listedBy.username') }}</div>
            <div style="font-size: .8em; color: #c1bfbf;">{{ $lget(listing, '_fastjoin.listedBy.email') }}</div>
          </span>
          <span class="right-avatar" v-else>
            <div>Must Be Logged In</div>
<!--            <div style="font-size: .8em; color: #c1bfbf;">{{ $lget(listing, '_fastjoin.listedBy.email') }}</div>-->
          </span>
        </span>
        <span v-else>
          Must be logged in to view seller details
        </span>
      </div>
    </div>

    <q-dialog v-model="reportDio">
      <q-card>
        <q-card-section>
          <div class="text-h6">Report Listing</div>
        </q-card-section>
        <q-card-section>
          Would you like to report this listing? We appreciate community feedback and it helps keep our site clean and secure.
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup color="red"/>
          <q-btn @click="reportListing" label="Report Listing" v-close-popup color="red" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
  import NoImage from 'assets/no_image.png';
  import {mapActions, mapGetters} from 'vuex';
  import {models} from 'feathers-vuex';
  import {VueAgile} from "vue-agile";

  export default {
    name: 'ListingDetails2',
    components: {
      VueAgile
    },
    data() {
      return {
        reportDio: false
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
      ...mapActions('users', {
        patchUser: 'patch'
      }),
      ...mapActions('reports', {
        createReport: 'create'
      }),
      reportListing() {
        this.createReport({
          service: 'listings',
          dataId: this.listing._id
        }).then(() => {
          this.$q.notify({
            message: 'We appreciate the feedback, we will look into this soon.',
            color: 'positive'
          })
        }).catch((er) => {
          this.$q.notify({
            message: er.message,
            color: 'negative'
          })
        })
      },
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
      addToWatchList(){
        if(this.user.watched.includes(this.listing._id)) return;
        else {
          this.patchUser([this.user._id, {
            $push: {
              watched: this.listing._id
            },
            params: {
              name: 'watchedAdd',
              id: this.listing._id
            }
          }])
        }
      },
      removeFromWatchList(){
        if(!this.user.watched.includes(this.listing._id)) return;
        else {
          this.patchUser([this.user._id, {
            $pull: {
              watched: this.listing._id
            },
            params: {
              name: 'watchedRemove',
              id: this.listing._id
            }
          }])
        }
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
  };
</script>

<style scoped lang="scss">
  .listing-details {
    display: flex;

    .left {
      width: 75vw;
    }

    .right {
      width: 25vw;
      background-color: #404040;
      color: white;
      border-left: 1px solid white;

      .top {
        padding: 20px 35px;
        div:first-child:not(.action-btn) {
          font-size: 2.2em;
          font-weight: 500;
        }

        .buttons {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin-top: 15px;

          .action-btn {
            background-color: #6d6c6c;
            cursor: pointer;
            font-size: 1.2em;
            padding: 5px 15px;
            border-radius: 10px;
            margin-right: 10px;
          }
        }

        .price {
          font-size: 1.1em;
        }
      }

      .middle {
        padding: 20px 35px;

        > div:first-child {
          font-size: 1.3em;
          font-weight: 500;
        }

        .details {
          div {
            margin: 20px 0;
            font-size: 1.1em;
          }
          div:last-child {
            border-bottom: 1px solid white;
            padding-bottom: 20px;
            border-radius: 1px;
          }
        }

        .description, .address {
          margin: 20px 0;
          font-size: 1.3em;
        }

        .address {
          font-weight: 300;

          span {
            font-weight: 500;
          }
        }

        .watched-by {
          margin: 20px 0;
        }
      }
    }
  }

  .bottom {
    width: 90%;
    padding: 20px 0;
    margin: 0 auto;
    border-top: 1px solid white;
    border-bottom: 1px solid white;

    .location {
      width: 100%;
      border-radius: 30px;
      height: 15vh;
    }

    .seller-details {
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .avatar {
        width: 5vw;
        height: 5vw;
        flex: .2;
        margin-top: 10px;
      }

      .img {
        height: 5vw;
        width: 5vw;
      }

      .right-avatar {
        font-size: 1.4em;
        margin-left: 20px;
      }
    }
  }

  .agile-comp {
    width: 70vw;
    margin: 0 auto;
    margin-top: 20px;
    background: #f6f6f6;
    box-shadow: 2px 2px 20px 1px rgba(0, 0, 0, 0.3);
    padding: 20px;
    border-radius: 20px;
  }

  .slide-img {
    height: 65vh;
    background-size: contain;
    background-repeat: no-repeat;
    object-fit: contain;
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

  @media only screen and (max-width: 1300px) {
    .location {
      height: 20vh !important;
    }
    .agile-comp {
      width: 60vw;
    }
    .listing-details {
      .left {
        width: 60vw;
      }
      .right {
        width: 40vw;
      }
    }
  }

  @media only screen and (max-width: 800px) {
    .listing-details {
      .avatar, .img {
        width: 10vw !important;
        height: 10vw !important;
      }
      flex-direction: column;

      .left {
        width: 100vw;
      }
      .right {
        width: 100vw;
      }
      .agile-comp {
        height: 60vh;
      }
      .slide-img {
        height: 40vh;
      }
    }
  }
</style>

<template>
  <q-card class="listing">
    <div class="hover-btn" v-if="!$q.platform.is.mobile">
      <q-btn color="secondary" @click="$router.push(`listing-details/${listing._id}`)" label="View Details" />
    </div>
    <div class="top">
      <img
        :src="$lget(listing.images[0], 'url', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/No_image_3x4.svg/1200px-No_image_3x4.svg.png')">
    </div>
    <div class="bottom">
      <!--      category description listedBy-->
      <div class="title">{{ listing.title }}</div>

      <div style="position: absolute; top: 3px; left: 15px;">
        <span class="text-primary">{{ $lget(listing.address, 'address.freeformAddress', 'No address') }} </span>
        <q-icon name="location_on" style="font-size: 1.4em; margin-bottom: 2px;" color="primary"/>
      </div>

      <q-icon @click="removeFromWatchList" v-if="user.watched.includes(listing._id) && !isMyListing" class="eye" name="remove_done" size="xs">
        <q-tooltip size="md">Remove from watch list</q-tooltip>
      </q-icon>

      <q-icon @click="addToWatchList" v-else-if="!isMyListing" class="eye" name="visibility" size="xs">
        <q-tooltip>Add to watch list</q-tooltip>
      </q-icon>

      <q-icon @click="editListing" v-if="isMyListing" class="eye" name="create" size="xs">
        <q-tooltip>Edit</q-tooltip>
      </q-icon>

      <q-icon @click="archiveListing" v-if="isMyListing && listing.archived === false" class="eye eye-archive" name="archive" size="xs">
        <q-tooltip>Archive Listing</q-tooltip>
      </q-icon>

      <div class="eye eye-views" v-if="isMyListing">
        <span class="q-mr-sm" style="font-size: .8em;">{{listing.viewed.length}}</span>
        <q-icon name="visibility" size="sm">
          <q-tooltip>{{ listing.viewed.length }} {{ listing.viewed.length === 1 ? 'view' : 'views' }}</q-tooltip>
        </q-icon>
      </div>

      <q-icon @click="unarchiveListing" v-if="isMyListing && listing.archived" class="eye eye-archive" name="unarchive" size="xs">
        <q-tooltip>Un-archive Listing</q-tooltip>
      </q-icon>

      <div class="price">Listed price: ${{ listing.price }}</div>
      <div class="condition">Condition: <span :style="{color: getConditionColor(listing.condition), fontWeight: '600'}">{{
          listing.condition
        }}</span></div>
    </div>

    <div v-if="$q.platform.is.mobile" style="text-align: center; padding: 20px 0;">
      <q-btn color="secondary" @click="$router.push(`listing-details/${listing._id}`)" label="View Details" />
    </div>

    <q-dialog v-model="editListingDialog" full-width>
      <EditListing :listing="listing"/>
    </q-dialog>

  </q-card>
</template>

<script>

  // import noImage from '../../assets/no_image.png';
  import {mapGetters, mapActions} from 'vuex';
  import EditListing from "components/Forms/EditListing";

  export default {
    name: "Listing",
    components: {EditListing},
    data(){
      return {
        editListingDialog: false
      }
    },
    props: {
      listing: {
        type: Object,
        required: true,
        slider: null
      },
      isMyListing: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      ...mapActions('users', {
        patchUser: 'patch'
      }),
      ...mapActions('listings', {
        patchListing: 'patch'
      }),
      getConditionColor(condition) {
        if (condition === 'New') return 'green'
        else if (condition === 'Like New') return 'orange';
        else if (condition === 'Used') return '#e6bf25';
        else return 'red';
      },
      archiveListing(){
        this.patchListing([this.listing._id, {
          archived: true
        }]).then(res => this.$q.notify({
          color: 'positive',
          message: `${res.title} successfully archived, change view to see archived listings`
        }));
      },
      unarchiveListing(){
        this.patchListing([this.listing._id, {
          archived: false
        }]).then(res => this.$q.notify({
          color: 'positive',
          message: `${res.title} successfully un-archived, change view to see posted listings`
        }));
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
      editListing(){
        if(this.listing.listedBy !== this.user._id) return;
        else {
          this.editListingDialog = true;
        }
      }
    },
    computed: {
      ...mapGetters('auth', {
        user: 'user'
      })
    }
  }
</script>

<style scoped lang="scss">
  .listing {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
    transition: 0.2s all;
    position: relative;

    .hover-btn {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      text-align: center;
      padding: 8px 0;
      opacity: 0;
      transition: 0.3s all;
    }

    .top {
      img {
        width: 100%;
        margin-right: 20px;
        //height: 50%;
      }

    }

    .bottom {
      padding: 15px;
      position: relative;

      .title {
        font-size: 1.8em;
        margin-bottom: 9px;
        margin-top: 14px;
      }

      .condition {
        font-size: 1em;
        position: absolute;
        bottom: 15px;
        right: 15px;
      }

      .eye {
        position: absolute;
        right: 15px;
        top: 25px;
        cursor: pointer;
        font-size: 1.7em !important;
      }

      .eye-archive {
        right: 48px;
      }
      .eye-views {
        right: 85px;
        top: 19px;
      }
    }
  }
  .listing:hover {
    transform: scale(1.05);
  }
  .listing:hover  .hover-btn {
    opacity: 1;
  }
</style>

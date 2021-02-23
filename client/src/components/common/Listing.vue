<template>
  <q-card class="listing">
    <div class="hover-btn">
      <q-btn color="secondary" label="View Details" />
    </div>
    <div class="top">
      <img
        :src="$lget(listing.images[0], 'url', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/No_image_3x4.svg/1200px-No_image_3x4.svg.png')">
    </div>
    <div class="bottom">
      <!--      category description listedBy-->
      <div class="title">{{ listing.title }}</div>

      <div style="position: absolute; top: 3px; left: 15px;">
        <span class="text-primary">{{ listing.city }} </span>
        <q-icon name="location_on" style="font-size: 1.4em; margin-bottom: 2px;" color="primary"/>
      </div>

      <q-icon @click="removeFromWatchList" v-if="user.watch.includes(listing._id) && !isMyListing" class="eye" name="remove_done" size="xs">
        <q-tooltip size="md">Remove from watch list</q-tooltip>
      </q-icon>

      <q-icon @click="addToWatchList" v-else-if="!isMyListing" class="eye" name="visibility" size="xs">
        <q-tooltip>Add to watch list</q-tooltip>
      </q-icon>

      <q-icon @click="editListing" v-if="isMyListing" class="eye" name="create" size="xs">
        <q-tooltip>Edit</q-tooltip>
      </q-icon>

      <div class="price">Listed price: ${{ listing.price }}</div>
      <div class="condition">Condition: <span :style="{color: getConditionColor(listing.condition), fontWeight: '600'}">{{
          listing.condition
        }}</span></div>
    </div>

    <q-dialog v-model="editListingDialog" full-width>
      <EditListing />
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
      getConditionColor(condition) {
        if (condition === 'New') return 'green'
        else if (condition === 'Like New') return 'orange';
        else if (condition === 'Used') return '#e6bf25';
        else return 'red';
      },
      addToWatchList(){
        if(this.user.watch.includes(this.listing._id)) return;
        else {
          this.patchUser([this.user._id, {
            $push: {
              watch: this.listing._id
            }
          }])
        }
      },
      removeFromWatchList(){
        if(!this.user.watch.includes(this.listing._id)) return;
        else {
          this.patchUser([this.user._id, {
            $pull: {
              watch: this.listing._id
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
      }

      .price {
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

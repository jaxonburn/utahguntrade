<template>
  <q-card class="listing">
    <div class="hover-btn" v-if="!$q.platform.is.mobile">
      <q-btn color="secondary" @click="$router.push(`listing-details/${listing._id}`)" label="View Details" />
      <div v-if="isMyListing && !listing.sold">
        <q-btn @click="markAsSolidDialog = true" size="sm" class="q-ml-sm sold-icon" icon="attach_money" color="green" rounded>
          <q-tooltip>Mark as sold</q-tooltip>
        </q-btn>
        <q-btn @click="deleteListingDialog = true" size="sm" class="q-mr-sm delete-icon" icon="close" color="negative" rounded>
          <q-tooltip>Permanently Delete</q-tooltip>
        </q-btn>
      </div>
    </div>
    <div class="top">
      <img
        :src="$lget(listing.images[0], 'url', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/No_image_3x4.svg/1200px-No_image_3x4.svg.png')">
    </div>
    <div class="bottom">
      <!--      category description listedBy-->
      <div class="title">{{ listing.title.slice(0, 33) }} {{ listing.title.length > 33 ? '...' : '' }}
        <q-tooltip v-if="listing.title.length > 33">{{ listing.title }}</q-tooltip>
      </div>

      <div style="position: absolute; top: 3px; left: 15px; font-size: .95em;">
        <span class="text-primary">{{ $lget(listing, 'address.address.freeformAddress', 'No address').slice(0, 15) }} {{ $lget(listing, 'address.address.freeformAddress', '').length > 15 ? '...' : '' }} <q-tooltip v-if="$lget(listing, 'address.address.freeformAddress', '').length > 15">{{ $lget(listing, 'address.address.freeformAddress', 'No address') }}</q-tooltip></span>
        <q-icon name="location_on" style="font-size: 1.4em; margin-bottom: 2px;" color="primary"/>
      </div>

      <q-icon @click="removeFromWatchList" v-if="user.watched.includes(listing._id) && !isMyListing" class="eye" name="remove_done" size="xs">
        <q-tooltip size="md">Remove from watch list</q-tooltip>
      </q-icon>

      <q-icon @click="addToWatchList" v-else-if="!isMyListing" class="eye" name="visibility" size="xs">
        <q-tooltip>Add to watch list</q-tooltip>
      </q-icon>

      <q-icon @click="editListing" v-if="isMyListing && !listing.sold" class="eye" name="create" size="xs">
        <q-tooltip>Edit</q-tooltip>
      </q-icon>

      <q-icon @click="archiveListing" v-if="(isMyListing && listing.archived === false) && !listing.sold" class="eye eye-archive" name="archive" size="xs">
        <q-tooltip>Archive Listing</q-tooltip>
      </q-icon>

      <q-icon @click="attachDocument" v-if="isMyListing && listing.sold && !listing.document" name="description" class="eye eye-doc">
        <q-tooltip>Attach a document</q-tooltip>
      </q-icon>

      <q-icon @click="viewDocument" v-if="isMyListing && listing.sold && listing.document" name="find_in_page" class="eye" size="xs">
        <q-tooltip>View document</q-tooltip>
      </q-icon>

      <q-icon @click="unarchiveListing" v-if="isMyListing && listing.archived && !listing.sold" class="eye eye-archive" name="unarchive" size="xs">
        <q-tooltip>Un-archive Listing</q-tooltip>
      </q-icon>

      <div class="eye eye-views" v-if="isMyListing">
        <span class="q-mr-xs" style="font-size: .8em;">{{listing.viewed.length}}</span>
        <q-icon name="visibility" size="xs">
        </q-icon>
        <q-tooltip>{{ listing.viewed.length }} {{ listing.viewed.length === 1 ? 'view' : 'views' }}</q-tooltip>
      </div>

      <div class="footer">
        <div class="price">Listed price: ${{ listing.price }}</div>
        <div class="condition">Condition: <span :style="{color: getConditionColor(listing.condition), fontWeight: '600'}">{{
            listing.condition
          }}</span></div>
      </div>
    </div>

    <div v-if="$q.platform.is.mobile" style="text-align: center; padding: 20px 0;">
      <q-btn color="secondary" @click="$router.push(`listing-details/${listing._id}`)" label="View Details" />
    </div>

    <q-dialog v-model="editListingDialog" full-width>
      <EditListing :listing="listing"/>
    </q-dialog>

    <q-dialog v-model="documentDialog" full-width full-height>
      <CreateDocument :listing="listing" />
    </q-dialog>

    <q-dialog v-model="viewDocumentDialog">
      <ViewDocument :id="listing.document"/>
    </q-dialog>

    <q-dialog v-model="markAsSolidDialog">
      <q-card style="min-width: 350px; max-width: 70vw;">
        <q-card-section>
          <span class="text-h5">Are you sure you wish to mark <span class="text-red">{{ listing.title }}</span> as sold?</span>
          <div class="text-h6 q-mb-lg q-mt-sm">You will not be able to undo this action</div>
          <div>Type <span class="text-red">{{ listing.title }}</span> to confirm</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="confirmAction" autofocus />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" color="secondary" v-close-popup />
          <q-btn @click="confirmSold" flat label="Confirm" :disable="confirmAction !== listing.title" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="deleteListingDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <span class="text-h5">Are you sure you wish delete <span class="text-red">{{ listing.title }}?</span></span>
          <div class="text-h6 q-mb-lg">You will not be able to undo this action</div>
          <div>Type <span class="text-red">{{ listing.title }}</span> to confirm</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="confirmAction" autofocus />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" color="secondary" v-close-popup />
          <q-btn @click="confirmDelete" flat label="Delete" :disable="confirmAction !== listing.title" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-card>
</template>

<script>

  // import noImage from '../../assets/no_image.png';
  import {mapGetters, mapActions} from 'vuex';
  import EditListing from "components/Forms/EditListing";
  import CreateDocument from "components/Forms/DocumentForms/CreateDocument";
  import ViewDocument from "components/common/ViewDocument";

  export default {
    name: "Listing",
    components: {ViewDocument, CreateDocument, EditListing},
    data(){
      return {
        editListingDialog: false,
        deleteListingDialog: false,
        markAsSolidDialog: false,
        documentDialog: false,
        viewDocumentDialog: false,
        confirmAction: ''
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
        patchListing: 'patch',
        deleteListing: 'remove'
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
      viewDocument(){
        if(this.user._id !== this.listing.listedBy) return;
        this.viewDocumentDialog = true;
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
      },
      attachDocument(){
        this.documentDialog = true;
      },
      confirmSold(){
        if(this.listing.listedBy !== this.user._id) return;
        this.confirmAction = '';
        this.patchListing([this.listing._id, {
          sold: true
        }]).then(() => {
          this.$q.notify({
            message: 'Listing added to sold',
            color: 'positive'
          })
        }).catch(err => {
          this.$q.notify({
            message: err.message,
            color: 'negative'
          })
        })
      },
      confirmDelete(){
        if(this.listing.listedBy !== this.user._id) return;
        this.confirmAction = '';
        this.deleteListing([this.listing._id]).then(() => {
          this.$q.notify({
            message: 'Listing deleted successfully',
            color: 'positive'
          })
        }).catch(err => {
          this.$q.notify({
            message: err.message,
            color: 'negative'
          })
        })
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
      background-color: rgba(0, 0, 0, 0.5);
      text-align: center;
      padding: 8px 0;
      opacity: 0;
      transition: 0.3s all;

      .sold-icon, .delete-icon {
        position: absolute;
        top: 13px;
        right: 10px;
      }

      .delete-icon {
        left: 10px;
      }
    }

    .top {
      img {
        width: 100%;
        margin-right: 20px;
        max-height: 300px;
      }

    }

    .bottom {
      padding: 15px;
      position: relative;

      .title {
        font-size: 1.5em;
        margin-bottom: 9px;
        margin-top: 14px;
      }

      //.condition {
      //  font-size: 1em;
      //  position: absolute;
      //  bottom: 15px;
      //  right: 15px;
      //}

      .footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        text-align: center;

        .condition, .price {
          text-align: center;
        }
      }

      .eye {
        position: absolute;
        right: 15px;
        top: 5px;
        cursor: pointer;
        font-size: 1.3em !important;
      }

      .eye-doc{
        top: 6px;
      }

      .eye-archive {
        right: 40px;
      }
      .eye-views {
        right: 68px;
        //font-size: 1em !important;
        top: -1px;
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

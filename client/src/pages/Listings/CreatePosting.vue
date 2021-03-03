<template>
  <q-page>
    <div class="create-listing-wrapper" v-if="!isEditing">
      <!--    <div class="image-uploader">-->
      <!--      <q-icon name="perm_media" class="icon"/>-->
      <!--      <div class="footer">-->

      <!--      </div>-->
      <!--    </div>-->
      <multi-image-upload
        @upload-success="uploadImageSuccess"
        @before-remove="beforeRemove"
        :data-images="images"
        drop-text="Upload images"
        drag-text="Upload listing images"
        browse-text=""
        primary-text="Weapon images"
        popup-text="We accept most common image formats, including: gif, jpg, png, bmp, jpeg"
      >
      </multi-image-upload>
      <div class="form">
        <div class="row justify-between q-my-lg">
          <q-input v-model="listingForm.title" class="col-4" style="width: 30%" label="Title"/>
          <q-input v-model="listingForm.price" class="col-3" type="number" label="Price"/>
          <q-select v-model="listingForm.condition" class="col-4" :options="['New', 'Like New', 'Used', 'Worn']"
                    label="Condition"/>
        </div>
        <div class="row justify-between q-my-lg">
          <LocationForm @input="setAddress"/>
          <q-select v-model="listingForm.category" class="col-3" :options="categories" label="Category"/>
        </div>
        <q-select
          label="Tags"
          filled
          v-model="listingForm.tags"
          use-input
          use-chips
          multiple
          hide-dropdown-icon
          input-debounce="0"
          new-value-mode="add-unique"
        />
        <q-input v-model="listingForm.description" class="q-my-lg" type="textarea" label="Description"/>
        <q-space></q-space>
        <div style="text-align: right;" v-if="!isEditing">
          <q-btn color="secondary" class="q-my-lg" label="Post listing" @click="savePosting"/>
        </div>
      </div>
    </div>


    <div class="create-listing-wrapper" v-else>
      <div style="width: 45%">
        <multi-image-upload
          @upload-success="uploadImageSuccess"
          @before-remove="beforeRemove"
          :data-images="images"
          drop-text="Upload images"
          drag-text="Upload listing images"
          browse-text=""
          primary-text="Weapon images"
          popup-text="We accept most common image formats, including: gif, jpg, png, bmp, jpeg"
        >
        </multi-image-upload>
        <div class="images-wrapper">
          <div class="image q-mt-lg" :key="idx" v-for="(image, idx) of listing.images">
            <img :src="image.url" width="70"/>
            <q-icon color="primary" class="icon cursor-pointer" @click="deleteImage(idx)" name="delete" size="sm">
              <q-tooltip>Delete image</q-tooltip>
            </q-icon>
          </div>
        </div>
      </div>
      <div class="form">
        <div class="row justify-between q-my-lg">
          <q-input v-model="listingForm.title" class="col-4" style="width: 30%" label="Title"/>
          <q-input v-model="listingForm.price" class="col-3" type="number" label="Price"/>
          <q-select v-model="listingForm.condition" class="col-4" :options="['New', 'Like New', 'Used', 'Worn']"
                    label="Condition"/>
        </div>
        <div class="row justify-between q-my-lg">
          <LocationForm @input="setAddress" :address="listing.address"/>
          <!--          <LocationForm v-else @input="setAddress"/>-->
          <q-select v-model="listingForm.category" class="col-3" :options="categories" label="Category"/>
        </div>
        <q-select
          label="Tags"
          filled
          v-model="listingForm.tags"
          use-input
          use-chips
          multiple
          hide-dropdown-icon
          input-debounce="0"
          new-value-mode="add-unique"
        />
        <q-input v-model="listingForm.description" class="q-my-lg" type="textarea" label="Description"/>
        <q-space></q-space>
        <div style="text-align: right;" v-if="!isEditing">
          <q-btn color="secondary" class="q-my-lg" label="Post listing" @click="savePosting"/>
        </div>
        <div v-else style="text-align: right">
          <q-btn v-close-popup color="primary" class="q-my-lg" label="Cancel"/>
          <q-btn @click="editPosting" v-close-popup color="secondary" class="q-my-lg q-ml-lg" label="Save Changes"/>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
  import MultiImageUpload from 'components/common/MultiImageUpload';
  import AWS from 'aws-sdk';
  import {mapActions, mapState} from 'vuex';
  import LocationForm from "components/Forms/LocationForm/LocationForm";

  AWS.config.update({
    accessKeyId: 'AKIAJA7CT4DCZHE5MNUQ',
    secretAccessKey: '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',
    region: 'us-west-1',
  });

  export default {
    name: "CreatePosting",
    components: {
      LocationForm,
      MultiImageUpload
    },
    data() {
      return {
        categories: ['Knives', 'Rifle', 'AssaultRifle', 'Handgun', 'SubmachineGun', 'Hunting', 'Magazines', 'Scopes', 'Other', 'AssaultAmmo', 'HandgunAmmo.', 'RifleAmmo', 'ShotgunAmmo', 'SubmachineAmmo', 'Misc' ],
        images: [],
        formData: {},
        listingForm: {
          title: '',
          price: null,
          condition: '',
          address: {},
          category: 'Other',
          tags: [],
          description: '',
          images: [],
          sold: false,
          archived: false,
          point: {}
        }
      }
    },
    mounted() {
      if (this.listing) {
        this.listingForm = this.listing;
        this.setAddress(this.listing.address);
      }
    },
    props: {
      isEditing: {
        type: Boolean,
        default: false
      },
      listing: {
        type: Object,
        required: false
      }
    },
    computed: {
      ...mapState('auth', {
        user: 'user'
      })
    },
    methods: {
      ...mapActions('listings', {
        createListing: 'create'
      }),
      ...mapActions('listings', {
        patchListing: 'patch'
      }),
      editPosting() {
        this.savePosting();
      },
      publishEdited() {
        if (!this.listing) return;
        this.patchListing([this.listing._id, {
          ...this.listingForm,
        }])
          .then(() => {
            this.$q.notify({
              message: 'Successfully updated'
            });
            this.$q.loading.hide();
          })
          .catch(err => {
              this.$q.notify({
                color: 'negative',
                message: err.message
              });
              this.$q.loading.show();
            }
          );
      },
      deleteImage(idx) {
        this.listingForm.images.splice(idx, 1);
      },
      setAddress(location) {
        this.listingForm.address = location;
      },
      async savePosting() {
        this.$q.loading.show();
        if (this.images.length === 0 && !this.isEditing) {
          this.publish();
          return;
        }
        if (this.images.length === 0 && this.isEditing) {
          this.publishEdited();
          return;
        }
        let s3 = new AWS.S3();
        let today = new Date();
        let options = {
          partSize: 10 * 1024 * 1024,
          queueSize: 1
        };
        await this.images.forEach((image) => {
          let uniqueName = {
            path: `profile/${today.getFullYear().toString()}${today.getMonth().toString().padStart(2, "0")}/`,
            file: `guntrade_${image.name.replace(/[^a-zA-Z0-9.]/g, "")}`
          };
          let params = {
            Bucket: 'guntrade',
            Key: uniqueName.path + uniqueName.file + Date.now(),
            Body: image.file,
            ContentEncoding: 'base64',
            ContentType: image.type,
            ACL: 'public-read'
          };
          s3.upload(params, options, function (err, data) {
            if (err) {
              this.$q.notify({message: 'Something went wrong when uploading images', color: 'negative'})
            } else {
              this.insertImg(data);
            }
          }.bind(this));

        })
      },
      insertImg(data) {
        this.listingForm.images.push({
          key: data.Key,
          url: data.Location
        });
        if ((this.listingForm.images.length === this.images.length) && !this.isEditing) {
          this.publish();
        } else {
          this.publishEdited();
        }
      },
      publish() {
        this.listingForm.listedBy = this.user;
        this.$q.loading.show();
        this.createListing({...this.listingForm}).then(res => {
          this.$q.loading.hide();
          this.$q.notify({message: 'Listing published! After listing is marked as sold you can attach a document', color: 'positive'});
          let keys = Object.keys(this.listingForm);
          keys.forEach(data => {
            if (Array.isArray(this.listingForm[data])) {
              this.listingForm[data] = [];
            } else {
              this.listingForm[data] = '';
            }
          })
          this.images = [];
        }).catch(err => {
          this.$q.loading.hide();
          console.log(err);
          this.$q.notify({
            message: 'Something went wrong, make sure all fields are correct',
            color: 'negative'
          })
        })
      },
      uploadImageSuccess(formData, index, fileList) {
        this.images = fileList;
        console.log(fileList);
      },
      beforeRemove(index, done, fileList) {
        var r = confirm("remove image")
        if (r) {
          done();
          this.images = fileList;
        }
      },
    }
  }
</script>

<style scoped lang="scss">
  .create-listing-wrapper {
    padding: 50px;
    display: flex;
  }

  .image-uploader {
    width: 45vw;
    height: 60vh;
    border: 2px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    .icon {
      font-size: 6em;
      cursor: pointer;
      transition: 0.3s all ease-in-out;
    }

    .icon:hover {
      color: red;
      font-size: 6.3em;
    }

    .footer {
      position: absolute;
      bottom: 40px;
      border-bottom: 2px solid black;
      height: 60px;
      width: 100%;
    }
  }

  .form {
    padding: 0 20px;
    width: 55%;
  }

  .images-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;

    .image {
      display: flex;
      align-items: center;
      justify-content: center;

      .icon {
        margin-left: 5px;
      }
    }
  }
</style>

<template>
  <q-page class="create-listing-wrapper">
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
        <q-input v-model="listingForm.title" class="col-4" style="width: 30%" label="Title" />
        <q-input v-model="listingForm.price" class="col-3" type="number" label="Price" />
        <q-select v-model="listingForm.condition" class="col-4" :options="['New', 'Like New', 'Used']" label="Condition"/>
      </div>
      <div class="row justify-between q-my-lg">
        <location-form></location-form>
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
      <div style="text-align: right;">
        <q-btn color="secondary" class="q-my-lg" label="Post listing" @click="savePosting"/>
      </div>
    </div>
  </q-page>
</template>

<script>
  import MultiImageUpload from 'components/common/MultiImageUpload';
  import LocationForm from 'components/Forms/LocationForm/LocationForm';
  import AWS from 'aws-sdk';
  import { mapActions, mapState } from 'vuex';

  AWS.config.update({
    accessKeyId: 'AKIAJA7CT4DCZHE5MNUQ',
    secretAccessKey: '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',
    region: 'us-west-1',
  });

  export default {
    name: "CreatePosting",
    components: {
      MultiImageUpload,
      LocationForm
    },
    data(){
      return {
        categories: ['Rifle', 'Assault Rifle', 'Handgun', 'Submachine Gun', 'Hunting', 'Magazines', 'Scopes','Other', '9mm', '223/5.56', '45 ACP', '12-Gauge', '.22', '.308' ],
        images: [],
        formData: {},
        listingForm: {
          title: '',
          price: null,
          condition: '',
          address: '',
          city: '',
          category: '',
          tags: [],
          description: '',
          images: []
        }
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
      async savePosting(){
        if(this.images.length === 0) {
          this.publish();
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
        if(this.listingForm.images.length === this.images.length) {
          this.publish();
        }
      },
      publish(){
        this.listingForm.listedBy = this.user;
        this.createListing({...this.listingForm}).then(res => {
          this.$q.notify({message: 'Listing published!', color: 'positive'});
          let keys = Object.keys(this.listingForm);
          keys.forEach(data => {
            if(Array.isArray(this.listingForm[data])) {
              this.listingForm[data] = [];
            } else {
              this.listingForm[data] = '';
            }
          })
          this.images = [];
        }).catch(err => this.$q.notify({message: 'Something went wrong, make sure all fields are correct', color: 'negative'}))
      },
      uploadImageSuccess(formData, index, fileList) {
          this.images = fileList;
      },
      beforeRemove (index, done, fileList) {
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
</style>

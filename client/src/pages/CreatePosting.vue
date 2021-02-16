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
      @edit-image="editImage"
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
        <q-input class="col-4" style="width: 30%" label="Title" />
        <q-input class="col-3" type="number" label="Price" />
        <q-select class="col-4" :options="['New', 'Like New', 'Used']" label="Condition"/>
      </div>
      <div class="row justify-between q-my-lg">
        <q-input class="col-4" label="Address (optional)" type="address" />
        <q-input class="col-4" label="City (required)" />
        <q-select class="col-3" :options="['Handgun', 'Ammunition', 'Assault rifle', 'Hunting rifle']" label="Category" />
      </div>
      <q-select class="q-my-lg" label="Tags" />
      <q-input class="q-my-lg" type="textarea" label="Description"/>
      <q-space></q-space>
      <div style="text-align: right;">
        <q-btn color="secondary" class="q-my-lg" label="Post listing" @click="savePosting"/>
        <img src="" height="200" width="200"/>

      </div>
    </div>
  </q-page>
</template>

<script>
  import MultiImageUpload from 'components/common/MultiImageUpload';
  import AWS from 'aws-sdk';

  AWS.config.update({
    accessKeyId: 'AKIAJA7CT4DCZHE5MNUQ',
    secretAccessKey: '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',
    region: 'us-west-1',
  });



  export default {
    name: "CreatePosting",
    components: {
      MultiImageUpload
    },
    data(){
      return {
        images: [],
        formData: {},
      }
    },
    methods: {
      savePosting(){
        let s3 = new AWS.S3();
        let today = new Date();
        let options = {
          partSize: 10 * 1024 * 1024,
          queueSize: 1
        };
        this.images.forEach((image) => {
          let stream = image.path;
          var uniqueName = {
            path: `profile/${today.getFullYear().toString()}${today.getMonth().toString().padStart(2, "0")}/`,
            file: `guntrade_${image.name.replace(/[^a-zA-Z0-9.]/g, "")}`
          };
          var params = {
            Bucket: 'guntrade',
            Key: uniqueName.path + uniqueName.file,
            Body: image.file,
            ContentEncoding: 'base64',
            ContentType: image.type,
            ACL: 'public-read'
          };
          console.log('params', params);
          // eslint-disable-next-line no-console
          s3.upload(params, options, function (err, data) {
            if (err) {
              // eslint-disable-next-line no-console
              console.log('Something went wrong:', err);
            } else {
              // eslint-disable-next-line no-console
              console.log('Something went right:', data);
              if (data['details'] === undefined) {
                data['details'] = {};
              }
              data['details']['name'] = image.name;
              data['details']['size'] = image.size;
              data['details']['type'] = image.type;
              data['details']['lastModifiedDate'] = image.lastModifiedDate;
            }
          }.bind(this));

        })
      },
      uploadImageSuccess(formData, index, fileList) {
        console.log('data', formData, index, fileList)
          this.images = fileList;
        // Upload image api
        // axios.post('http://your-url-upload', formData).then(response => {
        //   console.log(response)
        // })
      },
      beforeRemove (index, done, fileList) {
        console.log('index', index, fileList)
        var r = confirm("remove image")
        if (r == true) {
          done()
          this.images = fileList;
        } else {
        }

      },
      editImage (formData, index, fileList) {
        console.log('edit data', formData, index, fileList)
      }
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

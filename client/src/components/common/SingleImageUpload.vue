<template>
  <div>
    <multi-image-upload
      @upload-success="uploadImageSuccess"
      @before-remove="beforeRemove"
      @edit-image="editImage"
      drop-text="Upload image"
      drag-text="Upload image"
      browse-text="Browse Files"
      :data-images="images"
      primary-text=""
      :multiple="false"
      popup-text="We accept most common image formats, including: gif, jpg, png, bmp, jpeg"
    >
    </multi-image-upload>
  </div>
</template>

<script>
  import MultiImageUpload from 'components/common/MultiImageUpload';

  import AWS from 'aws-sdk';


  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: 'us-west-1',
  });

  export default {
    name: 'SingleImageUpload',
    components: {
      MultiImageUpload
    },
    data(){
      return {
        images: [],
      }
    },
    props: {
      folderPath: {
        type: String,
        default: 'profile'
      },
      isPrivate: {
        type: Boolean,
        default: false
      },
      imageType: {
        type: String,
        default: 'guntrade_'
      },
      user: {
        type: Object,
        default: () => {}
      }
    },
    methods: {
      uploadImageSuccess(formData, index, fileList) {
        // console.log('data', formData, index, fileList)
        this.$q.loading.show();
        let s3 = new AWS.S3();
        let today = new Date();
        let options = {
          partSize: 10 * 1024 * 1024,
          queueSize: 1
        };
        if (fileList.length > 0) {
          fileList.forEach((image) => {
            let stream = image.path;
            this.$emit('encoded', image.path);
            let uniqueName = {
              path: `${this.folderPath}/${today.getFullYear().toString()}${today.getMonth().toString().padStart(2, "0")}/`,
              file: `${Object.keys(this.user).length ? this.user._id : this.imageType}${image.name.replace(/[^a-zA-Z0-9.]/g, "")}`
            };
            let params = {
              Bucket: 'guntrade',
              Key: uniqueName.path + uniqueName.file,
              Body: image.file,
              ContentEncoding: 'base64',
              ContentType: image.type,
              ACL: this.isPrivate ? 'private' : 'public-read'
            };
            s3.upload(params, options, function (err, data) {
              if (err) {
              } else {
                if (data['details'] === undefined) {
                  data['details'] = {};
                }
                data['details']['name'] = image.name;
                data['details']['size'] = image.size;
                data['details']['type'] = image.type;
                data['details']['lastModifiedDate'] = image.lastModifiedDate;
                this.$q.loading.hide();
                this.$emit('image', {url: data.Location,key: data.key})
              }
            }.bind(this));
          })
        }
      },
      beforeRemove(index, done, fileList) {
        let r = confirm("remove image")
        if (r) {
          done()
          this.images = fileList;
        } else {
        }

      },
      editImage(formData, index, fileList) {
        // console.log('edit data', formData, index, fileList)
      },
    }
  };
</script>

<style scoped>

</style>

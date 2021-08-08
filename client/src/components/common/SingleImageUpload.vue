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
  import {mapActions} from 'vuex';

  // import AWS from 'aws-sdk';
  //
  //
  // AWS.config.update({
  //   accessKeyId: process.env.ACCESS_KEY_ID,
  //   secretAccessKey: process.env.SECRET_ACCESS_KEY,
  //   region: 'us-west-1',
  // });

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
      ...mapActions('img-uploader', {
        addFile: 'create'
      }),
      async uploadImageSuccess(formData, index, fileList) {
        this.$q.loading.show();
        if (fileList.length > 0) {
          await fileList.forEach((image) => {
            this.addFile({image, public: true, type: 'listing'}).then((res) => {
              let data = res.newImage;
              this.$emit('encoded', image.path);
              if (data['details'] === undefined) {
                data['details'] = {}
              };
              data['details']['name'] = image.name;
              data['details']['size'] = image.size;
              data['details']['type'] = image.type;
              data['details']['lastModifiedDate'] = image.lastModifiedDate;
              this.$q.loading.hide();
              this.$emit('image', {url: data.Location,key: data.key})
              this.$q.loading.hide();
            }).catch(e => {
              this.$q.notify({
                message: e.message,
                color: 'negative'
              });
              this.$q.loading.hide();
            })
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
      }
    }
  };
</script>

<style scoped>

</style>

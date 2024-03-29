<template>
  <q-page class="flex flex-center">
    <q-card class="row">
      <div class="row">
        <div class="q-ma-lg">
          <q-avatar size="300px" v-if="!editing">
<!--            <div style="wid"></div>-->
            <img :src="user.avatar" style="border: 2px solid var(--q-color-primary); object-fit: cover;"/>
          </q-avatar>
          <multi-image-upload
            v-else
            @upload-success="uploadImageSuccess"
            @before-remove="beforeRemove"
            @edit-image="editImage"
            :data-images="images"
            drop-text="Upload images"
            drag-text="Upload Profile Picture"
            browse-text=""
            primary-text="Profile Picture"
            :multiple="false"
            popup-text="We accept most common image formats, including: gif, jpg, png, bmp, jpeg"
          >
          </multi-image-upload>
        </div>
        <div class="q-ma-lg row" style="display: flex; flex-direction: column;">
          <div>
            <span v-if="!editing" class="text-weight-bold text-h4">{{ user.username }}</span>
            <q-input v-if="editing" label="Username" v-model="clonedUser.username" :placeholder="user.username" maxlength="20"/>
          </div>
          <q-separator/>
          <div class="column q-mt-lg">
          <span class="text-h6">
            <q-icon name="email" color="secondary"/>
            &nbsp; &nbsp;<span>{{ user.email }}</span>
          </span>
            <q-separator/>
            <span class="text-h6">
            <q-icon v-if="!editing" name="call" color="secondary"/>
            &nbsp; &nbsp;<span v-if="!editing">{{ user.phone }}</span>
              <q-input v-if="editing" label="Phone" v-model="clonedUser.phone" :placeholder="user.phone"
                       mask="###-###-####"
                       unmasked-value/>
          </span>
            <q-separator/>
          </div>
          <div class="q-mt-md q-pl-xs">
            <input v-model="clonedUser.takeToListings" type="checkbox" :disabled="!editing"/>
            <span style="margin-left: 10px; font-size: 1.1em;">Take me to listings when I log on</span>
            <q-separator />
          </div>
        </div>
        <div class="flex justify-start items-end" style="width: 100%;">
          <span class="text-subtitle1 q-ma-xs">Member since: {{
              date.formatDate($lget(user, 'createdAt', new Date()), 'MMM DD, YYYY')
            }}</span>
        </div>
      </div>
      <div class="column">
        <q-btn @click="$router.push({name: 'my-listings'})" class="q-ma-md bg-secondaryGradient text-white" outlined icon="receipt" label="My listings"
               ></q-btn>
<!--        <q-btn class="q-ma-md" outlined icon="receipt" label="Watched Listings" color="secondary" ></q-btn>-->
        <q-btn @click="$router.push('/messages');" class="q-ma-md bg-secondaryGradient text-white" outlined icon="chat" label="Messages"></q-btn>

<!--        <q-btn size="md"  push  @click="$router.push({name: 'premium'})" class="text-white q-ma-sm bg-primaryGradient">-->
<!--          Go Premium-->
<!--        </q-btn>-->
        <q-space/>
        <q-btn v-if="!editing" rounded label="Edit Profile" icon="create" class="q-ma-sm bg-primaryGradient text-white"
               @click="editing = true">

        </q-btn>
        <q-btn v-if="editing" rounded label="Save" icon="save" class="q-ma-sm bg-primaryGradient text-white"
               @click="saveAccount">

        </q-btn>
        <div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
  import {mapState} from 'vuex';
  import {date} from 'quasar'
  import MultiImageUpload from 'components/common/MultiImageUpload';
  import AWS from 'aws-sdk';


  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: 'us-west-1',
  });


  export default {
    name: 'Account',
    components: {
      MultiImageUpload
    },
    data() {
      return {
        editing: false,
        date: date,
        images: [],
      }
    },
    computed: {
      ...mapState('auth', {
        user: 'user'
      }),
      clonedUser() {
        return this.user.clone();
      }
    },
    methods: {
      uploadImageSuccess(formData, index, fileList) {
        this.images = fileList;
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
        console.log('edit data', formData, index, fileList)
      },
      saveAccount() {
        this.$q.loading.show();
        this.editing = !this.editing;
        let doubleCloned = this.clonedUser;
        let s3 = new AWS.S3();
        let today = new Date();
        let options = {
          partSize: 10 * 1024 * 1024,
          queueSize: 1
        };
        if (this.images.length > 0) {
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
            // eslint-disable-next-line no-console
            s3.upload(params, options, function (err, data) {
              if (err) {
                console.log(err);
              } else {
                if (data['details'] === undefined) {
                  data['details'] = {};
                }
                data['details']['name'] = image.name;
                data['details']['size'] = image.size;
                data['details']['type'] = image.type;
                data['details']['lastModifiedDate'] = image.lastModifiedDate;
                doubleCloned.avatar = data.Location;
                doubleCloned.takeToListings = this.takeListings;
                doubleCloned.save().then((res) => {
                  this.$q.loading.hide();
                  this.$q.notify({
                    color: 'secondary',
                    textColor: 'white',
                    icon: 'check_circle',
                    message: 'Account Saved',
                    position: 'top-right',
                    timeout: 3000,
                  })
                }).catch((err) => {
                  this.$q.loading.hide();
                  if (err.code === 409) {
                    this.$q.notify({
                      color: 'secondary',
                      textColor: 'white',
                      icon: 'cancel',
                      message: 'That username is already taken.',
                      position: 'bottom',
                      timeout: 5000,
                    })
                  } else {
                    this.$q.loading.hide();
                    if (err.code === 409) {
                      this.$q.notify({
                        color: 'secondary',
                        textColor: 'white',
                        icon: 'cancel',
                        message: 'Something went wrong, please refresh your connection and try again.',
                        position: 'bottom',
                        timeout: 5000,
                      })
                    }
                  }
                })
              }
            }.bind(this));
          })
        } else {
          doubleCloned.save().then((res) => {
            this.$q.loading.hide();
            this.$q.notify({
              color: 'secondary',
              textColor: 'white',
              icon: 'check_circle',
              message: 'Account Saved',
              position: 'top-right',
              timeout: 3000,
            })
          }).catch((err) => {
            this.$q.loading.hide();
            if (err.code === 409) {
              this.$q.notify({
                color: 'secondary',
                textColor: 'white',
                icon: 'cancel',
                message: 'That username is already taken.',
                position: 'bottom',
                timeout: 5000,
              })
            } else {
              this.$q.loading.hide();
              if (err.code === 409) {
                this.$q.notify({
                  color: 'secondary',
                  textColor: 'white',
                  icon: 'cancel',
                  message: 'Something went wrong, please refresh your connection and try again.',
                  position: 'bottom',
                  timeout: 5000,
                })
              }
            }
          })
        }
      }
    }
  };
</script>

<style scoped>

</style>

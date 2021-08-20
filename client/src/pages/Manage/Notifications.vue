<template>
  <div class="notifications">
    <q-input label="Header" v-model="host.announcementHeader" />
    <q-input label="Main Body" v-model="host.announcementBody" />
    <single-image-upload :folder-path="'app'" :user="user" :isPrivate="false" image-type="gunhub_app_" @image="fullImage = $event">

    </single-image-upload>
    <q-btn label="Save Popup changes" @click="updateT" color="secondary"/>
    <q-btn label="Remove popup" @click="removePopup" color="primary" />
  </div>
</template>

<script>

  import {mapActions, mapGetters} from 'vuex';
  import SingleImageUpload from 'components/common/SingleImageUpload';

  export default {
    name: 'Notifications',
    components: {SingleImageUpload},
    data() {
      return {
        host: {},
        header: '',
        body: '',
        fullImage: null
      }
    },
    mounted() {
      this.findHost({}).then(res => {
        this.host = res.data[0];
      })
    },
    computed: {
      ...mapGetters('auth', {
        user: 'user'
      })
    },
    methods: {
      ...mapActions('host', {
        patchHost: 'patch',
        findHost: 'find'
      }),
      updateT() {
        if (this.fullImage) {
          this.host.announcementImage = this.fullImage;
        }
        this.patchHost([this.host._id, this.host]).then((res) => {
          console.log(res);
          this.$q.notify({
            message: 'Popup updated successfully',
            color: 'positive'
          })
        }).catch(er => {
          this.$q.notify({
            message: er.message,
            color: 'negative'
          });
        })
      },
      removePopup() {
        this.patchHost([this.host._id, {
            announcementHeader: '',
            announcementBody: '',
            announcementImage: {}
        }]).then(() => {
          this.$q.notify({
            message: 'Popup removed successfully',
            color: 'positive'
          })
        }).catch(er => {
          this.$q.notify({
            message: er.message,
            color: 'negative'
          });
        })
      }
    }
  };
</script>

<style scoped>

</style>

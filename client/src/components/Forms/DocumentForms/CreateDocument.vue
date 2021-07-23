<template>
  <q-card class="document-wrapper">
    <q-icon v-close-popup class="close-icon" name="close" size="sm"/>
    <div class="left">
      <SingleImageUpload @encoded="saveImageEncoded" :folder-path="'documents'" :user="user" :isPrivate="true" image-type="gunhub_document_" @image="document.document = $event">

      </SingleImageUpload>
      <div class="signature">
        <div class="notes">
          <q-input maxlength="500" v-model="document.notes" type="textarea" filled label="Add notes (optional)"/>
        </div>
        <div class="text-h6">Type in your name and Today's date</div>
        <div class="input-wrapper">
          <q-input maxlength="30" v-model="document.signature" label="Your full name" type="text"/>
          <q-input v-model="document.dateSigned" class="q-pa-md" type="date"/>
        </div>
      </div>
    </div>

    <div class="right" v-if="!$q.platform.is.mobile">
      <ViewDocument :document="document" />
    </div>

    <div class="buttons-wrapper">
      <q-btn label="Cancel" v-close-popup color="negative" />
      <q-btn @click="saveDocument" class="q-ml-lg" label="Save document" v-close-popup color="secondary" />
    </div>
  </q-card>
</template>

<script>

  import SingleImageUpload from "components/common/SingleImageUpload";
  import { mapActions, mapGetters } from 'vuex';
  import ViewDocument from "components/common/ViewDocument";

  export default {
    name: "CreateDocument",
    components: {ViewDocument, SingleImageUpload},
    data(){
      return {
        document: {
          document: {},
          signature: '',
          notes: '',
          dateSigned: '',
          listing: this.listing._id,
          img: '',
        }
      }
    },
    props: {
      listing: {
        type: Object,
        required: true
      }
    },
    computed: {
      ...mapGetters('auth', {
        user: 'user'
      })
    },
    methods: {
      ...mapActions('documents', {
        createDocument: 'create'
      }),
      saveImageEncoded(encoded) {
        this.document.fullImage = encoded;
      },
      saveDocument() {
        if(!this.document.fullImage) {
          this.$q.notify({
            message: 'Must attach image',
            color: 'negative'
          })
          return;
        }
        delete this.document.fullImage;
        if(!this.document.signature || !this.document.dateSigned) {
          this.$q.notify({
            message: 'Must add signature and today\'s date',
            color: 'negative'
          });
          return;
        }
        this.$q.loading.show();
        this.createDocument(this.document).then(() => {
          this.$q.loading.hide();
          this.$q.notify({
            message: 'Document added successfully',
            color: 'positive'
          })
        }).catch(err => {
          this.$q.loading.hide();
          this.$q.notify({
            message: err.message,
            color: 'negative'
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

  @import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap');

  .document-wrapper {
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 40px;

    .input-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .notes {
      margin: 30px 0;
    }

    .close-icon {
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
      color: white;
      background-color: rgba(0, 0, 0, 0.8);
      padding: 3px;
      border-radius: 3px;
    }

    .right {
      width: 40vw;
      overflow: scroll;
      height: 80vh;
      background-color: #dadfea;
      border-radius: 5px;
    }

    .buttons-wrapper {
      position: absolute;
      bottom: 20px;
      right: 20px;
    }
  }

  @media only screen and (max-width: 800px) {
    .document-wrapper {
      flex-direction: column;
      height: 110vh;
      padding: 10px;
    }

    .buttons-wrapper {
      //display: flex;
      //flex-direction: column;
      //justify-content: center;
      //align-items: center;
      position: static !important;
    }
    .input-wrapper {
      display: flex;
      flex-direction: column;
    }
    .buttons-wrapper {
      text-align: center;
    }
  }

</style>

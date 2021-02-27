<template>
  <div class="right" v-if="displayDocument">
    <img v-if="displayDocument.document" :src="displayDocument.document.url" />
    <div class="note-display">{{ displayDocument.notes }}</div>
    <div class="signature-wrapper">
      <div>{{ displayDocument.signature }}</div>
      <div v-if="displayDocument.dateSigned">Todays date: {{ displayDocument.dateSigned }}</div>
    </div>
  </div>
</template>

<script>

  import { mapActions } from 'vuex';

  export default {
    name: "ViewDocument",
    props: {
      document: {
        type: Object,
        required: false
      },
      id: {
        required: false
      }
    },
    data(){
      return {
        displayDocument: {}
      }
    },
    mounted(){
      if(this.document && !this.id) {
        this.displayDocument = this.document;
      } else {
        this.getDocument(this.id).then(res => {
          this.displayDocument = res;
        })
      }
    },
    methods: {
      ...mapActions('documents', {
        getDocument: 'get'
      })
    }
  }
</script>

<style scoped lang="scss">
  .right {
    width: 40vw;
    overflow: scroll;
    height: 80vh;
    background-color: #dadfea;
    border-radius: 5px;
    position: relative;

    img {
      width: 90%;
      max-height: 60vh;
      margin: 0 auto;
      margin-left: 15px;
    }

    .note-display {
      font-size: 1.1em;
      letter-spacing: 1px;
      padding: 10px;
    }
    .signature-wrapper {
      display: flex;
      align-items: center;
      padding: 10px;

      div:first-child {
        font-family: 'Cedarville Cursive', 'serif';
        margin: 20px 0;
        font-size: 2.4em;
        border-bottom: 1px solid black;
        padding-bottom: 5px;
      }
      div:last-child {
        margin-left: 60px;
      }
    }
  }
</style>

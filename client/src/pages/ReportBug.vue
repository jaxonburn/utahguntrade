<template>
  <q-page class="report-bug">
    <div class="header">
      Report a bug
    </div>
    <div class="body">
      <q-card class="q-pa-lg">
        <q-input label="Simple description of bug" v-model="description"/>
        <q-input class="q-py-lg" label="Any additional notes" v-model="notes"/>
        <q-input class="q-mb-lg" label="Email (optional)" v-model="email" />
        <q-card-actions align="right">
          <q-btn label="Submit" @click="submitBugReport()" color="secondary"/>
        </q-card-actions>
      </q-card>

    </div>
    <q-dialog v-model="confirmDio">
      <q-card class="card">
        <div>Thank you for playing an active role in this community, we will look into this ASAP.</div>
        <q-icon name="done" color="green" size="xl"/>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>

  import { mapActions, mapGetters } from 'vuex';

  export default {
    name: "ReportBug",
    data(){
      return {
        description: '',
        notes: '',
        email: '',
        confirmDio: false
      }
    },
    methods: {
      ...mapActions('reported-bugs', {
        createBugReport: 'create'
      }),
      submitBugReport(){
        if(!this.description) {
          this.$q.notify({
            message: 'Must provide a description of the bug'
          })
          return;
        }
        this.createBugReport({
          email: this.email,
          bug: this.description,
          notes: this.notes
        }).then(() => {
          this.confirmDio = true;
          setTimeout(() => {
            this.confirmDio = false;
            this.description = '';
            this.notes = '';
          }, 3000);
        }).catch(() => {
          this.$q.notify({
            message: 'Something went wrong on our end, we will look into this',
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

<style scoped>
  .header {
    text-align: center;
    margin: 40px 0;
    font-size: 2.3em;
  }
  .body {
    width: 40vw;
    margin: 40px auto 0 auto;
    padding: 20px;
  }
  .card {
    text-align: center;
    padding-bottom: 10px;
  }
  .card div {
    margin: 10px;
    font-size: 1.4em;
  }
</style>

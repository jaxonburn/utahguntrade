<template>
  <q-page class="bugs">
    <div class="header">
      User Reported Bugs
    </div>
    <div class="body">
      <div class="bug-wrapper" v-for="(bug, idx) of bugs" :key="idx">
        <div class="bug">
          <div><span>Bug:</span> {{ bug.bug }}</div>
          <div><span>Notes:</span> {{ bug.notes }}</div>
          <div><span>Reported from:</span> {{ $lget(bug, 'email', 'No email provided') }}</div>
        </div>
        <q-icon name="delete" size="lg" style="cursor: pointer;" @click="removeBug(bug)" color="red" />
      </div>
      <div style="text-align: center; margin: 30px 0; font-size: 2em;">Errors</div>
      <div class="bug-wrapper" v-for="(err, idx) of errs" :key="err._id">
        <div class="bug">
          <div><span>Error Type:</span> {{ err.type }}</div>
          <div><span>Class Name:</span> {{ err.className }}</div>
          <div><span>Code:</span> {{ err.code }}</div>
        </div>
        <q-icon name="delete" size="lg" style="cursor: pointer;" @click="removeErr(err)" color="red" />
      </div>
    </div>
  </q-page>
</template>

<script>

  import { mapActions, mapGetters } from 'vuex';

  export default {
    name: "Bugs",
    mounted(){
      this.loadBugs();
      this.loadErrs();
    },
    methods: {
      ...mapActions('reported-bugs', {
        loadBugs: 'find',
        deleteBug: 'remove'
      }),
      ...mapActions('app-errors', {
        loadErrs: 'find',
        deleteErr: 'remove'
      }),
      removeBug(bug){
        this.deleteBug(bug._id).then(() => {
          this.$q.notify({
            color: 'positive',
            message: 'Bug deleted'
          })
        }).catch(err => {
          this.$q.notify({
            color: 'negative',
            message: err.message
          })
        })
      },
      removeErr(err){
        this.deleteErr(err._id).then(() => {
          this.$q.notify({
            color: 'positive',
            message: 'Error deleted'
          })
        }).catch(err => {
          this.$q.notify({
            color: 'negative',
            message: err.message
          })
        })
      }
    },
    computed: {
      ...mapGetters('reported-bugs', {
        findBugs: 'find',
      }),
      ...mapGetters('app-errors', {
        findErrs: 'find'
      }),
      errs() {
        console.log(this.findErrs());
        return this.findErrs().data;
      },
      bugs(){
        return this.findBugs().data;
      }
    }
  }
</script>

<style scoped lang="scss">
  .header {
    text-align: center;
    margin: 25px 0;
    font-size: 2.3em;
  }
  .body {
    overflow: scroll;
    padding: 20px;

    .bug-wrapper {
      box-shadow: 2px 2px 6px 2px rgba(0, 0, 0, 0.3);
      width: 70%;
      margin: 25px auto;
      font-size: 1.1em;
      padding: 10px;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    span {
      font-weight: bold;
    }
  }
</style>

<template>
  <q-page class="user-reports">
    <h1>User Reports</h1>
    <div class="reports">
      <div class="report" v-for="(report, idx) of reports" :key="idx">
        <h5>Service: {{ report.service }}</h5>
        <div>{{report._fastjoin.data}}</div>
      </div>
    </div>
  </q-page>
</template>

<script>

  import {mapActions, mapGetters} from 'vuex';

  export default {
    name: 'UserReports',
    mounted() {
      this.loadReports({});
    },
    methods: {
      ...mapActions('reports', {
        loadReports: 'find'
      })
    },
    computed: {
      ...mapGetters('reports', {
        getReports: 'find'
      }),
      reports() {
        return this.getReports({}).data;
      }
    },
  };
</script>

<style scoped>

</style>

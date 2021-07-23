<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Report {{name}}</div>
    </q-card-section>
    <q-card-section>
      Would you like to report this {{name}}? We appreciate community feedback and it helps keep our site clean and secure.
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="Cancel" v-close-popup color="red"/>
      <q-btn @click="report" :label="`Report ${name}`" v-close-popup color="red" />
    </q-card-actions>
  </q-card>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "ReportDialog",
  props: {
    name: {type: String, required: true},
    service: {type: String, required: true},
    dataId: {type: String, required: true}
  },
  methods: {
    ...mapActions('reports', {
      createReport: 'create'
    }),
    report() {
      this.$q.loading.show();
      this.createReport({
        service: this.service,
        dataId: this.dataId
      }).then(() => {
        this.$q.loading.hide();
        this.$q.notify({
          message: 'We appreciate the feedback, our team will review it ASAP.',
          color: 'secondary'
        })
      }).catch((er) => {
        this.$q.loading.hide();
        this.$q.notify({
          message: er.message,
          color: 'negative'
        })
      })
    },
  }
}
</script>

<style scoped>

</style>

<template>
  <q-card class="listing">
    {{ listing }}
  </q-card>
</template>

<script>
  export default {
    name: "Listing",
    props: {
      listing: {
        type: Object,
        required: true
      }
    }
  }
</script>

<style scoped lang="scss">
  .listing {
    width: 95%;
  }
</style>

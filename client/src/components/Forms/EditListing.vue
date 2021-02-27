<template>
  <q-card class="edit-listing">
    <CreatePosting :listing="listing" :isEditing="true" />
  </q-card>
</template>

<script>
  import CreatePosting from "pages/Listings/CreatePosting";
  export default {
    name: "EditListing",
    components: {CreatePosting},
    props: {
      listing: {
        type: Object,
        required: true
      }
    }
  }
</script>

<style scoped lang="scss">

</style>

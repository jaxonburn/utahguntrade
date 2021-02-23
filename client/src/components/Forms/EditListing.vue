<template>
  <q-card class="edit-listing">
    <CreatePosting :is-editing="true" />
  </q-card>
</template>

<script>
  import CreatePosting from "pages/CreatePosting";
  export default {
    name: "EditListing",
    components: {CreatePosting}
  }
</script>

<style scoped lang="scss">

</style>

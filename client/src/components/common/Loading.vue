<template>
  <div class="loading">
    <q-spinner
      color="primary"
      size="8em"
      :thickness="4"
    />
  </div>
</template>

<script>
  export default {
    name: "Loading",
  }
</script>

<style scoped>
  .loading {
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
  }
</style>

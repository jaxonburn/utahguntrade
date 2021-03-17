<template>
  <q-card style="max-width: 800px;width: 100%;height: 500px;display: flex; justify-content: space-around;flex-direction: column;">
    <div>
    <q-card-section>
      <q-img :src="require('src/assets/utahgunhub.png')" style="height: 150px;width: 150px;" />
    </q-card-section>
    <q-card-section class="q-mx-lg">
      <span class="readFont">
      &nbsp; &nbsp; &nbsp;Utah Gun Hub Community is a private community for Utah firearm owners to freely chat and post. Upgrade your account today to....
        </span>
    </q-card-section>
    </div>
    <q-card-section class="flex justify-between items-end">
      <div>
      <q-btn size="md" class="bg-accent q-ma-sm text-white">
        Go Back
      </q-btn>
      </div>
      <q-btn size="lg"  push  @click="$router.push({name: 'premium'})" class="text-white q-ma-sm bg-primaryGradient">
        Join The Community
      </q-btn>
    </q-card-section>
  </q-card>
</template>

<script>
  export default {
    name: 'communityDialog'
  };
</script>

<style scoped>
  .readFont {
    font-family: "Kuchek", Times, Serif;
    line-height: 1.6em;
    font-size: 1.8em;
    font-weight: 100;
    text-align: center;
  }
</style>

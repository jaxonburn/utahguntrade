<template>
  <div style="height: 200px;width: 100%;display: flex;flex-direction: column;background: rgba(40, 40, 40, 1);">
  <div style=" display: grid; grid-template-columns: 3fr 1fr;">
    <div class="mainFooterFont items-center" style="display: grid; grid-template-columns: 1fr 1fr;">
      <q-avatar size="150px">
        <q-img src="../../assets/Logos/utahgunhublogo.png" @click="$router.push('/')" class="cursor-pointer"/>
      </q-avatar>
    </div>
  </div>
    <div class="text-white">
      ©GunHubUtah 2021
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MainFooter'
  };
</script>

<style scoped>
  .mainFooterFont {
    font-family: "Kuchek", Times, Serif;
    font-weight: 900;
    font-size: 1.3em;
    white-space: nowrap;
  }

</style>

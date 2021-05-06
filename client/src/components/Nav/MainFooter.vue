<template>
  <div style="height: 200px;width: 100%;display: flex;flex-direction: column;border-top: 1px solid rgba(225, 225, 225, 1);">
  <div style=" display: grid; grid-template-columns: 3fr 1fr;">
    <div class="mainFooterFont" style="display: grid; grid-template-columns: 1fr 1fr; justify-items: center;">
      <div>
        Contact
      </div>
    </div>
    <div class="flex justify-end q-mr-sm items-center">
      <img src="../../assets/Logos/utahgunhublogo.png" style="height: 150px;" @click="$router.push('/')" class="cursor-pointer">
    </div>
  </div>
    <div>
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

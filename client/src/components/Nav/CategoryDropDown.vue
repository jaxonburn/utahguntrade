<template>
  <div style="display: flex; flex-direction: column;width: 100%;">
  <div v-if="$route.path !== '/register'" class="dropdownContainer cursor-pointer" @click="tabOpen = !tabOpen">
    <div class="dropdownTabs text-xs">
      Trade
    </div>
    <div class="dropdownTabs text-xs">
      Connect
    </div>
    <div class="dropdownTabs text-xs">
      Educate
    </div>
  </div>
    <slide-up-down :active="tabOpen" :duration="800">
      <div style="height: 250px;width: 100%;display: grid; grid-template-columns: 2fr 1fr 1fr;" class="text-black">
        <div>
            <div>
              <div class="titleFont text-sm text-mb-sm" style="border-bottom: 1px solid black;width: 70%;"><span>Firearms</span></div>
            </div>
        </div>
        <div>

        </div>
        <div>

        </div>
      </div>
    </slide-up-down>
  </div>
</template>

<script>
  import SlideUpDown from 'vue-slide-up-down'
  export default {
    name: 'CategoryDropDown',
    components: {
      SlideUpDown
    },
    data() {
      return {
        tabOpen: true,
      }
    }
  };
</script>

<style scoped>
  .dropdownTabs {
    color: black;
    font-weight: 500;
  }

  .dropdownContainer {
    display: flex;
    flex-direction: row;
    height: 50px;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
  }

  .titleFont {
    font-family: "Kuchek", Times, Serif;
    line-height: 1.6em;
    font-weight: 100;
    text-indent: 30px;
  }



</style>

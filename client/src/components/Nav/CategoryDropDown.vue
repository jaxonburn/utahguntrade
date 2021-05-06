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
        <div style="height: 100%;">
          <div style="height: 100%;">
            <div class="titleFont text-sm text-mb-sm" style="border-bottom: 1px solid black;width: 100%;">
              <span>Firearms</span>
            </div>
            <div class="q-mt-md">
              <q-breadcrumbs class="text-black text-xs text-mb-xs" active-color="black" separator="-">
                <q-breadcrumbs-el label="Rifles" class="breadCrumbHover"/>
                <q-breadcrumbs-el label="Bolt Action" class="breadCrumbHover"/>
                <q-breadcrumbs-el label="Lever Action" class="breadCrumbHover"/>
                <q-breadcrumbs-el label="Muzzleloader" class="breadCrumbHover"/>
                <q-breadcrumbs-el label="Pump Action" class="breadCrumbHover"/>
                <q-breadcrumbs-el label="Semi-Auto" class="breadCrumbHover"/>
                <q-breadcrumbs-el label="Airsoft" class="breadCrumbHover"/>
                <q-breadcrumbs-el label="Pellet Gun" class="breadCrumbHover"/>
              </q-breadcrumbs>
              <q-breadcrumbs class="text-black text-xs text-mb-xs" active-color="black" separator="-">
                <q-breadcrumbs-el label="Handguns" class="breadCrumbHover"/>
                <q-breadcrumbs-el label="Revolver" class="breadCrumbHover"/>
                <q-breadcrumbs-el label="Semi-Auto" class="breadCrumbHover"/>
              </q-breadcrumbs>
              <q-breadcrumbs class="text-black text-xs text-mb-xs" active-color="black" separator="-">
                <q-breadcrumbs-el label="Shotguns" class="breadCrumbHover"/>
              </q-breadcrumbs>
            </div>
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

  .breadCrumbHover {
    transition: 0.2s linear;
    cursor: pointer;
  }

  .breadCrumbHover:hover {
    transform: scale(1.03);
    color: var(--q-color-primary);
  }
</style>

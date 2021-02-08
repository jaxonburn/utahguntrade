<template>
  <div class="row" style="height: 60px;display: flex; align-items: flex-end;" v-if="$route.path !== '/register'">
    <div class="col-4" v-for="(category,index) in categories" :key="index" @mouseenter="category.open = true">
      <q-btn-dropdown
        v-model="category.open"
        class="bg-white text-weight-regular"
        :class="category.open ? 'text-primary text-weight-bold' : 'text-black'"
        :label="category.label"
        style="width: 100%;"
        flat
        :ripple="false"
        dropdown-icon=" "
      >
        <q-list>
          <q-item clickable v-close-popup>
            <q-item-section>
              <q-item-label>Pistols</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CategoryDropDown',
    data(){
      return {
        categories: [
          {
            label: 'Guns',
            open: false,
          },
          {
            label: 'Ammo',
            open: false,
          },
          {
            label: 'Other',
            open: false,
          }
        ],
      }
    }
  };
</script>

<style scoped>

</style>

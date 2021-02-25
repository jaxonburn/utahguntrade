<template>
  <div class="row" style="height: 60px;display: flex; align-items: flex-end;" v-if="$route.path !== '/register'">
    <div class="col-4" v-for="(category,index) in categories" :key="index" @mouseenter="category.open = true" >
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
        <q-list @mouseleave="category.open = false">
          <q-item  clickable v-close-popup v-for="type in category.types" :key="type">
            <q-item-section>
              <q-item-label>{{type}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
  </div>
</template>

<script>

  // ['Rifle', 'Assault Rifle', 'Handgun', 'Submachine Gun', 'Hunting', 'Magazines', 'Scopes','Other', '9mm', '223/5.56', '45 ACP', '12-Gauge', '.22', '.308' ]
  export default {
    name: 'CategoryDropDown',
    data() {
      return {
        categories: [
          {
            label: 'Guns',
            open: false,
            types: [
              'Rifles', 'Handguns', 'Shotguns',
            ]
          },
          {
            label: 'Ammo',
            open: false,
            types: [
              '9mm', '223/5.56', '45 ACP', '12-Gauge', '.22', '.308', 'Magazines',
            ],
          },
          {
            label: 'Other',
            open: false,
            types: [
              'Hunting', 'Knives', 'Scopes'
            ]
          }
        ],
      }
    }
  };
</script>

<style scoped>

</style>

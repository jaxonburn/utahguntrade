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
              <q-item-label @click="$router.push({name: 'listings', query: {category: type.routeTo}})">{{type.display}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
  </div>
</template>

<script>

  // ['Rifle', 'AssaultRifle', 'Handgun', 'SubmachineGun', 'Hunting', 'Magazines', 'Scopes', 'Other', '9mm', '223/5.56', '45ACP', '12-Gauge', '.22', '.308' ]
  export default {
    name: 'CategoryDropDown',
    data() {
      return {
        categories: [
          {
            label: 'Guns',
            open: false,
            types: [
              {
                display: 'Rifles',
                routeTo: 'Rifle'
              },
              {
                display: 'Submachine Guns',
                routeTo: 'SubmachineGun'
              },
              {
                display: 'Assault Rifles',
                routeTo: 'AssaultRifle'
              },
              {
                display: 'Shotguns',
                routeTo: 'Shotgun'
              }
            ]
          },
          {
            label: 'Ammo',
            open: false,
            types: [
              {
                display: '9mm',
                routeTo: '9mm'
              },
              {
                display: '223/5.56',
                routeTo: '223/5.56'
              },
              {
                display: '45 ACP',
                routeTo: '45ACP'
              },
              {
                display: '12-Gauge',
                routeTo: '12-Gauge'
              },
              {
                display: '.22',
                routeTo: '.22'
              },
              {
                display: '.308',
                routeTo: '.308'
              },
              {
                display: 'Magazines',
                routeTo: 'Magazine'
              }
            ],
          },
          {
            label: 'Other',
            open: false,
            types: [
              {
                display: 'Hunting',
                routeTo: 'Hunting'
              },
              {
                display: 'Knives',
                routeTo: 'Knives'
              },
              {
                display: 'Scopes',
                routeTo: 'Scopes'
              }
            ]
          }
        ],
      }
    }
  };
</script>

<style scoped>

</style>

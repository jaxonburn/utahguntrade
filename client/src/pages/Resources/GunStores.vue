<template>
  <q-page class="gun-stores">
    <div class="header">
      Gun stores In Utah
    </div>

    <div class="gun-ad">
      Possible gun store advertisement
    </div>

    <div class="stores">
      <div class="store" v-for="(store, idx) of stores" :key="idx">
        <div>
          <div>Name: </div>
          <div>{{ store.storeName }}</div>
        </div>
        <div>
          <div>Address: </div>
          <div>{{ store.address }}</div>
        </div>
        <div>
          <div>Hours: </div>
          <div>{{ store.hours }}</div>
        </div>
        <div>
          <div>City: </div>
          <div>{{ store.city }}</div>
        </div>
        <div>
          <div>Zip: </div>
          <div>{{ store.zip }}</div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>

  import {mapActions, mapGetters} from 'vuex';

  export default {
    name: 'GunStores',
    mounted() {
      this.loadStores({});
    },
    methods: {
      ...mapActions('gun-stores', {
        loadStores: 'find'
      })
    },
    computed: {
      ...mapGetters('gun-stores', {
        findStores: 'find'
      }),
      stores() {
        return this.findStores({}).data;
      }
    }
  };
</script>

<style scoped lang="scss">
  .header {
    width: 100%;
    margin: 0 auto;
    text-align: center;
    padding-top: 60px;
    font-size: 3em;
  }

  .stores {
    width: 90%;
    margin: 0 auto;
    .store {
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      div {
        width: 20%;
        display: flex;
        align-items: center;
      }
    }
  }
  .gun-ad {
    width: 90%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2em;
    font-weight: 300;
    padding: 70px 0;
    margin: 70px auto;
    background-color: #00aaf1;
  }
</style>

<template>
  <q-page class="gun-stores">
    <div style="width: 50vw; margin: 0 auto;">
      <q-input label="Store Name" v-model="storeName" />
      <q-input label="Address" v-model="address" />
      <q-input label="Hours (10-10)" v-model="hours" />
      <q-input label="City" v-model="city" />
      <q-input label="Zip" v-model="zip" />
      <q-btn label="Create" @click="newStore" />
    </div>
    <div class="stores" style="width: 80%; margin: 0 auto">
      <div class="store" v-for="(store, idx) of stores.data" :key="idx">
        <span>{{ store.storeName }}</span>
        <span>{{ store.address }}</span>
        <span>{{ store.hours }}</span>
        <span>{{ store.city }}</span>
        <span>{{ store.zip }}</span>
        <q-icon @click="removeStore(store._id)" name="delete" color="red" size="sm" class="cursor-pointer"/>
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
    data() {
      return {
        storeName: '',
        address: '',
        hours: '',
        city: '',
        zip: ''
      }
    },
    methods: {
      ...mapActions('gun-stores', {
        createStore: 'create',
        deleteStore: 'remove',
        loadStores: 'find'
      }),
      removeStore(id){
        this.deleteStore(id).then(() => this.$q.notify({color: 'positive', message: 'Deleted'}))
          .catch(er => this.$q.notify({color: 'negative', message: er.message}));
      },
      newStore(){
        if(!this.storeName.length || !this.address.length || !this.city.length) {
          return;
        }
        this.createStore({
          storeName: this.storeName,
          address: this.address,
          hours: this.hours,
          city: this.city,
          zip: this.zip
        }).then(() => this.$q.notify({color: 'positive', message: 'Created'})).catch(er => {
          this.$q.notify({message: er.message, color: 'negative'})
        })
      }
    },
    computed: {
      ...mapGetters('gun-stores', {
        getStores: 'find'
      }),
      stores() {
        return this.getStores({ query: {} });
      }
    }
  };
</script>

<style scoped>
  .stores {
    margin-top: 80px;
  }
  .store {
    margin: 10px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>

<template>
  <div class="listings-page">

    <div v-if="listings.length === 0">
      <Loading />
    </div>

    <div v-else>
      <div class="filter-menu row">

      </div>
      <div class="listings-wrapper">
        <Listing :listing="listing" :key="idx" v-for="(listing, idx) of listings"></Listing>
      </div>
    </div>

    <div v-if="listings.length > 0" class="pagination-wrapper">
      <q-icon v-if="listingsCurrentPage > 1" @click="changePage('minus')" class="q-mr-sm cursor-pointer" size="sm" name="arrow_back"></q-icon>
      <q-pagination
        :value="listingsCurrentPage"
        :max="listingsPages"
        :max-pages="4"
        @input="handlePagination"
        :boundary-numbers="false"
        v-if="listings.length > 0"
      >

      </q-pagination>
      <q-icon v-if="listingsCurrentPage < listingsPages" @click="changePage('add')" class="q-ml-sm cursor-pointer" size="sm" name="arrow_forward"></q-icon>

      <div class="limit-selector">
        <span class="q-mr-lg">Listings per page </span>
        <q-select :options="[3, 5, 10, 20, 50]" v-model="listingsLimit"></q-select>
      </div>
    </div>
  </div>
</template>

<script>

  import {mapActions, mapGetters} from 'vuex';
  import Listing from "components/common/Listing";
  import makeFindPaginateMixin from "src/mixins/makeFindPaginated";
  import Loading from 'components/common/Loading';

  export default {
    name: "Listings",
    components: {Listing, Loading},
    mixins: [makeFindPaginateMixin({
      limit: 10,
      service: 'listings',
      name: 'listings',
      qid: 'listings',
      query(){
        return {archived: false}
      }
    })],
    methods: {
      handlePagination(event){
        this.listingsHandlePageChange(event);
      },
      changePage(type) {
        console.log(type);
        if(type === 'minus') {
          this.listingsHandlePageChange(this.listingsCurrentPage - 1);
        } else if (type === 'add') {
          this.listingsHandlePageChange(this.listingsCurrentPage + 1);
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .filter-menu {
    margin-top: 10px;
  }
  .pagination-wrapper {
    display: flex;
    align-items: center;
    width: 100vw;
    justify-content: center;
    position: relative;
  }
  .limit-selector {
    position: absolute;
    right: 80px;
    display: flex;
    align-items: center;
  }
  .listings-page {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 40px;
  }
  .listings-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    justify-items: center;
    grid-gap: 40px;
    padding: 50px 20px;
  }

  @media screen and (max-width: 1050px) {
    .listings-wrapper {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }

  @media screen and (max-width: 820px) {
    .listings-wrapper {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media screen and (max-width: 620px) {
    .listings-wrapper {
      grid-template-columns: 1fr;
    }
  }
</style>

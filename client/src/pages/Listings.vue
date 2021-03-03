<template>
  <div class="listings-page">

    <div v-if="isPending" style="z-index: 5">
      <Loading/>
    </div>

    <div class="text-h5 q-mt-xl q-ml-xl">
      Showing Most relevant results <span>{{
        $route.query.search ? `for "${$route.query.search}"` : $route.query.category ? `for "${$route.query.category}"` : ''
      }}</span>
    </div>

    <div class="no-results" v-if="!isPending && listings.length === 0">
      <div>No results found</div>
      <q-btn color="primary" label="Reset search" @click="$router.push('/listings');"/>
    </div>

    <div v-else>
      <div class="filter-menu row justify-between q-px-xl q-pt-lg">
        <div class="row col-8 col-xs-12 col-sm-8">
          <q-select class="q-mr-xl col-4 col-xs-12 col-sm-4 q-mt-md" v-model="priceSort" filled label="Sort by price"
                    :options="['Price low to high', 'Price high to low']"></q-select>
          <q-select class="q-mr-xl col-4 col-xs-12 q-mt-md col-sm-4" v-model="dateSort" filled label="Sort by date"
                    :options="['Date newest to oldest', 'Date oldest to newest']"></q-select>
        </div>
        <q-btn label="Reset search" @click="$router.push('/listings')" color="primary" class="q-mt-md" align="right"/>
      </div>
      <div class="listings-wrapper">
        <ListingCard :listing="listing" :key="idx" v-for="(listing, idx) in listings"></ListingCard>
      </div>
    </div>

    <div v-if="listings.length > 0" class="pagination-wrapper">
      <q-icon v-if="listingsCurrentPage > 1" @click="changePage('minus')" class="q-mr-sm cursor-pointer" size="sm"
              name="arrow_back"></q-icon>
      <q-pagination
        :value="listingsCurrentPage"
        :max="listingsPages"
        :max-pages="4"
        @input="handlePagination"
        :boundary-numbers="false"
        v-if="listings.length > 0"
      >

      </q-pagination>
      <q-icon v-if="listingsCurrentPage < listingsPages" @click="changePage('add')" class="q-ml-sm cursor-pointer"
              size="sm" name="arrow_forward"></q-icon>

      <div class="limit-selector">
        <span class="q-mr-lg">Listings per page </span>
        <q-select :options="[3, 5, 10, 20, 50]" v-model="listingsLimit"></q-select>
      </div>
    </div>
  </div>
</template>

<script>

  import {mapActions, mapGetters, mapState} from 'vuex';
  import Listing from "components/common/Listing";
  import makeFindPaginateMixin from "src/mixins/makeFindPaginated";
  import Loading from 'components/common/Loading';

  export default {
    name: "Listings",
    components: {ListingCard: Listing, Loading},
    mixins: [makeFindPaginateMixin({
      limit: 10,
      service: 'listings',
      name: 'listings',
      qid: 'listings',
      query() {
        return this.listingQuery
      }
    })],
    data() {
      return {
        dateSort: -1,
        priceSort: 'Price low to high'
      }
    },
    watch: {
      listings: {
        handler(newVal) {
          console.log(newVal);
        }
      }
    },
    computed: {
      ...mapState('listings', {
        isPending: 'isFindPending'
      }),
      sort() {
        return {
          price: this.priceSort === 'Price low to high' ? 1 : -1,
          createdAt: this.dateSort === 'Date newest to oldest' ? 1 : -1
        }
      },
      listingQuery() {
        return {
          archived: false,
          sold: false,
          title: {$regex: `(?i).*${this.$lget(this.$route.query, 'search', '').length > 0 ? this.$route.query.search : ''}.*`},
          category: {$regex: `(?i).*${this.$lget(this.$route.query, 'category', '').length > 0 ? this.$route.query.category : ''}.*`},
          $sort: this.sort
        }
      }
    },
    methods: {
      handlePagination(event) {
        this.listingsHandlePageChange(event);
      },
      changePage(type) {
        console.log(type);
        if (type === 'minus') {
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
    right: 110px;
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

  .no-results {
    text-align: center;
    font-size: 2em;
    margin-top: 150px;
  }

  @media screen and (max-width: 1050px) {
    .listings-wrapper {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }

  @media screen and (max-width: 700px) {
    .listings-wrapper {
      grid-template-columns: 1fr;
    }
    .limit-selector {
      left: 20px;
      //top: 40px;
    }
    .listing {
      width: 60%;
    }
  }

  @media screen and (max-width: 500px) {
    .listings-wrapper {
      grid-template-columns: 1fr;
    }
    .limit-selector {
      left: 10px;
    }
    .listing {
      width: 90%;
    }
    .pagination-wrapper {
      justify-content: flex-end;
      padding-right: 30px;
    }
  }
</style>

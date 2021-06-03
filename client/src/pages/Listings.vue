<template>
  <div class="listings-page" style="min-height: 65vh;">

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
      <q-btn color="primary" label="Reset search" @click="resetListings"/>
    </div>

    <div v-else>
      <div class="filter-menu row justify-between q-px-xl q-pt-lg" style="align-items: center;">
        <div class="row col-8 col-xs-12 col-sm-8">
          <q-select class="q-mr-xl col-4 col-xs-12 col-sm-4 q-mt-md" v-model="priceSort" filled label="Sort by price"
                    :options="['Price low to high', 'Price high to low']"></q-select>
          <q-select class="q-mr-xl col-4 col-xs-12 q-mt-md col-sm-4" v-model="dateSort" filled label="Sort by date"
                    :options="['Date newest to oldest', 'Date oldest to newest']"></q-select>
          <div @click="showFilter" class="col-1" style="display: flex; align-items: center; cursor: pointer;"><span>Filter</span> <q-icon class="q-ml-md" size="sm" name="list" /></div>
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
    <q-drawer
      v-model="filterMenu"
      :width="300"
      :breakpoint="500"
      content-class="bg-grey-2"
    >
      <div class="drawer-wrapper" >
        <div class="filter-row">
          <div class="menu-name">Filter by price</div>
          <div class="price-filter">
            <q-input @click="filterOptions.minPrice = undefined" v-model="filterOptions.minPrice" label="Min" type="number">
              <template v-slot:prepend>
                <div style="font-size: .8em;">$</div>
              </template>
            </q-input>
            <q-input @click="filterOptions.maxPrice = undefined" v-model="filterOptions.maxPrice" label="Max" type="number">
              <template v-slot:prepend>
                <div style="font-size: .8em;">$</div>
              </template>
            </q-input>
          </div>
        </div>
        <div class="filter-row">
          <div class="menu-name">Search By Location</div>

        </div>
        <div class="filter-row">
          <div class="menu-name">Filter by category</div>
          <div class="category-filter" style="height: 300px; overflow: scroll; margin: 20px 0;">
            <div v-for="(cat, idx) of categories" :key="idx">
              <q-checkbox @input="toggleCategory(cat)" keep-color :value="filterOptions.categories.includes(cat)" :label="cat" color="cyan" />
            </div>
          </div>
        </div>
        <div class="filter-row">
          <div class="menu-name">Filter by condition</div>
          <div class="condition-filter" style="height: 170px; overflow: scroll; margin: 20px 0;">
            <div v-for="(con, idx) of conditions" :key="idx">
              <q-checkbox @input="toggleCondition(con)" keep-color :value="filterOptions.conditions.includes(con)" :label="con" color="cyan" />
            </div>
          </div>
        </div>
        <div class="buttons-wrapper">
          <q-btn @click="resetListings" color="red" label="Reset" />
          <q-btn @click="apply" color="secondary" label="Apply filters" />
        </div>
      </div>
    </q-drawer>
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
        dateSort: '',
        priceSort: '',
        filterMenu: true,
        filterOptions: {
          minPrice: 0,
          maxPrice: 0,
          categories: [],
          conditions: []
        },
        applyFilters: false,
        conditions: ['New', 'Like New', 'Used', 'Worn'],
        categories: ['Knives', 'Rifle', 'AssaultRifle', 'Handgun', 'SubmachineGun', 'Hunting', 'Magazines', 'Scopes', 'Other', 'AssaultAmmo', 'HandgunAmmo.', 'RifleAmmo', 'ShotgunAmmo', 'SubmachineAmmo', 'Misc' ],

      }
    },
    mounted(){
      this.createAnalytic({reqFrom: 'listings'});
    },
    computed: {
      ...mapState('listings', {
        isPending: 'isFindPending'
      }),
      sort() {
        return {
          price: this.priceSort === 'Price low to high' ? 1 : -1,
          createdAt: this.dateSort === 'Date newest to oldest' ? -1 : 1
        }
      },
      listingQuery() {
        let q = {
          archived: false,
          sold: false,
          title: {$regex: `(?i).*${this.$lget(this.$route.query, 'search', '').length > 0 ? this.$route.query.search : ''}.*`},
          category: {[this.filterOptions.categories.length > 0 ? '$in' : '$regex']: this.filterOptions.categories.length === 0 ? `(?i).*${this.$lget(this.$route.query, 'category', '').length > 0 ? this.$route.query.category : ''}.*` : this.filterOptions.categories},
          price: { $lte: this.applyFilters && this.filterOptions.maxPrice > 0 ? this.filterOptions.maxPrice : 1000000, $gte: this.applyFilters && this.filterOptions.minPrice > 0? this.filterOptions.minPrice : 0 },
          condition: { $in: this.filterOptions.conditions.length === 0 ? this.conditions : this.filterOptions.conditions },
          $sort: this.sort,
        };
        return q;
      }
    },
    methods: {
      ...mapActions('analytics', {
        createAnalytic: 'create'
      }),
      toggleCondition(con){
        if(!this.filterOptions.conditions.includes(con)){
          this.filterOptions.conditions.push(con);
        } else {
          this.filterOptions.conditions = this.filterOptions.conditions.filter(co => {
            return co !== con;
          })
        }
      },
      toggleCategory(cat){
        if(!this.filterOptions.categories.includes(cat)) {
          this.filterOptions.categories.push(cat);
        } else {
          this.filterOptions.categories = this.filterOptions.categories.filter(ca => {
            return ca !== cat;
          })
        }
        console.log(this.filterOptions.categories);
      },
      apply(){
        this.applyFilters = true;
      },
      showFilter(){
        if(this.$lget(this.$route.query, 'search') || this.$lget(this.$route.query, 'category')){
          this.$router.push({name: 'listings'})
        }
        this.filterMenu = !this.filterMenu;

      },
      handlePagination(event) {
        this.listingsHandlePageChange(event);
      },
      changePage(type) {
        if (type === 'minus') {
          this.listingsHandlePageChange(this.listingsCurrentPage - 1);
        } else if (type === 'add') {
          this.listingsHandlePageChange(this.listingsCurrentPage + 1);
        }
      },
      resetListings(){
        this.filterMenu = false;
        this.applyFilters = false;
        this.filterOptions = {
          minPrice: 0,
          maxPrice: 0,
          categories: [],
          conditions: []
        };
        this.dateSort = '';
        this.priceSort = '';
        if(this.$lget(this.$route.query, 'search') || this.$lget(this.$route.query, 'category')){
          this.$router.push({name: 'listings'})
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .filter-menu {
    margin-top: 10px;
  }
  .drawer-wrapper {
    height: fit-content;
  }
  .drawer-wrapper::-webkit-scrollbar {
    display: none;
  }

  .pagination-wrapper {
    display: flex;
    align-items: center;
    width: 70vw;
    margin: 0 auto;
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
    width: 75vw;
    overflow-x: hidden;
    margin: 0 auto;
  }

  .listings-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    justify-items: center;
    grid-gap: 40px;
    margin: 0 auto;
    padding: 50px 20px;
  }

  .no-results {
    text-align: center;
    font-size: 2em;
    margin-top: 150px;
  }

  @media screen and (max-width: 1250px) {
    .listings-wrapper {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }

  @media screen and (max-width: 900px) {
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
    .listings-page {
      width: 100vw;
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
  .drawer-wrapper {
    height: 100%;
    border-right: 1px solid #343131;

    .filter-row {
      .menu-name {
        font-size: 1.15em;
        margin: 8px;
        padding-top: 8px;
      }

      .price-filter {
        display: flex;
        padding: 0 5px;
        justify-content: space-between;
      }
    }
  }
  .buttons-wrapper {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
  }
</style>

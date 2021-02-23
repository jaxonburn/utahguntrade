import {makeFindMixin} from 'feathers-vuex';
const $lcamelCase = require('lodash.camelcase');
export default function makeFindPaginateMixin(
  {
    limit = 10,
    skip = 0,
    query = {},
    params = {},
    infinite = false,
    service,
    name,
    qid = 'default',
    watch = true,
    makeFindMixinOptions = {}
  } = {}) {
  const prefix = $lcamelCase(name || service);
  makeFindMixinOptions = JSON.parse(JSON.stringify({
    service: service,
    name: name,
    qid: qid,
    watch: watch,
    ...makeFindMixinOptions,
  }));
  let mixin = {
    mixins: [makeFindMixin(makeFindMixinOptions),],
    data() {
      return {
        [`${prefix}Limit`]: limit,
        [`${prefix}Skip`]: skip,
      };
    },
    computed: {
      [`${prefix}Pages`]() {
        let mostRecent = this.$lget(this[`${prefix}PaginationData`], `${qid}.mostRecent`);
        if (mostRecent) {
          return Math.ceil(mostRecent.total / this[`${prefix}Limit`]);
        } else {
          return 1;
        }
      },
      [`${prefix}CurrentPage`]() {
        let mostRecent = this.$lget(this[`${prefix}PaginationData`], `${qid}.mostRecent`);
        if (mostRecent) {
          return this[`${prefix}Skip`] >= mostRecent.total ? 1 : this[`${prefix}Skip`] / this[`${prefix}Limit`] + 1;
        } else {
          return 1;
        }
      },
      [`${prefix}Params`]() {
        let apiQuery = {};
        let mostRecent = this.$lget(this[`${prefix}PaginationData`], `${qid}.mostRecent`);
        if (this.$lget(this[`${prefix}PaginationData`], `${qid}.mostRecent`)) {
          apiQuery._id = {
            $in: this.$lget(this[`${prefix}PaginationData`], [qid, mostRecent.queryId, mostRecent.pageId, 'ids'], [])
          };
          if (infinite) {
            apiQuery = this.$lget(this[`${prefix}PaginationData`], [qid, mostRecent.queryId, 'queryParams'], {});
            delete apiQuery['$client'];
          }
        }
        return {
          query: apiQuery
        };
      },
      [`${prefix}FetchParams`]() {
        return {
          query: {
            ...this[`${prefix}QueryCust`],
            $limit: this[`${prefix}Limit`],
            $skip: this[`${prefix}Skip`],
          },
          ...this[`${prefix}QueryParamsCust`]
        };
      },
      prefix(){
        return prefix;
      }
    },
    methods: {
      [`${prefix}HandlePageChange`](page) {
        this[`${prefix}Skip`] = (page - 1) * this[`${prefix}Limit`];
        this.$emit('page', page);
      },
    }
  };
  mixin.computed[`${prefix}QueryCust`] = typeof query === 'function' ? query : () => query;
  mixin.computed[`${prefix}QueryParamsCust`] = typeof params === 'function' ? params : () => params;
  return mixin;
}

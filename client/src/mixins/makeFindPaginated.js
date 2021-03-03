import {makeFindMixin} from 'feathers-vuex';

const $lcamelCase = require('lodash.camelcase');
const $lupperFirst = require('lodash.upperfirst');
const $lomitBy = require('lodash.omitby');
const $lisNil = require('lodash.isnil');

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
  if (typeof service === 'function' && !name) name = 'service';
  const prefix = $lcamelCase(name || service);
  const capitalized = $lupperFirst($lcamelCase(name || service));

  makeFindMixinOptions = $lomitBy({
    service: service,
    name: name,
    qid: qid,
    watch: watch,
    ...makeFindMixinOptions,
  }, $lisNil);

  let mixin = {
    mixins: [makeFindMixin(makeFindMixinOptions)],
    data() {
      return {
        [`${prefix}Limit`]: limit,
        [`${prefix}Skip`]: skip,
      };
    },
    computed: {
      [`${prefix}Pages`]() {
        let prefixQid = this[`${prefix}Qid`];
        let mostRecent = this.$lget(this[`${prefix}PaginationData`], `${prefixQid}.mostRecent`);
        if (mostRecent) {
          return Math.ceil(mostRecent.total / this[`${prefix}Limit`]);
        } else {
          return 1;
        }
      },
      [`${prefix}CurrentPage`]: {
        get() {
          let prefixQid = this[`${prefix}Qid`];
          let mostRecent = this.$lget(this[`${prefix}PaginationData`], `${prefixQid}.mostRecent`);
          if (mostRecent) {
            return this[`${prefix}Skip`] >= mostRecent.total || this[`${prefix}`].length >= mostRecent.total ? 1 : this[`${prefix}Skip`] / this[`${prefix}Limit`] + 1;
          } else {
            return 1;
          }
        },
        set(page) {
          this[`${prefix}HandlePageChange`](page);
        }
      },
      [`${prefix}Params`]() {
        let apiQuery = {};
        let prefixQid = this[`${prefix}Qid`];
        let mostRecent = this.$lget(this[`${prefix}PaginationData`], `${prefixQid}.mostRecent`);
        if (mostRecent) {
          apiQuery._id = {
            $in: this.$lget(this[`${prefix}PaginationData`], [prefixQid, mostRecent.queryId, mostRecent.pageId, 'ids'], [])
          };
          if (infinite) {
            apiQuery = this.$lget(this[`${prefix}PaginationData`], [prefixQid, mostRecent.queryId, 'queryParams'], {});
            delete apiQuery['$client'];
          }
          let sort = this.$lget(this, `${prefix}QueryCust.$sort`)
          if (sort) {
            apiQuery.$sort = sort;
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
      [`${prefix}Total`]() {
        let prefixQid = this[`${prefix}Qid`];
        return this.$lget(this[`${prefix}PaginationData`], [prefixQid, 'mostRecent', 'total'], 0);
      },
      [`${prefix}Prefix`]() {
        return prefix;
      }
    },
    methods: {
      [`${prefix}HandlePageChange`](page) {
        this[`${prefix}Skip`] = (page - 1) * this[`${prefix}Limit`];
        this.$emit('page', page);
      },
      [`${prefix}Refresh`]() {
        return this[`find${capitalized}`]()
          .then(res => {
            console.log(`${prefix}Refresh res:`, res);
            return res;
          })
          .catch(err => {
            console.log(`${prefix}Refresh err:`, err);
            return err;
          });
      },
    }
  };

  mixin.computed[`${prefix}QueryCust`] = typeof query === 'function' ? query : () => query;
  mixin.computed[`${prefix}QueryParamsCust`] = typeof params === 'function' ? params : () => params;

  return mixin;
}

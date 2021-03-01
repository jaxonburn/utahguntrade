import { mapGetters } from 'vuex';

const Premium = {
  // eslint-disable-next-line no-unused-vars
  install(Vue, options){
    Vue.mixin({
      computed: {
        ...mapGetters('auth', {user: 'user'}),
      },
      methods: {
        stripeCustomer(){
          console.log(this.user);
        },
      }
    });
  }
};

export default Premium;

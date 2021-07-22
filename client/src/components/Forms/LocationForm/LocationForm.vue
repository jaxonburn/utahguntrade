<template>
  <div class="flex flex-center">
    <q-form autocomplete="off">
      <q-select
        autocomplete="off"
        filled
        transition-show="scale"
        transition-hide="scale"
        v-model="location"
        clearable
        use-input
        hide-selected
        fill-input
        input-debounce="500"
        label="Search City or Postal"
        :options="options"
        :option-label="opt => Object(opt) === opt ? $lget(opt, 'address.freeformAddress', '') : ''"
        emit-value
        @filter="loadAddress"
        @filter-abort="abortFilterFn"
        style="min-width: 250px;"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </q-form>
  </div>
</template>

<script>
  import {mapActions, mapGetters, mapState} from 'vuex';

  export default {
    name: 'LocationForm',
    props: {
      address: {
        type: Object,
        required: false
      }
    },
    mounted(){
      if(!this.address) return;
      this.location = this.address;
    },
    data() {
      return {
        location: '',
        options: [],
        geoLoading: true,
      }
    },
    watch: {
      address: {
        deep: true,
        handler(newVal){
          if(!Object.keys(newVal).length){
            this.location = {}
          }
        }
      },
      location: {
        deep: true,
        handler(newVal){
          if(newVal && Object.keys(newVal).length){
            this.$emit('input', newVal);
          }

        }
      }
    },
    methods: {
      ...mapActions('tomtom', {
        loadAddresses: 'find',
      }),
      abortFilterFn () {
        // console.log('delayed filter aborted')
      },
      loadAddress(val, update, abort){
        if(val !== ''){
          this.loadAddresses({query: {text: val}}).then((res) => {
            this.options = res.data;
            setTimeout(() => {
              update(
                () => {
                    this.options = res.data
                },

                // next function is available in Quasar v1.7.4+;
                // "ref" is the Vue reference to the QSelect
                ref => {
                  if (val !== '' && ref.options.length > 0) {
                    ref.setOptionIndex(-1) // reset optionIndex in case there is something selected
                    ref.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
                  }
                }
              )
            }, 300)
          }).catch((err) => {
            console.log(err);
            this.geoLoading = false;
          })
        }
      }
    }
  };
</script>

<style scoped>

</style>

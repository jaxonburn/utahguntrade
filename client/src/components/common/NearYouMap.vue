<template>
<!--  :style="$q.screen.lt.md ? 'height: 400px;display: flex; flex-direction: column;' : 'height: 400px;display: flex; flex-direction: row;'"-->
  <div class="map-wrapper">
    <div>
      <q-card class="q-ma-xl" style="height: 300px;">
        <q-card-section class="text-lg text-mb-lg text-weight-medium flex justify-center">
          See Gun Listings Near You
        </q-card-section>
        <q-card-section>
          <location-form></location-form>
          <div class="row" style="display: flex; justify-content: center;align-items: center;">
            <q-select rounded outlined label="Radius" v-model="radius" class="q-my-lg"
                      :options="[5, 10, 15, 20, 25, 30, 40,  50, 75, 100]" style="width: 100px;"></q-select>
            <div class="text-weight-bold text-md text-mb-md q-ml-lg">miles</div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div id="tomtom" class="q-mx-sm flex flex-center tom-tom"></div>
  </div>
</template>

<script>
  import tt from '@tomtom-international/web-sdk-maps';
  import LocationForm from 'components/Forms/LocationForm/LocationForm';

  export default {
    name: 'NearYouMap',
    components: {LocationForm},
    mounted() {
      let map = tt.map({
        key: 'GMC0kbMxjXm2blWcDoTtsg8WGhicEIaJ',
        container: 'tomtom',
        zoom: 5.75,
        center: [-111.0937, 39.3210],
      });
    },
    data(){
      return {
        radius: 5
      }
    }
  };
</script>

<style scoped>
  .map-wrapper {
    display: flex;
    width: 100vw;
    justify-content: space-around;
  }
  .tom-tom {
    flex: .7;
  }
</style>

<template>
  <!--  :style="$q.screen.lt.md ? 'height: 400px;display: flex; flex-direction: column;' : 'height: 400px;display: flex; flex-direction: row;'"-->
  <div class="map-wrapper" :style="$q.screen.lt.md ? 'grid-template-rows: 1fr 1fr;' : 'grid-template-columns: 1fr 1fr;'">
    <div class="flex flex-center">
      <q-card :style="$q.screen.lt.md ? 'width: 350px;' : 'width: 700px'">
        <transition name="slide-fadeBack" appear >
        <div v-if="!this.locationLoading">
        <q-card-section class="text-lg text-mb-lg text-weight-medium flex justify-center">
          See Gun Listings Near You
        </q-card-section>
        <q-card-section>
          <location-form @input="setAddress"></location-form>
          <div class="row" style="display: flex;justify-content: center;">
            <q-select rounded outlined label="Radius" v-model="radius" class="q-my-lg"
                      :options="[5, 10, 15, 20, 25, 30, 40,  50, 75, 100, 150]" style="min-width: 125px;"></q-select>
            <div class="text-weight-bold text-sm text-mb-sm q-ml-sm flex items-end q-mb-lg">miles</div>
          </div>
          <div class="flex justify-end">
            <q-btn label="Search" class="text-white bg-secondaryGradient" icon-right="search" @click="createRadius"></q-btn>
          </div>
        </q-card-section>
        </div>
        </transition>
        <transition name="slide-fadeBack" appear>
        <div v-if="locationLoading" class="flex flex-center" style="display: flex; flex-direction: column;">
          <vLottiePlayer
            name="LocationAnimation"
            loop
            :animationData="require('../../assets/LottieAnimations/LocationLoading.json')"
            width="300px"
            height="300px"
          />
          <div class="text-sm text-mb-sm text-weight-light text-center">Loading Listings...</div>
        </div>
        </transition>
      </q-card>
    </div>
    <div id="tomtom" class="flex flex-center tom-tom"></div>
  </div>
</template>

<script>
  import tt from '@tomtom-international/web-sdk-maps';
  import LocationForm from 'components/Forms/LocationForm/LocationForm';
  import VueLottiePlayer from "vue-lottie-player";
  import {mapActions} from 'vuex';
  import turf from '@turf/circle'

  export default {
    name: 'NearYouMap',
    components: {LocationForm, vLottiePlayer: VueLottiePlayer},
    mounted() {
      this.loadListings({$limit: 50, sort: {createdAt: -1}}).then((res) => {
        tt.setProductInfo('UtahGunTrade', '1.0');
        this.map = tt.map({
          key: 'GMC0kbMxjXm2blWcDoTtsg8WGhicEIaJ',
          container: 'tomtom',
          center: [-112.0937, 40],
          zoom: 6.2,
        });
        this.map.addControl(new tt.FullscreenControl());
        this.map.addControl(new tt.NavigationControl());
        res.data.map((listing) => {
          if(listing.address){
            this.createMarker([this.$lget(listing, 'address.position.lon' , 0), this.$lget(listing, 'address.position.lat', 0)], '#FFFFFF', `${listing.title} $${listing.price}`);
          }
        })
      });
      this.locationLoading = false;
    },
    data() {
      return {
        radius: 5,
        map: '',
        address: '',
        locationLoading: true,
        listingsNearYou: [],
      }
    },
    methods: {
      ...mapActions('listings', {
        loadListings: 'find',
      }),
      setAddress(location) {
        this.address = location;
        console.log(location.position.lat, location.position.lon)
      },
      createRadius() {
        if(this.address !== ''){
          this.listingsNearYou = [];
          this.locationLoading = true;
          let center = [this.address.position.lon, this.address.position.lat];
          let radius = this.radius;
          let options = {steps: 30, units: 'miles', properties: {}};
          let circle = turf(center, radius, options);
          console.log('circle', circle);
          this.$store.dispatch('listings/find', {
            query:
                {point:
                      {
                        $geoWithin: {
                          $geometry: {
                            ...circle.geometry
                          }
                        }
                      }
                }
          }).then((res) => {
            this.listingsNearYou = res.data;
          }).catch((err) => {
            console.log(err);
          })
          this.map.addLayer({
            'id': 'overlay',
            'type': 'fill',
            'source': {
              'type': 'geojson',
              'data': circle
            },
            'layout': {},
            'paint': {
              'fill-color': '#db356c',
              'fill-opacity': 0.5,
              'fill-outline-color': 'black'
            }
          });
          setTimeout(() => {
            this.locationLoading = false;
          }, 1500)
        }else {
          this.$q.notify({
            type: 'info',
            message: 'Put in a zip code or city to search'
          })
        }

      },
      createMarker(position, color, popupText) {
        var markerElement = document.createElement('div');
        markerElement.className = 'marker';

        var markerContentElement = document.createElement('div');
        markerContentElement.className = 'marker-content';
        markerContentElement.style.backgroundColor = color;
        markerElement.appendChild(markerContentElement);

        var iconElement = document.createElement('div');
        iconElement.className = 'marker-icon';
        iconElement.style.backgroundImage =
          'url(https://guntrade.s3-us-west-1.amazonaws.com/STATICSAVE/isometriclocation.png)';
        markerContentElement.appendChild(iconElement);

        var popup = new tt.Popup({offset: 30}).setText(popupText);
        // add marker to map
        new tt.Marker({element: markerElement, anchor: 'bottom'})
          .setLngLat(position)
          .setPopup(popup)
          .addTo(this.map);
      }
    }
  };
</script>

<style scoped>

  .map-wrapper {
    display: grid;
    justify-items: stretch;
    align-content: space-evenly;
    grid-column-gap: 60px;
    width: 100%;
  }

  .tom-tom {
    width: 600px;
  }

</style>

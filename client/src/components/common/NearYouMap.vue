<template>
  <div>
    <div class="map-wrapper"
         :style="$q.screen.lt.md ? 'grid-template-rows: 1fr 1fr;' : 'grid-template-columns: 1fr 1fr;'">
      <div class="flex flex-center">
        <q-card :style="$q.screen.lt.md ? 'width: 350px;' : 'width: 700px'" class="cardContainer">
            <div>
              <q-card-section class="text-lg text-mb-lg text-weight-medium flex justify-center">
                See Gun Listings Near You
              </q-card-section>
              <q-card-section>
                <location-form @input="setAddress"></location-form>
                <div class="row" style="display: flex;justify-content: center;">
                  <q-select rounded outlined label="Radius" v-model="radius" class="q-my-lg"
                            :options="[5, 10, 15, 20, 25, 30, 40,  50, 75, 100, 150]"
                            style="min-width: 125px;"></q-select>
                  <div class="text-weight-bold text-sm text-mb-sm q-ml-sm flex items-end q-mb-lg">miles</div>
                </div>
                <div class="flex justify-end">
                  <q-btn label="Search" class="text-white bg-primaryGradient" icon-right="search"
                         @click="createRadius"></q-btn>
                </div>
              </q-card-section>
            </div>
          <q-inner-loading :showing="locationLoading">
            <q-spinner size="50px" color="primary" />
          </q-inner-loading>
        </q-card>
      </div>
      <div id="tomtom" class="flex flex-center" :style="$q.screen.lt.md ? 'width: 100vw;' : 'width: 40vw;' "></div>
    </div>
    <div v-if="listingsNearYou.length > 0">
      <div style="width: 100%;display: flex; justify-content: center; align-items: center;height: 50px;"
           class="q-my-lg bg-accent text-white nameFont">We found
        {{ listingsNearYou.length === 5 ? listingsNearYou.length + '+' : listingsNearYou.length }} listings in your
        area.
      </div>
      <div class="listings-wrapper">
          <listing v-for="(listing,idx) in listingsNearYou" :key="idx" :listing="listing">

          </listing>
<!--        <q-list bordered separator style="width: 80%;border-radius: 15px;" class="bg-white q-ma-md boxShadow">-->
<!--          <q-item clickable v-ripple  @click="$router.push(`listing-details/${listing._id}`)">-->
<!--          </q-item>-->
<!--        </q-list>-->
      </div>
    </div>
  </div>
</template>

<script>
  import tt from '@tomtom-international/web-sdk-maps';
  import LocationForm from 'components/Forms/LocationForm/LocationForm';
  import {mapActions} from 'vuex';
  import turf from '@turf/circle'
  import Listing from 'components/common/Listing';

  export default {
    name: 'NearYouMap',
    components: {Listing, LocationForm},
    mounted() {
      this.loadListings({$limit: 100, sort: {createdAt: -1}, query: {sold: false, archived: false}}).then((res) => {
        tt.setProductInfo('UtahGunTrade', '1.0');
        this.map = tt.map({
          key: process.env.TOMTOM_API_KEY,
          container: 'tomtom',
          center: [-112.0937, 40],
          zoom: 6.2,
        });
        this.map.addControl(new tt.FullscreenControl());
        this.map.addControl(new tt.NavigationControl());
        res.data.map((listing) => {
          if (listing.address) {
            this.createMarker([this.$lget(listing, 'address.position.lon', 0), this.$lget(listing, 'address.position.lat', 0)], '#FFFFFF', `<a href="listing-details/${listing._id}">${listing.title}</a> $${listing.price}`);
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
      },
      createRadius() {
        if (this.address !== '') {
          this.listingsNearYou = [];
          this.locationLoading = true;
          let center = [this.address.position.lon, this.address.position.lat];
          let radius = this.radius;
          let options = {steps: 30, units: 'miles', properties: {}};
          let circle = turf(center, radius, options);

          this.$store.dispatch('listings/find', {
            query:
              {
                sold: false,
                archived: false,
                $limit: 10,
                point:
                  {
                    $geoWithin: {
                      $geometry: {
                        ...circle.geometry
                      }
                    }
                  }
              }
          }).then((res) => {
            setTimeout(() => {
              this.locationLoading = false;
              this.listingsNearYou = res.data;
            }, 1500)
            console.log(this.listingsNearYou);
          }).catch((err) => {
            console.error(err);
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
        } else {
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

        // var popup = new tt.Popup({offset: 30}).setText(popupText);
        var popup = new tt.Popup({offset: 30}).setHTML(popupText);
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
  .nameFont {
    font-family: "KuchekMedium", Times, Serif;
    line-height: 1em;
    font-weight: 600;
    font-size: 1.4em;
  }

  .map-wrapper {
    display: grid;
    justify-items: stretch;
    align-content: space-evenly;
    grid-column-gap: 80px;
    width: 100%;
  }

  .cardContainer {
    height: 450px;
    display: flex;
    justify-content: center;
    align-items: center;
  }


  .listings-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    justify-items: center;
    grid-gap: 40px;
    margin: 0 auto;
    padding: 50px 20px;
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
  }

  @media screen and (max-width: 500px) {
    .listings-wrapper {
      grid-template-columns: 1fr;
    }
  }
</style>

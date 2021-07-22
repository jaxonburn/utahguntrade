<template>
  <div style="display: flex; flex-direction: column;width: 100%;">
    <div v-if="$route.path !== '/register'" class="dropdownContainer cursor-pointer" @click="tabOpen = !tabOpen">
      <div class="dropdownTabs text-xs">
        Trade
      </div>
      <div class="dropdownTabs text-xs">
        Connect
      </div>
      <div class="dropdownTabs text-xs">
        Educate
      </div>
    </div>
    <slide-up-down :active="tabOpen" :duration="800">
      <div class="text-black tabContainer">
        <div style="height: 100%;">
          <div style="height: 100%;">
            <div class="titleFont text-sm text-mb-sm" style="border-bottom: 1px solid black;width: 80%;">
              <span>Marketplace</span>
            </div>
            <div class="q-mt-md" style="display: grid; grid-template-rows: 1fr 1fr;height: 70%;grid-row-gap: 8px;">
              <div style="display: flex; flex-direction: row;" >
                <q-card style="width: 40%;background: rgba(225, 225, 225, 0.8);height: 100%;" class="q-mr-sm">
                  <q-card-section>
                    Rifles
                  </q-card-section>
                </q-card>
                <q-card style="width: 40%;background: rgba(225, 225, 225, 0.8);height: 100%;">
                  <q-card-section>
                    Rifles
                  </q-card-section>
                </q-card>
              </div>


              <div style="display: flex; flex-direction: row;">
                <q-card style="width: 40%;background: rgba(225, 225, 225, 0.8);height: 100%;" class="q-mr-sm">
                  <q-card-section>
                    Rifles
                  </q-card-section>
                </q-card>
                <q-card style="width: 40%;background: rgba(225, 225, 225, 0.8);height: 100%;">
                  <q-card-section>
                    Rifles
                  </q-card-section>
                </q-card>
              </div>


            </div>
          </div>
        </div>

        <div style="height: 100%;">
          <div style="height: 100%;">
            <div class="titleFont text-sm text-mb-sm" style="border-bottom: 1px solid black;width: 80%;">
              <span>Social</span>
            </div>
            <div class="q-mt-sm">
              <q-list bordered style="width: 80%;" separator class="text-weight-medium">
                <q-item @click="navTo('/messages')" clickable v-ripple>
                  <q-item-section class="text-xs text-mb-xs">Messages</q-item-section>
                  <q-item-section avatar>
                    <q-avatar rounded>
                      <q-img src="../../assets/isometricchat.png"/>
                    </q-avatar>
                  </q-item-section>
                </q-item>
<!--                <q-item clickable v-ripple>-->
<!--                  <q-item-section class="text-xs text-mb-xs">Notifications</q-item-section>-->
<!--                  <q-item-section avatar>-->
<!--                    <q-avatar rounded>-->
<!--                      <q-icon name="fas fa-bell" color="accent" size="md"/>-->
<!--                    </q-avatar>-->
<!--                  </q-item-section>-->
<!--                </q-item>-->
                <q-item clickable v-ripple v-if="user" @click="navTo('/account')">
                  <q-item-section class="text-xs text-mb-xs">Profile</q-item-section>
                  <q-item-section avatar>
                    <q-avatar rounded>
                      <q-img :src="$lget(user, 'avatar', '')"/>
                    </q-avatar>
                  </q-item-section>
                </q-item>
                <q-item clickable v-ripple v-else @click="navTo('/register')">
                  <q-item-section class="text-xs text-mb-xs">Create Account</q-item-section>
                  <q-item-section avatar>
                    <q-avatar rounded>
                      <q-icon color="accent" size="md" name="fas fa-user-circle"></q-icon>
                    </q-avatar>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </div>

        <div style="width: 100%;">
          <div style="height: 100%;">
            <div class="titleFont text-sm text-mb-sm" style="border-bottom: 1px solid black;width: 100%;">
              <span>Resources</span>
            </div>
            <div class="q-mt-sm" style="display: flex; flex-direction: row;width: 100%;">
              <div style="display: flex; flex-direction: column;">
                <q-badge v-if="articles.length" class="titleFont text-sm text-mb-sm" style="text-indent: 0;width: 100%;" color="grey">
                  The Hub News
                </q-badge>
                <div>
<!--                  Newest Article-->
<!--                  <div>-->
<!--                    {{ $lget(articles, '[0].mainTitle', 'Gun Hub') }}-->
<!--                  </div>-->
                </div>
                <q-card v-if="articles.length" class="text-black cursor-pointer" style="width: 100%;" @click="navTo('/articles')">
                  <q-card-section horizontal>
                    <q-img :src="$lget(articles, '[0].mainImage.url', '')"
                           style="height: 100px;max-width: 100px;"></q-img>
                    <q-separator vertical/>
                    <div style="display: flex; flex-direction: column;">
                      <div class="readFont">
                        {{ $lget(articles, '[0].mainTitle', 'Gun Hub') }}
                      </div>
                      <div class="aboutFont q-mb-md">
                        <div>
                          Published {{ $lget(articles, '[0].publishedAt', '')| format }} ago
                        </div>
                      </div>
                      <div class="flex flex-center">
                        <q-icon style="font-size: 1em;" name="fas fa-heart" color="red"></q-icon>
                        <span style="font-size: 1em; margin-left: 5px;">{{
                            $lget(articles, '[0].favorites.length', 0)
                          }}</span>
                        <q-icon style="font-size: 1em;" name="fas fa-comments" color="light-blue" class="q-ml-md"/>
                        <span class="q-ml-xs" style="font-size: 1em; margin-left: 5px;">{{
                            $lget(articles, '[0].comments.length', 0)
                          }}</span>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
              <q-separator vertical class="q-ml-sm"/>
              <div style="display: grid; grid-template-columns: 1fr 0.1fr 1fr;width: 50%;justify-items: center;align-items: center;">
                <div class="text-weight-medium">
                  <router-link to="/bill-of-sale"><div class="q-my-xs cursor-pointer hoverText">Bill Of Sale</div></router-link>
                  <div class="q-my-xs cursor-pointer hoverText">Gun Stores in Utah</div>
                  <div class="q-my-xs cursor-pointer hoverText">Firearm Classes</div>
                  <router-link to="prevent-fraud"><div class="q-my-xs cursor-pointer hoverText">Prevent Fraud</div></router-link>
                </div>
                <q-separator vertical />
                <div class="text-weight-medium">
                  <div class="q-my-xs cursor-pointer hoverText">Our Team</div>
                  <router-link to="/terms"><div class="q-my-xs cursor-pointer hoverText">Terms and Conditions</div></router-link>
                  <router-link to="privacy-policy"><div class="q-my-xs cursor-pointer hoverText">Privacy Policy</div></router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </slide-up-down>
  </div>
</template>

<script>
  import SlideUpDown from 'vue-slide-up-down'
  import {mapGetters} from 'vuex';
  import {makeFindMixin} from 'feathers-vuex';
  import dateUtils from 'src/helpers/dateUtils';

  export default {
    name: 'CategoryDropDown',
    components: {
      SlideUpDown
    },
    filters: {
      format(date) {
        let newDate = new Date(date);
        return dateUtils(newDate);
      }
    },
    props: {
      hide: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      hide: {
        handler(newVal) {
          if (newVal === true) {
            this.tabOpen = false;
          }
        }
      }
    },
    data() {
      return {
        tabOpen: false,
        rifleOptions: [
          'All Rifles',
          'Bolt Action',
          'Lever Action',
          'Muzzleloader',
          'Pump Action',
          'Semi-Auto',
        ],
        pistolOptions: [
          'Handguns',
          'Revolver',
          'Semi-Auto'
        ],
        ammoOptions: [
          '5.56',
          '.223',
          '9mm',
        ]
      }
    },
    mixins: [
      makeFindMixin({
        name: 'articles',
        service: 'articles',
        qid: 'articles'
      })
    ],
    computed: {
      ...mapGetters('auth', {
        user: 'user'
      }),
      articlesParams() {
        return {query: {published: true}}
      }
    },
    methods: {
      navTo(path) {
        this.tabOpen = false;
        if(this.$route.path === path) return;
        this.$router.push(path);
      }
    }
  };
</script>

<style scoped>
  .dropdownTabs {
    color: black;
    font-weight: 500;
  }

  .dropdownContainer {
    display: flex;
    flex-direction: row;
    height: 50px;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
  }

  .titleFont {
    font-family: "KuchekLight", Times, Serif;
    line-height: 1.6em;
    font-weight: 100;
    text-indent: 30px;
  }

  .boldFont {
    font-family: "KuchekMedium", Times, Serif;
    line-height: 1.6em;
    font-weight: 100;
  }

  .tabContainer {
    height: 230px;
    width: 100%;
    display: grid;
    grid-template-columns: 0.7fr 0.5fr 1fr;
  }

  .readFont {
    font-family: "Kuchek", Times, Serif;
    line-height: 1.6em;
    font-size: 1.3em;
    font-weight: 100;
    text-align: center;
  }


  .aboutFont {
    font-family: "KuchekThin", Times, Serif;
    line-height: 1em;
    font-weight: 600;
    font-size: 1em;
    text-align: center;
  }
  .hoverText {
    transition: 0.3s all;
    border-radius: 15px;
  }

  .hoverText:hover {
    padding: 2px 2px;
    background: rgba(225, 225, 225, 0.8);
    color: var(--q-color-primary);
    transform: scale(1.02);
  }
</style>

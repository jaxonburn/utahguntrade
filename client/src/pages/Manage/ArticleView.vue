<template>
  <q-page class="flex justify-center flex-center" ref="fullPage" style="width: 100vw;">
    <q-btn :style="$q.screen.lt.md ?  'position: absolute; top: 15px; left: 10px;' : 'position: absolute;top: 80px; left: 15%;'" icon="keyboard_backspace" @click="$router.go(-1)"/>
    <transition name="slide-fade">
      <div v-show="scroll > 200" class="q-pa-sm aboutAuthorContainer" :style="$q.screen.lt.md ? 'background: rgba(225, 225, 225, 0.9);padding: 5px;' : ''">
        <div style="display: flex; flex-direction: row;align-items: flex-end;border-bottom: 0.5px solid black;" class="q-mb-xs">
          <p class="specialFont" v-html="$lget(article, 'createdBy')" style="font-size: 1.2em;"></p>
        </div>
        <div style="border-bottom: 0.5px solid black;" class="q-mb-xs">
          <p class="aboutFont" style="font-size: 1.2em;" v-html="$lget(article, 'about')"></p>
        </div>

        <div style="display: flex; justify-content: flex-start;" class="q-mt-md">
          <div class="cursor-pointer columnOnly">
            <div @click="addComment" class="commentContainer">
            <vLottiePlayer
              class="cursor-pointer q-mr-sm"
              name="Heart"
              :loop="1"
              :animationData="require('../../assets/LottieAnimations/Comment.json')"
              width="45px"
              height="45px"
              @animControl="grabAnim"
            />
              <div class="specialFont">{{$lget(article, 'comments.length', 0)}}</div>
            </div>
            <div style="display: flex; flex-direction: row; justify-content: space-between;align-items: center;">
            <button @click="likeArticle" id="heartArticle" style="border: none; background: none;margin: 0;padding: 0;outline: none;">
            <vLottiePlayer
              class="cursor-pointer q-mr-sm"
              name="Heart"
              :autoplay="$lget(article, 'favorites', []).includes($lget(user, '._id'))"
              :loop="1"
              :animationData="require('../../assets/LottieAnimations/Heart.json')"
              width="50px"
              height="65px"
              @animControl="grabAnim"
            />
            </button>
              <div class="specialFont">{{$lget(article, 'favorites.length', 0)}}</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div style="height: 100%;width: 100%;" v-if="loadingArticle" class="flex flex-center">
      <q-spinner
        color="primary"
        size="15em"
        :thickness="2"
      />
    </div>
    <div v-else style="height: 100%;" :style="$q.screen.lt.sm ? 'width: 90%' : 'width: 55%;'" class="q-mt-lg">
      <h3 class="text-weight-bold specialFont">{{ article.mainTitle }}</h3>
      <div style="width: 100%;display: flex;align-items: center; flex-direction: row;" class="q-my-md">
        <div style="display: flex; align-items: flex-end;height: 100%;width: 100%; justify-content: space-between;">
          <div :class="$q.screen.lt.md ? 'aboutContainerMobile' : 'aboutContainer'">
            <q-avatar size="50px">
              <q-img :src="$lget(article, 'avatar.url')"/>
            </q-avatar>
            <div class="avatarFont"><span style="white-space: nowrap;">{{ article.createdBy }}</span></div>
            <div v-if="$q.screen.gt.md" class="flex flex-center" style="margin: 7px 7px 10px;">
            <q-icon name="fiber_manual_record" style="font-size: 0.4em;"
                    class="text-grey-7 q-mx-xs"></q-icon>
            </div>
            <div class="readFont"><span style="white-space: nowrap;">{{ timeSince(new Date(article.createdAt)) + ' ago' }}</span></div>
          </div>
          <div class="readFont" style="font-size: 1em;font-weight: 100;">
            <span style="white-space: nowrap;">{{ article.readTime + ' Min Read' }}</span>
          </div>
        </div>
      </div>
      <div style="background-color: rgba(255, 255, 255, 1);">
        <q-img :src="$lget(article, 'mainImage.url')" :alt="article.mainTitle + ' Image'"
             style="vertical-align: center; width: 100%;background-color: rgba(255, 255, 255, 1);" height="auto"/>
      </div>
      <div v-for="(section,index) in article.sections" :key="index">
        <h4 v-if="section.title" class="specialFont">{{ section.title }}</h4>
        <p v-if="section.body" v-html="section.body" class="paragraphFont"></p>
        <div v-if="section.image">
          <q-img :src="section.image.url" :alt="section.image + ' Image'" style="width: 100%; height: 100%;"/>
        </div>
      </div>
      <div style="height: 100px;">
      </div>
    </div>
    <q-dialog v-model="notLoggedIn" :maximized="$q.screen.lt.md">
      <not-logged-in @close="notLoggedIn = !notLoggedIn"></not-logged-in>
    </q-dialog>
    <div class="sticky">
      <q-drawer v-model="commentDrawer" side="right" bordered :maximized="$q.screen.lt.md">
        <Comments :article="clonedArticle" :user="user"></Comments>
      </q-drawer>
    </div>
  </q-page>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex';
  import VueLottiePlayer from "vue-lottie-player";
  import NotLoggedIn from 'components/common/NotLoggedIn';
  import Comments from 'components/Articles/Comments';

  export default {
    name: 'ArticleView',
    components: {
      Comments,
      NotLoggedIn,
      vLottiePlayer: VueLottiePlayer
    },
    created: function () {
      window.addEventListener('scroll', this.foo);
    },
    destroyed: function () {
      window.removeEventListener('scroll', this.foo);
    },
    mounted() {
      this.loadArticles(this.$route.params.id).then((res) => {
        this.article = res;
        setTimeout(() => {
          this.loadingArticle = false;
        }, 700)
      }).catch((err) => {
        this.$q.notify({
          type: 'error',
          message: 'Something went wrong when loading this article, please refresh and try again'
        })
      });
    },
    data() {
      return {
        loadingArticle: true,
        article: {},
        scroll: 0,
        heartItem: {},
        notLoggedIn: false,
        played: false,
        direction: 1,
        commentDrawer: false,
      }
    },
    computed: {
      ...mapState('auth', {
        user: 'user'
      }),
      ...mapGetters('articles', {
        getArticle: 'get'
      }),
      clonedArticle(){
        let article = this.getArticle(this.$route.params.id)
        if(article){
          return this.getArticle(this.$route.params.id).clone();
        }else {
          return {}
        }
      }
    },
    methods: {
      ...mapActions('articles', {
        loadArticles: 'get'
      }),
      addComment(){
        if(!this.user) {
          this.notLoggedIn = !this.notLoggedIn;
        }else {
          this.commentDrawer = !this.commentDrawer;
        }
      },
      likeArticle(){
        let el = document.getElementById('heartArticle');
        el.disabled = true;
        setTimeout(() => {el.disabled = false}, 2150);
        if(!this.user){
          this.notLoggedIn = !this.notLoggedIn;
        }else {
          if(!this.clonedArticle.favorites.includes(this.user._id)){
            this.clonedArticle.favorites.push(this.user._id);
            this.$store.dispatch('articles/patch', [this.clonedArticle._id, {favorites: this.clonedArticle.favorites}]).then((res) => {
              console.log(res);
              this.$q.notify({
                color: 'primary',
                textColor: 'white',
                icon: 'favorite',
                message: 'Favorited',
                position: 'bottom',
                timeout: 3000,
              })
              if(this.direction === -1){
                this.direction = 1;
                this.heartItem.setDirection(1);
              }
              this.heartItem.play();
              setTimeout(() => {
                this.heartItem.pause();
              }, 2150)
            })
          }else {
            this.$store.dispatch(
              'articles/patch',
              [
                this.clonedArticle._id,
                 {$pull: {favorites: this.user._id}}
              ])
              .then((res) => {
                this.$q.notify({
                  color: 'secondary',
                  textColor: 'white',
                  message: 'Unliked',
                  position: 'bottom',
                  timeout: 3000,
                });
              });
            this.heartItem.setDirection(-1);
            this.direction = -1;
            this.heartItem.play();
            setTimeout(() => {
              this.heartItem.pause();
            }, 2150);
          }
        }
      },
      grabAnim($event){
        this.heartItem = $event;
      },
      foo: function () {
        this.scroll = window.scrollY
        if(this.scroll > 200) {
          if (this.clonedArticle.favorites.includes(this.user._id)) {
            if(this.heartItem && !this.played){
              this.heartItem.goToAndStop(55.333, true)
              this.played = true;
            }else if(!this.played){
              setTimeout(() => {
                this.heartItem.goToAndStop(55.333, true)
              }, 400)
              this.played = true;
            }

          }
        }
      },
      timeSince(date) {
        var seconds = Math.floor((new Date() - date) / 1000);
        var interval = seconds / 31536000;
        if (interval > 1) {
          return Math.floor(interval) + " years";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
          return Math.floor(interval) + " months";
        }
        interval = seconds / 86400;
        if (interval > 1) {
          return Math.floor(interval) + " days";
        }
        interval = seconds / 3600;
        if (interval > 1) {
          return Math.floor(interval) + " hours";
        }
        interval = seconds / 60;
        if (interval > 1) {
          return Math.floor(interval) + " minutes";
        }
        return Math.floor(seconds) + " seconds";
      }
    }
  };
</script>

<style scoped>

  .aboutAuthorContainer {
    position: fixed;
    top: 25%;
    left: 5%;
    border-radius: 25px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    z-index: 1000;
  }

  .commentContainer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .avatarFont {
    font-family: "KuchekMedium", Times, Serif;
    line-height: 1.6em;
    font-weight: 350;
    font-size: 1.4em;
  }

  .aboutContainer {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    position: relative;
  }

  .aboutContainerMobile {
    display: flex;
    flex-direction: column;
    position: relative;
  }


  .aboutFont {
    font-family: "KuchekThin", Times, Serif;
    line-height: 1em;
    font-weight: 600;
    font-size: 1em;
  }

  .readFont {
    font-family: "KuchekLight", Times, Serif;
    line-height: 1.6em;
    font-size: 1.3em;
    font-weight: 100;
  }

  .paragraphFont {
    font-family: "Kuchek", Times, Serif;
    line-height: 1.6em;
    font-weight: 400;
    font-size: 1.6em;
  }

  .specialFont {
    font-family: "Kuchek", Times, Serif;
    line-height: 1.2em;
    font-weight: 500;
  }


  .slide-fade-enter-active {
    transition: all 1.5s ease;
  }

  .slide-fade-leave-active {
    transition: all 0.6s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
    transform: translateX(-100px);
  }
</style>

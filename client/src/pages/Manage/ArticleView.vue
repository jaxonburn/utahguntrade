<template>
  <q-page class="flex justify-center" ref="fullPage">
    <q-btn style="position: absolute;top: 80px; left: 15%;" icon="keyboard_backspace" @click="$router.go(-1)"/>
    <transition name="slide-fade">
      <div style="position: fixed; top: 20%;left: 5%;border-radius: 25px;display: flex; justify-content: flex-start; align-items: flex-start;flex-direction: column;z-index: 2000;"
           v-show="scroll > 200" class="q-pa-sm">
        <div style="display: flex; flex-direction: row;align-items: flex-end;border-bottom: 0.5px solid #dedede;" class="q-mb-xs">
          <p class="specialFont" v-html="$lget(article, 'createdBy')"></p>
        </div>
        <div style="border-bottom: 0.5px solid #dedede;" class="q-mb-xs">
          <p class="aboutFont" v-html="$lget(article, 'about')"></p>
        </div>

        <div style="display: flex; justify-content: flex-start;" class="q-mt-md">
          <div class="cursor-pointer" style="display: flex; flex-direction: column;">
            <div @click="addComment" style="display: flex; flex-direction: row; justify-content: space-between;align-items: center;">
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
    <div style="height: 100vh;" :style="$q.screen.lt.sm ? 'width: 95%' : 'width: 55%;'">
      <h2 class="text-weight-bold specialFont">{{ article.mainTitle }}</h2>
      <div style="width: 100%;display: flex;align-items: center; flex-direction: row;" class="q-my-md">
        <div style="display: flex; align-items: flex-end;height: 100%;width: 100%; justify-content: space-between;">
          <div style="display: flex; flex-direction: row;align-items: flex-end;position: relative;">
            <q-avatar size="50px">
              <img :src="$lget(article, 'avatar.url')"/>
            </q-avatar>
            <div class="avatarFont q-mx-sm">{{ article.createdBy }}</div>
            <q-icon name="fiber_manual_record" style="font-size: 0.5em;margin-bottom: 10px;"
                    class="text-grey-7"></q-icon>
            <div class="readFont q-ml-sm">{{ timeSince(new Date(article.createdAt)) + ' ago' }}</div>
          </div>
          <div class="readFont q-mr-md q-mb-xs" style="font-size: 1em;font-weight: 100;">
            {{ article.readTime + ' Min Read' }}
          </div>
        </div>
      </div>
      <div style="background-color: rgba(255, 255, 255, 1);">
        <img :src="$lget(article, 'mainImage.url')" :alt="article.mainTitle + ' Image'"
             style="vertical-align: center; width: 100%;background-color: rgba(255, 255, 255, 1);" height="auto"/>
      </div>
      <div v-for="(section,index) in article.sections" :key="index">
        <h4 v-if="section.title" class="specialFont">{{ section.title }}</h4>
        <p v-if="section.body" v-html="section.body" class="paragraphFont"></p>
        <div v-if="section.image">
          <img :src="section.image.url" :alt="section.image + ' Image'" style="width: 100%; height: 100%;"/>
        </div>
      </div>
      <div style="height: 100px;">
      </div>
    </div>
    <q-dialog v-model="notLoggedIn" :maximized="$q.screen.lt.md">
      <not-logged-in @close="notLoggedIn = !notLoggedIn"></not-logged-in>
    </q-dialog>
    <q-drawer v-model="commentDrawer" side="right" bordered :maximized="$q.screen.lt.md">
      <Comments :article="clonedArticle" :user="user"></Comments>
    </q-drawer>
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
        console.log(this.article);
      }).catch((err) => {
        console.log(err);
      });
    },
    data() {
      return {
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
                  message: 'Unfavorited',
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

  .avatarFont {
    font-family: "KuchekMedium", Times, Serif;
    line-height: 1.6em;
    font-weight: 350;
    font-size: 1.4em;
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

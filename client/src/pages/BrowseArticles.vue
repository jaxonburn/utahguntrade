<template>
  <q-page style="width: 100%;">
    <div :style="$q.screen.lt.md ?  'width: 100%;display: flex; flex-direction: column;': 'width: 100%;display: flex;flex-direction: row'">
      <div
        class="NewestArticle"
        :style="$q.screen.lt.md ? 'width: 100%;': 'width: 60%;'">
        <div
          :style="{backgroundImage: `url(${$lget(articles, '[0].mainImage.url', '')})`,}"
          class="backGroundImage"
        >
          <div class="q-mt-lg text-black text-center readFont"
               style="width: 40%;height: 30px; border-top-right-radius: 15px;border-bottom-right-radius: 15px;background: rgba(215, 215, 215, 0.8)">
            Newest Article
          </div>
        </div>
        <div>

        </div>
        <div class="readFont">
          {{ $lget(articles, '[0].mainTitle', 'Gun Hub') }}
        </div>
        <div class="aboutFont q-mb-md">
          <span>{{ $lget(articles, '[0].createdBy', 'Anonymous') }}</span>
          <q-icon name="fiber_manual_record" style="font-size: 0.6em;" class="q-mx-sm text-accent"></q-icon>
          <span>{{ $lget(articles, '[0].readTime', '10') + ' Minute Read' }}</span>
        </div>
        <div>
          <div style="height: 60px;text-overflow: ellipsis;overflow: hidden;position: relative;font-size: 1.3em;"
               class="q-mx-xl readFont">
            <div v-html="$lget(articles, '[0].sections[0].body', '')"></div>
          </div>
          <div class="flex justify-end">
            <q-btn class="q-mr-lg q-mb-sm bg-accent text-white" push
                   @click="$router.push({name: 'article', params: {id:  articles[0]._id}})">Read More
            </q-btn>
          </div>
        </div>
        <div class="flex justify-between avatarFont q-mx-md q-mb-sm">
          <div class="flex flex-center">
            <q-icon style="font-size: 1.5em;" name="fas fa-heart" color="red"></q-icon>
            <span style="font-size: 1.5em; margin-left: 5px;">{{ $lget(articles, '[0].favorites.length', 0) }}</span>
            <q-icon style="font-size: 1.6em;" name="fas fa-comments" color="light-blue" class="q-ml-md"/>
            <span class="q-ml-xs" style="font-size: 1.5em; margin-left: 5px;">{{ $lget(articles, '[0].comments.length', 0) }}</span>
          </div>
          <div>
            Published {{ $lget(articles, '[0].publishedAt', '')| format }} ago
          </div>
        </div>
      </div>
      <q-separator/>
      <div :style="$q.screen.lt.md ? 'width: 100%' : 'width: 40%;'" class="q-ma-md socialLinksCard">
        <q-card style="width: 100%; height: 50%;display: flex;justify-content: center;flex-direction: column;" flat>
          <q-card-section class="avatarFont" style="display: flex; flex-direction: column;justify-content: center;align-items: center;">
            <span style="font-size: 1.5em;">Go to Utah Gun Hub Community</span>
            <q-btn size="lg" class="q-mt-sm text-white bg-primaryGradient">
              Community
            </q-btn>
          </q-card-section>
          <q-separator/>
          <q-card-section class="aboutFont" style="font-size: 1.7em;display: flex; justify-content: center;border-bottom: 1px solid var(--q-color-primary);">
            See More From Utah Gun Hub
          </q-card-section>
          <q-card-section>
            <social-links>

            </social-links>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-separator/>
    <div style="width: 100%;font-size: 1.5em;display: grid; grid-template-columns: 1fr 1fr 1fr 1fr;">
    </div>
  </q-page>
</template>

<script>
  import {makeFindMixin} from 'feathers-vuex';
  import dateUtils from 'src/helpers/dateUtils';
  import instagramLogo from '../assets/Logos/instagramLogo.jpg';
  import SocialLinks from 'components/common/SocialLinks';

  export default {
    name: 'BrowseArticles',
    components: {SocialLinks},
    filters: {
      format(date) {
        let newDate = new Date(date);
        return dateUtils(newDate);
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
      articlesParams() {
        return {query: {published: true}}
      }
    }
  };
</script>

<style scoped>

  .socialLinksCard {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .NewestArticle {
    height: 500px;
    border-right: 0.5px solid #bfbfbf;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }

  .backGroundImage {
    height: 70%;
    width: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }

  .readFont {
    font-family: "Kuchek", Times, Serif;
    line-height: 1.6em;
    font-size: 1.3em;
    font-weight: 100;
    text-align: center;
  }

  .avatarFont {
    font-family: "KuchekMedium", Times, Serif;
    line-height: 1.6em;
    font-weight: 350;
    font-size: 1em;
  }


  .aboutFont {
    font-family: "KuchekThin", Times, Serif;
    line-height: 1em;
    font-weight: 600;
    font-size: 1em;
    text-align: center;
  }



</style>

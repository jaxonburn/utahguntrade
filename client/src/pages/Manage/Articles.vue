<template>
  <q-page>
    <div style="height: 60px;" class="bg-blue-grey-3 flex justify-end">
      <q-btn outline label="Create Article" class="text-primary bg-white q-ma-sm" size="md" icon="add" @click.stop="createArticle = !createArticle"/>
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr;">
      <q-card v-for="(article,index) in articles" :key="index" class="q-ma-lg">
        <q-card-section>
          <img :src="article.mainImage.url"  style="height: 200px" width="100%"/>
        </q-card-section>
          <q-card-section class="text-black">
          {{article.mainTitle}}
          </q-card-section>
      </q-card>
    </div>
    <q-dialog v-model="createArticle" maximized>
      <article-form @close="createArticle = false"></article-form>
    </q-dialog>
  </q-page>
</template>

<script>
  import ArticleForm from 'components/Forms/ArticleForms/ArticleForm';
  import {makeFindMixin} from 'feathers-vuex';

  export default {
    name: 'Articles',
    mixins: [makeFindMixin({
      service: 'articles',
      name: 'articles',
      qid: 'articles',
    })],
    components: {
      ArticleForm
    },
    data(){
      return {
        createArticle: false,
      }
    },
    computed: {
      articlesParams(){
        return {};
      }
    }
  };
</script>

<style scoped>

</style>

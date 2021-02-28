<template>
  <q-page>
    <div style="height: 60px;" class="bg-blue-grey-3 flex justify-end">
      <q-btn outline label="Create Article" class="text-primary bg-white q-ma-sm" size="md" icon="add"
             @click.stop="createArticle = !createArticle"/>
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr;">
      <q-card v-for="(article,index) in articles" :key="index" class="q-ma-lg">
        <q-card-section>
          <img :src="article.mainImage.url" style="height: 200px" width="100%"/>
        </q-card-section>
        <q-card-section class="text-black row flex justify-between">
          <div>{{ article.mainTitle }}</div>
          <div class="flex justify-evenly">
            <q-icon name="fas fa-pen-alt" color="black" size="sm" class="cursor-pointer"
                    @click="publishArticle(article)"/>
            <q-icon name="visibility" color="black" size="sm" class="cursor-pointer"
                    @click="$router.push('articles/' + article._id)"/>
            <q-icon name="delete" color="red" size="sm" class="cursor-pointer" @click="article.remove()"/>
          </div>
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
    data() {
      return {
        createArticle: false,
      }
    },
    computed: {
      articlesParams() {
        return {};
      }
    },
    methods: {
      publishArticle(article) {
        if (article.published) {
          this.$q.dialog({
            title: 'Are you sure you want to unpublish?',
            message: 'This will remove it from the live site',
            cancel: true,
            ok: {
              push: true,
              color: 'secondary',
              label: 'Unpublish'
            }
          }).onOk(async () => {
            article.published = !article.published;
            article.publishedAt = new Date();
            article.save().then((res) => console.log(res))
          })
        } else {
          this.$q.dialog({
            title: 'Are you sure you want to publish this?',
            message: 'Once published it will be live for users to see.',
            cancel: true,
            ok: {
              push: true,
              color: 'secondary',
              label: 'Publish'
            }
          }).onOk(async () => {
            article.published = !article.published;
            article.publishedAt = new Date();
            article.save().then((res) => console.log(res))
          })
        }
      }
    }
  };
</script>

<style scoped>

</style>

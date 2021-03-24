<template>
  <q-page>
    <div style="height: 60px;" class="bg-blue-grey-3 flex justify-end">
      <q-btn outline label="Create Article" class="text-primary bg-white q-ma-sm" size="md" icon="add"
             @click.stop="createArticle = !createArticle"/>
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr;">
      <q-card v-for="(article,index) in articles" :key="index" class="q-ma-lg">
        <q-card-section>
          <div class="bg-image" :style="{backgroundImage: `url(${article.mainImage.url})`}">

          </div>
        </q-card-section>
        <q-card-section class="text-black row flex justify-between">
          <div style="font-size: 1.3em;">{{ article.mainTitle }}</div>
          <div class="flex justify-evenly">
            <q-icon name="fas fa-pen-alt" color="black" size="xs" class="cursor-pointer q-mr-sm"
                    @click="publishArticle(article)"/>
            <q-icon name="visibility" color="black" size="xs" class="cursor-pointer q-mr-sm"
                    @click="$router.push('articles/' + article._id)"/>
<!--            <q-icon name="delete" color="red" size="xs" class="cursor-pointer" @click="article.remove()"/>-->
            <q-icon name="delete" color="red" size="xs" class="cursor-pointer" @click="deleteArticle(article._id)" />
          </div>
        </q-card-section>
      </q-card>
    </div>
    <q-dialog v-model="createArticle" maximized>
      <article-form @close="createArticle = false"></article-form>
    </q-dialog>
    <q-dialog v-model="deleteDio">
      <q-card>
        <q-card-section class="text-h5">Are you sure you wish to delete this article?</q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancel" v-close-popup/>
          <q-btn @click="confirmDeleteArticle" label="Delete" color="red" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
  import ArticleForm from 'components/Forms/ArticleForms/ArticleForm';
  import {makeFindMixin} from 'feathers-vuex';
  import { mapActions } from 'vuex';

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
        deleteDio: false,
        deleteId: ''
      }
    },
    computed: {
      articlesParams() {
        return {};
      }
    },
    methods: {
      ...mapActions('articles', {
        removeArticle: 'remove'
      }),
      deleteArticle(id){
        this.deleteDio = true;
        this.deleteId = id;
      },
      confirmDeleteArticle(){
        this.removeArticle(this.deleteId).then(() => {
          this.$q.notify({
            message: 'Article deleted, it can no longer be viewed'
          });
          this.deleteId = '';
        })
      },
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
  .bg-image {
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    height: 300px;
  }
</style>

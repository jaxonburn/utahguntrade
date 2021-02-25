<template>
  <q-card style="width: 100%; height: 100%;">
    <q-icon name="cancel" size="lg" style="position: absolute;top: 10px;right: 10px;z-index: 10;" color="primary" @click.stop="$emit('close')" class="cursor-pointer"/>
    <q-card-section style="display: flex; align-items: center;justify-content: space-between; flex-direction: column;">
      <h5>Main</h5>
        <single-image-upload @image="form.mainImage = $event"></single-image-upload>
      <div style="width: 350px;">
      <q-input outlined label="ArticleTitle" v-model="form.mainTitle" class="q-mt-md" style="width: 100%;"></q-input>
      </div>
    </q-card-section>
    <q-card-section v-for="(section,index) in form.sections" :key="index" style="display: flex; justify-content: center; flex-direction: column;align-items: center;border: 1px solid var(--q-color-secondary);" >
      <h5>Section {{index + 1}}</h5>
      <q-separator/>
      <single-image-upload @image="section.image = $event" ></single-image-upload>
      <div style="width: 400px;">
      <q-input label="title" v-model="section.title"/>
        <q-editor v-model="section.body" min-height="8rem" />
      </div>
    </q-card-section>
    <q-separator/>
    <q-card-section class="flex flex-center">
      <q-btn color="secondary" @click.stop="addSection">Add Article Section</q-btn>
    </q-card-section>
    <q-card-section class="flex justify-end items-center">
      <div>
        <q-input outlined v-model="form.createdBy" label="Written By" style="width: 300px;" class="q-mr-md" hint=""/>
      </div>
      <div>
      <q-input outlined v-model="form.readTime" label="Read Time" hint="The length of minutes you think this article will take to read." placeholder="5" style="width: 300px;" class="q-mr-md" suffix=" minutes"/>
      </div>
      <div>
      <q-btn color="primary" @click.stop="saveForm">Save Article</q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
  import SingleImageUpload from 'components/common/SingleImageUpload';
  import {models} from 'feathers-vuex';
  import {mapState} from 'vuex';

  export default {
    name: 'ArticleForm',
    components: {SingleImageUpload},
    data(){
      return {
        form: new models.api.Articles().clone()
      }
    },
    computed: {
      ...mapState('auth', {
        user: 'user'
      }),
    },
    methods: {
      saveForm(){
        this.form.save().then((res) => {
          this.$emit('close')
          console.log('res', res);
          this.$q.notify({
            color: 'secondary',
            textColor: 'white',
            icon: 'check_circle',
            message: `Article Created`,
            position: 'top-right',
            timeout: 3000,
          })
        }).catch((err) => {
          console.error(err);
          this.$q.notify({
            type: 'error',
            message: 'Something went wrong, please refresh and try again'
          })
        })
      },
      addSection(){
        let section = {
          title: '',
          body: '',
          image: null,
        }
        this.form.sections.push(section);
      }
    }
  };
</script>

<style scoped>

</style>

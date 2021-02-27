<template>
  <q-card style="width: 100%; height: 100%;">
    <q-icon name="cancel" size="lg" style="position: absolute;top: 10px;right: 10px;z-index: 10;" color="primary" @click.stop="$emit('close')" class="cursor-pointer"/>
    <q-card-section style="display: flex; align-items: center;justify-content: space-between; flex-direction: column;">
      <h5>Main</h5>
        <q-btn @click="show.mainImage = !show.mainImage">upload</q-btn>
        <single-image-upload @image="form.mainImage = $event" v-if="show.mainImage"></single-image-upload>
      <div style="width: 350px;">
      <q-input outlined label="ArticleTitle" v-model="form.mainTitle" class="q-mt-md" style="width: 100%;"></q-input>
      </div>
    </q-card-section>
    <q-card-section v-for="(section,index) in form.sections" :key="index" style="display: flex; justify-content: center; flex-direction: column;align-items: center;border: 1px solid var(--q-color-secondary);" >
      <h5>Section {{index + 1}}</h5>
      <q-separator/>
      <q-btn @click="show[`section${index}`] = !show[`section${index}`]">upload</q-btn>
      <single-image-upload @image="section.image = $event,show[`section${index}`] = false " v-if="show[`section${index}`]"></single-image-upload>
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
        <q-btn @click="show.avatar = !show.avatar">upload avatar</q-btn>
        <single-image-upload @image="form.avatar = $event" v-if="show.avatar"></single-image-upload>
      </div>
      <div>
        <q-input outlined v-model="form.createdBy" label="Written By" style="width: 300px;" class="q-mr-md" hint=""/>
      </div>
      <div>
        <q-input outlined v-model="form.about" label="About" style="width: 300px;" class="q-mr-md" hint="Go on, show off a bit."/>
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
  //https://pics.venmo.com/b45de72c-a48b-4761-bba9-9f584a45650d?width=460&height=460&photoVersion=2
  export default {
    name: 'ArticleForm',
    components: {SingleImageUpload},
    data(){
      return {
        form: new models.api.Articles().clone(),
        show: {
          avatar: false,
          mainImage: false,
          section0: false,
        }
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
        this.show.section1 = false;
        this.form.sections.push(section);
      }
    }
  };
</script>

<style scoped>

</style>

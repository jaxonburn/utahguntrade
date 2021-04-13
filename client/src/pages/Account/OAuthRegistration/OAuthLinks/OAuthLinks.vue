<template>
  <div class="q-mt-xs linkBoxContainer" v-if="socialLinks.length > 0" :style="socialLinksStyle">
    <div v-for="link in socialLinks" :key="link.name" class="linkBox centerCenter cursor-pointer">
      <a :href="link.link" class="centerCenter">
        <q-img :src="link.img" style="width: 50px;height: 50px;" v-if="link.img" class="linkBoxIcon" :alt="link.name"/>
        <q-icon :name="link.icon" :style="{color: link.color}" class="linkBoxIcon" v-else></q-icon>
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'OAuthLinks',
    props: {
      socialLinks: {Type: Array, default: []}
    },
    computed: {
      socialLinksStyle(){
        let theStyle = 'grid-template-columns: ';
        for(let i = 0;i < this.socialLinks.length; i++){
          theStyle += ' 1fr';
        }
        return theStyle;
      }
    }
  };
</script>

<style scoped lang="scss" src="./_OAuthLinks.scss">

</style>

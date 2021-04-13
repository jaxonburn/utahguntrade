<template>
  <div>
  <q-list v-for="(link,index) in links" :key="index">
    <a :href="'//' + link.link" target="_blank">
      <q-item class="linkItems">
        <q-item-section avatar>
          <q-avatar>
            <q-img :src="link.picture" v-if="link.picture !== ''"/>
            <q-icon :name="link.icon" v-if="link.icon !== ''" size="md" :style="{color: link.color}"></q-icon>
          </q-avatar>
        </q-item-section>
        <q-item-section class="aboutFont" style="font-size: 1.8em;text-align: left;">
          {{ link.name }}
        </q-item-section>
      </q-item>
    </a>
    <q-separator/>
  </q-list>
  </div>
</template>

<script>
import instagramLogo from 'assets/Logos/instagramLogo.jpg';

export default {
name: 'SocialLinks',
  data() {
    return {
      links: [
        {
          name: 'Facebook',
          picture: '',
          icon: 'fab fa-facebook-square',
          color: '#4C6EF5',
          link: 'www.facebook.com',
        },
        {
          name: 'Instagram',
          picture: instagramLogo,
          icon: '',
          color: '',
          link: 'www.instagram.com/gunhubutah/'
        },
        {
          name: 'Twitter',
          picture: '',
          icon: 'fab fa-twitter',
          color: '#05A1EE',
          link: 'www.twitter.com'
        },
        {
          name: 'Youtube',
          picture: '',
          icon: 'fab fa-youtube',
          color: '#FF0102',
          link: 'www.youtube.com'
        }
      ]
    }
  },
};
</script>

<style scoped>

  .linkItems {
    transition: all .3s ease-in-out;
    cursor: pointer;
    -webkit-box-shadow: inset 10px 0 3px -3px #D4212E, 0px 0px 0px 5px rgba(0, 0, 0, 0);
    box-shadow: inset 10px 0 3px -3px #D4212E, 0px 0px 0px 5px rgba(0, 0, 0, 0);
  }

  .linkItems:hover {
    transform: scale(1.03);
    background: #cfd0d1;
  }
</style>

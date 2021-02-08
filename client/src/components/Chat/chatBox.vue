<template>
  <div class="q-pa-md row justify-center">
    <div class="bg-white" style="width: 100%; max-width: 320px;position: fixed;
    height: 500px;
  bottom: 10px;
  right: 15px;
  z-index: 5;
  border: 2px solid var(--q-color-secondary);
">
      <div class="row items-center" style="border-bottom: .5px solid var(--q-color-secondary)">
        <q-input
          v-model="searchUser"
          filled
          color="secondary"
          placeholder="Search Users"
          class="q-ma-sm"
          round
          style="width: 80%;"
        >
          <template v-slot:append>
            <q-icon name="search" color="secondary"/>
          </template>
        </q-input>
        <q-space/>
        <q-icon name="cancel" size="sm" class="q-ma-sm cursor-pointer" color="secondary"
                @click="$emit('close')"></q-icon>
      </div>
      <q-list bordered style="overflow-y: scroll;">
        <div v-for="(chat,index) in chats" :key="index">
          <q-item class="q-my-sm" clickable v-ripple>

            <q-item-section avatar v-for="users in chat._fastjoin.users">
              <q-avatar color="primary" text-color="white" v-if="users._id !== user._id">
                <img :src="users.avatar" alt="Avatar"/>
              </q-avatar>

            </q-item-section>
            <q-item-section>
              <q-item-label>{{ chat._fastjoin.users[0].username }}</q-item-label>
              <q-item-label caption lines="1">{{ chat.messages[0].message }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-list>
      <!--      <q-chat-message-->
      <!--        name="me"-->
      <!--        avatar="https://cdn.quasar.dev/img/avatar1.jpg"-->
      <!--        :text="['hey, how are you?']"-->
      <!--        stamp="7 minutes ago"-->
      <!--        sent-->
      <!--        bg-color="amber-7"-->
      <!--      />-->
      <!--      <q-chat-message-->
      <!--        name="Jane"-->
      <!--        avatar="https://cdn.quasar.dev/img/avatar5.jpg"-->
      <!--        :text="['doing fine, how r you?']"-->
      <!--        stamp="4 minutes ago"-->
      <!--        text-color="white"-->
      <!--        bg-color="primary"-->
      <!--      />-->
    </div>
  </div>
</template>

<script>
  import {mapActions, mapGetters, mapState} from 'vuex';

  export default {
    name: 'chatBox',
    props: {
      user: Object,
    },
    data() {
      return {
        searchUser: '',
      }
    },
    mounted() {
      this.loadChats({query: {_id: {$in: this.user.chats}}});
    },
    computed: {
      ...mapGetters('chats', {
        findChats: 'find'
      }),
      chats() {
        return this.findChats({query: {_id: {$in: this.user.chats}}}).data;
      }
    },
    methods: {
      ...mapActions('chats', {
        loadChats: 'find',
      }),

    }

  };
</script>

<style scoped>

</style>

<template>
  <div class="q-pa-md row justify-center">
    <div class="bg-white" style="width: 100%; max-width: 320px;position: fixed;
    height: 500px;
  bottom: 10px;
  right: 15px;
  z-index: 5;
  border: 2px solid var(--q-color-secondary);
">
      <transition name="slide-fade">
        <div v-if="!inChat">
          <div class="row items-center" style="border-bottom: .5px solid var(--q-color-secondary)">
            <q-input
              v-model="searchUser"
              filled
              color="secondary"
              placeholder="Search Users"
              class="q-ma-sm"
              round
            >
              <template v-slot:append>
                <q-icon name="search" color="secondary"/>
              </template>
            </q-input>
            <q-space/>
            <q-icon name="person_add" size="sm" class="q-ma-sm cursor-pointer" color="primary"
                    @click="addChat = !addChat"/>
            <q-icon name="cancel" size="sm" class="q-ma-sm cursor-pointer" color="secondary"
                    @click="$emit('close')"></q-icon>
          </div>
          <q-list bordered style="overflow-y: scroll;">
            <div v-for="(chat,index) in chats" :key="index">
              <q-item class="q-my-sm" clickable v-ripple @click.stop="openChat(chat)">
                <q-item-section avatar
                                v-for="users in chat._fastjoin.users.filter((userFilt) => {return userFilt._id !== user._id;})"
                                :key="users._id" class="q-mr-none q-pa-none">
                  <q-avatar color="primary" text-color="white">
                    <img :src="users.avatar" alt="Avatar"/>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ chat._fastjoin.users[0]._id === user._id ? chat._fastjoin.users[1].username : chat._fastjoin.users[0].username }}</q-item-label>
                  <q-item-label caption lines="1">{{ $lget(chat, `messages[[${$lget(chat, 'messages.length', 0) - 1}]].message`, '') }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator/>
            </div>
          </q-list>
        </div>
      </transition>
      <transition name="slide-fade">
        <div v-if="inChat" style="display: flex; flex-direction: column; justify-content: center;">
          <div class="bg-grey-3 q-pa-sm row">
            <q-btn icon="arrow_back" size="md" rounded push @click.stop="inChat = null" class="bg-white"/>
            <q-space/>
            <div>
              <span class="text-weight-bold text-xs text-mb-xs">{{
                  $lget(notUser, 'username', '')
                }} &nbsp; &nbsp;</span>
              <q-avatar>
                <img :src="$lget(notUser, 'avatar', '')" style="border: 1.5px solid var(--q-color-primary)"/>
              </q-avatar>
            </div>
          </div>
          <q-scroll-area
            :thumb-style="thumbStyle"
            :bar-style="barStyle"
            style="height: 350px; max-width: 380px;"
          >
            <q-chat-message
              v-for="message in $lget(inChat, 'messages', [])"
              :key="message._id"
              :name="$lget(message, 'sentBy', '') === user._id ? user.username : $lget(notUser, 'username', '')"
              :avatar="$lget(message, 'sentBy', '') === user._id ? user.avatar : $lget(notUser, 'avatar', '')"
              :text="[message.message]"
              :stamp="date.formatDate($lget(message, 'createdAt', new Date()), 'MMM D, h:mm:a')"
              :sent="$lget(message, 'sentBy', '') === user._id"
              :bg-color="$lget(message, 'sentBy', '') === user._id ? 'primary' : 'secondary'"
              text-color="white"
              class="q-ma-sm"
            />

          </q-scroll-area>
          <div>
            <q-input outlined class="q-ma-sm bg-grey-3" label="Message" v-model="yourChat" style="overflow: scroll;">
              <template v-slot:append>
                <q-btn round dense flat icon="send" push class="text-primary" @click="sendMessage"/>
              </template>
            </q-input>
          </div>
        </div>
      </transition>
    </div>
    <q-dialog v-model="addChat">
      <add-friend-form @close="addChat = !addChat"></add-friend-form>
    </q-dialog>
  </div>
</template>

<script>
  import {mapActions, mapGetters, mapState} from 'vuex';
  import {date} from 'quasar';
  import AddFriendForm from 'components/Forms/ChatForm/addFriendForm';

  export default {
    name: 'chatBox',
    components: {AddFriendForm},
    props: {
      user: Object,
    },
    data() {
      return {
        addChat: false,
        yourChat: '',
        date: date,
        inChat: null,
        searchUser: '',
        thumbStyle: {
          right: '4px',
          borderRadius: '5px',
          backgroundColor: '#027be3',
          width: '5px',
          opacity: 0.75
        },

        barStyle: {
          right: '2px',
          borderRadius: '9px',
          backgroundColor: '#027be3',
          width: '9px',
          opacity: 0.2
        }
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
        console.log('saying chats',this.findChats({query: {_id: {$in: this.user.chats}}}).data);
        return this.findChats({query: {_id: {$in: this.user.chats}}}).data;
      },
      notUser() {
        if (this.inChat) {
          return this.inChat._fastjoin.users.filter((userFilt) => {
            return userFilt._id !== this.user._id;
          })[0]
        } else {
          return {};
        }
      }
    },
    methods: {
      ...mapActions('chats', {
        loadChats: 'find',
      }),
      openChat(chat) {
        this.inChat = chat;
        console.log(chat);
      },
      sendMessage() {
        let chat = this.inChat.clone();
        let message = {
          sentBy: this.user._id,
          message: this.yourChat,
        };
        chat.messages.push(message);
        this.yourChat = '';
        chat.save().catch(() => {
          this.$q.notify({
            type: 'error',
            message: 'Something went wrong, please refresh and try again'
          })
        })
      }
    }

  };
</script>

<style scoped>

</style>
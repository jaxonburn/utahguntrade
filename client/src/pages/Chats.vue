<template>
  <div class="chats-wrapper">
    <div class="sidebar">
      <div @click="addChat = true" class="create-chat">
        <q-icon name="add" size="lg" />
        <span>Create new chat</span>
      </div>
      <div v-if="selectedChat">
        <div @click="selectedChat = chat" class="chat" v-for="(chat, idx) in chats" :key="idx">
          <div :class="fUser._id === user._id ? '' : $lget(selectedChat, '_id', '') === chat._id ? 'user-chat selected' : 'user-chat'" v-for="fUser in chat._fastjoin.users" :key="fUser._id">
            <div class="left" v-if="fUser._id !== user._id" >
              <img :src="fUser.avatar" width="60" height="60" style="border-radius: 50%; padding: 0; margin: 0;"/>
            </div>
            <div v-if="fUser._id !== user._id" class="right">
              <div>{{ fUser.username }}</div>
              <div>{{ $lget(chat.messages[chat.messages.length - 1], 'message', 'Send a message').slice(0, 75) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main" v-if="selectedChat">
      {{ selectedChat }}
    </div>

    <q-dialog v-model="addChat">
      <add-friend-form @close="addChat = !addChat"></add-friend-form>
    </q-dialog>
  </div>
</template>

<script>

  import { mapActions, mapGetters } from 'vuex';
  import { date } from 'quasar';
  import AddFriendForm from 'components/Forms/ChatForm/addFriendForm';
  import EmojiPicker from "vue-emoji-picker";

  export default {
    name: "Messages",
    components: {AddFriendForm, EmojiPicker},
    mounted(){
      this.loadChats({query: {_id: {$in: this.user.chats}}}).then(res => {
        this.selectedChat = res.data[0];
        console.log(res);
      })
    },
    data(){
      return {
        selectedChat: null,
        addChat: false
      }
    },
    directives: {
      focus: {
        inserted(el) {
          el.focus();
        }
      }
    },
    computed: {
      ...mapGetters('chats', {
        findChats: 'find'
      }),
      ...mapGetters('auth', {
        user: 'user'
      }),
      chats(){
        return this.findChats({query: {_id: {$in: this.user.chats}}}).data
      }
    },
    methods: {
      ...mapActions('chats', {
        loadChats: 'find',
      }),
      insertEmoji(emoji){
        this.yourChat += emoji;
      },
    }
  }
</script>

<style scoped lang="scss">
  .chats-wrapper {
    display: flex;
    overflow: Hidden;

    .sidebar {
      flex: 0.27;
      box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, 0.3);
      height: 90vh;
      overflow-y: scroll;

      .create-chat {
        background-color: #dadfea;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 23px 15px 15px;
        cursor: pointer;
        border-bottom: 1px solid black;

        span {
          font-size: 1.15em;
        }
      }

      .chat {
        .user-chat {
          border-bottom: 1px solid black;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding:20px 40px 10px 40px;
          transition: 0.3s all;
          cursor: pointer;
        }

        .right {
          margin: 0 0 13px 17px;

          div:first-child {
            font-size: 1.2em;
            font-weight: 550;
          }
        }
        .user-chat:hover:not(.selected) {
          background-color: #ecebeb;
        }

        .selected {
          background-color: #2c3e50;
          color: white;
        }
      }
    }
  }
  .main {
    flex: .73;
  }
</style>

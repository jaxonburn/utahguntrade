<template>
  <div class="q-pa-md row justify-center">
    <div class="bg-white chatBoxContainer">
      <q-inner-loading :showing="loadingChats">
        <q-spinner-comment size="75px" color="primary"/>
      </q-inner-loading>
        <div v-if="!inChat">
          <div class="chatBoxTopBar">
            <div>
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
            </div>
            <q-space/>
            <q-icon name="person_add" size="sm" class="q-ma-sm cursor-pointer" color="primary"
                    @click="addChat = !addChat"/>
            <q-icon name="cancel" size="sm" class="q-ma-sm cursor-pointer" color="secondary"
                    @click="$emit('close')"></q-icon>
          </div>
          <div>
            <div v-for="(chat,index) in chats" :key="index">
              <chat-item :chat="chat"  :user="user" @openChat="openChat"></chat-item>
              <q-separator/>
            </div>
          </div>
        </div>
        <div v-if="inChat" style="display: flex; flex-direction: column; justify-content: center;">
          <div class="bg-grey-3 q-pa-sm" style="display: flex; flex-direction: row;align-items: center;">
            <q-btn icon="arrow_back" size="md" push @click.stop="inChat = null" flat/>
            <q-space/>
            <div class="text-weight-bold text-xxs text-mb-xxs q-mr-sm">
                {{$lget(notUser, 'username', '')}}
            </div>
            <div>
              <q-avatar>
                <img :src="$lget(notUser, 'avatar', '')" style="border: 1.5px solid var(--q-color-primary)"/>
              </q-avatar>
            </div>
          </div>
          <div
            :thumb-style="thumbStyle"
            :bar-style="barStyle"
            style="height: 350px; max-width: 380px; overflow: scroll;"
            id="chatBox"
          >
            <q-chat-message
              v-for="message in $lget(inChat, 'messages', [])"
              :key="message._id"
              :name="$lget(message, 'sentBy', '') === user._id ? user.username : $lget(notUser, 'username', '')"
              :avatar="$lget(message, 'sentBy', '') === user._id ? user.avatar : $lget(notUser, 'avatar', '')"
              :text="[message.message]"
              :stamp="formatDate(message.createdAt, 'h:mm a MMM DD, YYYY')"
              :sent="$lget(message, 'sentBy', '') === user._id"
              :bg-color="$lget(message, 'sentBy', '') === user._id ? 'primary' : 'secondary'"
              text-color="white"
              class="q-ma-sm"
            />
            <div class="text-center text-weight-bold text-grey-7 q-mt-md" v-if="userLeft"> {{$lget(notUser, 'username')}} left the chat</div>
          </div>
          <div>
            <q-input outlined class="q-ma-sm bg-grey-3" label="Message" v-model="yourChat" style="overflow: scroll;"
                     @keyup.enter="sendMessage" :loading="chatLoading" maxlength="400">
              <template v-slot:append>
                <q-btn round dense flat icon="send" push class="text-primary" @click="sendMessage"/>
              </template>
            </q-input>
          </div>
        </div>
    </div>
    <q-dialog v-model="addChat">
      <add-friend-form @close="addChat = !addChat"></add-friend-form>
    </q-dialog>
  </div>
</template>

<script>
  import {mapActions, mapGetters, mapState} from 'vuex';
  import {date} from 'quasar';
  const {formatDate} = date;
  import AddFriendForm from 'components/Forms/ChatForm/addFriendForm';
  import EmojiPicker from 'vue-emoji-picker'
  import ChatItem from "components/Chat/chatItem";

  export default {
    name: 'chatBox',
    components: {ChatItem, AddFriendForm, EmojiPicker},
    props: {
      user: Object,
    },
    data() {
      return {
        formatDate,
        loadingChats: true,
        search: '',
        addChat: false,
        yourChat: '',
        date: date,
        inChat: null,
        searchUser: '',
        chatLoading: false,
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
      this.loadChats({query: {_id: {$in: this.user.chats}}}).then((res) => {
        this.loadingChats = false;
      }).catch(() => {
        this.loadingChats = false;
        this.$q.notify({
          type: 'error',
          message: 'Something went wrong, please refresh and try again'
        })
      })
    },
    directives: {
      focus: {
        inserted(el) {
          el.focus()
        },
      },
    },
    computed: {
      ...mapGetters('chats', {
        findChats: 'find'
      }),
      chats() {
        if(this.searchUser === ''){
          return this.findChats({query: {_id: {$in: this.user.chats}}}).data;
        }else {
          return this.findChats({query: {_id: {$in: this.user.chats}}}).data;
        }
      },
      userLeft(){
        let userLeft = false;
        this.inChat.users.map((chatUser) => {
          if(chatUser.left === true){
            userLeft = true;
          }
        });
        return userLeft;
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
      insertEmoji(emoji){
        this.yourChat += emoji;
      },
      openChat(chat) {
        this.inChat = chat;
        let unReadChat = this.inChat.clone();
        let save = false;
        unReadChat.users.forEach((chatUser) => {
          if ((chatUser.user === this.user._id) && (chatUser.unreadMessages.length !== 0)) {
            chatUser.unreadMessages = [];
            save = true;
          }
        });
        if(save) this.$store.dispatch('chats/update', [unReadChat._id, unReadChat])
        setTimeout(() => {
          let box = document.getElementById(('chatBox'));
          box.scrollTop = box.scrollHeight;
        }, 100)
      },
      sendMessage() {
        if(this.userLeft){
          this.$q.notify({type: 'info', message: 'Other user left the chat.'});
          return;
        }
        this.chatLoading = true;
        let chat = this.inChat.clone();
        let message = {
          sentBy: this.user._id,
          message: this.yourChat,
          createdAt: new Date()
        };
        chat.messages.push(message);
        this.yourChat = '';
        chat.save().then(() => {
          this.chatLoading = false;
          let box = document.getElementById(('chatBox'));
          box.scrollTop = box.scrollHeight;
        }).catch((err) => {
          console.error(err);
          this.chatLoading = false;
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

.chatBoxContainer {
  width: 100%; max-width: 320px;position: fixed;
  height: 500px;
  bottom: 10px;
  right: 15px;
  z-index: 5;
  -webkit-box-shadow: 0 0 6px 1px rgba(0,0,0,0.35);
  box-shadow: 0 0 6px 1px rgba(0,0,0,0.35);
  overflow-y: scroll;
}

.chatBoxTopBar{
  border-bottom: .5px solid var(--q-color-secondary);
  display: flex;
  flex-direction: row;
  align-items: center;
}

  .emoji-invoker {
    position: absolute;
    top: 0.8rem;
    right: 3rem;
    width: 1.5rem;
    height: 1.5rem;
    z-index: 10;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s;
  }
  .emoji-invoker:hover {
    transform: scale(1.1);
  }
  .emoji-invoker > svg {
    fill: #b1c6d0;
  }

  .emoji-picker {
    position: absolute;
    z-index: 1;
    font-family: Montserrat;
    border: 1px solid #ccc;
    width: 15rem;
    height: 20rem;
    overflow: scroll;
    padding: 1rem;
    box-sizing: border-box;
    border-radius: 0.5rem;
    background: #fff;
    box-shadow: 1px 1px 8px #c7dbe6;
  }
  .emoji-picker__search {
    display: flex;
  }
  .emoji-picker__search > input {
    flex: 1;
    border-radius: 10rem;
    border: 1px solid #ccc;
    padding: 0.5rem 1rem;
    outline: none;
  }
  .emoji-picker h5 {
    margin-bottom: 0;
    color: #b1b1b1;
    text-transform: uppercase;
    font-size: 0.8rem;
    cursor: default;
  }
  .emoji-picker .emojis {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .emoji-picker .emojis:after {
    content: "";
    flex: auto;
  }
  .emoji-picker .emojis span {
    padding: 0.2rem;
    cursor: pointer;
    border-radius: 5px;
  }
  .emoji-picker .emojis span:hover {
    background: #ececec;
    cursor: pointer;
  }


</style>

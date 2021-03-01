<template>
  <q-page class="chats-wrapper">
    <div class="sidebar">
      <div @click="addChat = true" class="create-chat">
        <q-icon name="add" size="lg" />
        <span>Create new chat</span>
      </div>
      <div v-if="selectedChat">
        <div @click="selectChat(chat)" class="chat" v-for="(chat, idx) in chats" :key="idx">
          <q-badge class="unread" v-if="chat.users.filter((chatUser) => chatUser.user === user._id)[0].unreadMessages.length > 0"
                   color="primary">
            <span class="text-weight-bolder">{{ chat.users.filter((chatUser) => chatUser.user === user._id)[0].unreadMessages.length }}</span>
          </q-badge>
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
    <div class="main" v-if="selectedChat" id="chatBox">

      <div class="messages-wrapper">
          <q-chat-message
            v-for="message in $lget(selectedChat, 'messages', [])"
            :key="message._id"
            :name="$lget(message, 'sentBy', '') === user._id ? user.username : $lget(notUser, 'username', '')"
            :avatar="$lget(message, 'sentBy', '') === user._id ? user.avatar : $lget(notUser, 'avatar', '')"
            :stamp="date.formatDate($lget(message, 'createdAt', new Date()), 'MMM D, h:mm:a')"
            :text="[message.message]"
            :sent="$lget(message, 'sentBy', '') === user._id"
            :bg-color="$lget(message, 'sentBy', '') === user._id ? 'primary' : 'secondary'"
            text-color="white"
            class="q-ma-sm"
          />
      </div>

      <div class="chat-box">
        <q-input outlined class="q-ma-sm bg-grey-3" label="Message" v-model="yourChat" style="overflow: scroll;"
                 @keyup.enter="sendMessage">
          <template v-slot:append>
<!--            <emoji-picker @emoji="insertEmoji" :search="search">-->
<!--              <div-->
<!--                class="emoji-invoker"-->
<!--                slot="emoji-invoker"-->
<!--                slot-scope="{ events: { click: clickEvent } }"-->
<!--                @click.stop="clickEvent"-->
<!--              >-->
<!--                <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">-->
<!--                  <path d="M0 0h24v24H0z" fill="none"/>-->
<!--                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>-->
<!--                </svg>-->
<!--              </div>-->
<!--              <div slot="emoji-picker" slot-scope="{ emojis, insert, display }">-->
<!--                <div class="emoji-picker" :style="{ top: display.y + 'px', left: display.x + 'px' }">-->
<!--                  <div class="emoji-picker__search">-->
<!--                    <input type="text" v-model="search" v-focus>-->
<!--                  </div>-->
<!--                  <div>-->
<!--                    <div v-for="(emojiGroup, category) in emojis" :key="category">-->
<!--                      <h5>{{ category }}</h5>-->
<!--                      <div class="emojis">-->
<!--                <span-->
<!--                  v-for="(emoji, emojiName) in emojiGroup"-->
<!--                  :key="emojiName"-->
<!--                  @click="insert(emoji)"-->
<!--                  :title="emojiName"-->
<!--                >{{ emoji }}</span>-->
<!--                      </div>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </emoji-picker>-->
            <q-btn round dense flat icon="send" push class="text-primary" @click="sendMessage"/>
          </template>
        </q-input>
      </div>
    </div>

    <q-dialog v-model="addChat">
      <add-friend-form @close="addChat = !addChat"></add-friend-form>
    </q-dialog>
  </q-page>
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
        if(!this.$route.params.chatId) {
          this.selectedChat = res.data[0];
        } else {
          if(this.$route.params.created === 'true') {
            // this.selectedChat = res.data[0];
          } else if(this.$route.params.created === 'false') {
            res.data.forEach(chat => {
              if(chat._id === this.$route.params.chatId) {
                this.selectedChat = chat;
                setTimeout(() => {
                  let box = document.getElementById(('chatBox'));
                  box.scrollTop = box.scrollHeight;
                }, 200)
              }
            })
          }
        }
      })
    },
    watch: {
      chats: {
        deep: true,
        handler(newVal, oldVal) {
          if(newVal.length !== oldVal.length && !this.selectedFromDetails) {
            this.selectedChat = newVal[newVal.length - 1];
            this.selectedFromDetails = true;
            setTimeout(() => {
              let box = document.getElementById(('chatBox'));
              box.scrollTop = box.scrollHeight;
            }, 200)
          }
        }
      }
    },
    data(){
      return {
        selectedChat: null,
        addChat: false,
        selectedFromDetails: false,
        yourChat: '',
        date: date
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
      },
      notUser() {
        if (this.selectedChat) {
          return this.selectedChat._fastjoin.users.filter((userFilt) => {
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
      sendMessage() {
        let chat = this.selectedChat.clone();
        let message = {
          sentBy: this.user._id,
          message: this.yourChat,
        };
        chat.messages.push(message);
        this.yourChat = '';
        chat.save().then(() => {
          let box = document.getElementById(('chatBox'));
          box.scrollTop = box.scrollHeight;
        }).catch(() => {
          this.$q.notify({
            type: 'error',
            message: 'Something went wrong, please refresh and try again'
          })
        })
      },
      selectChat(chat){
        this.selectedChat = chat;
        let unReadChat = this.selectedChat.clone();
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
      }
    }
  }
</script>

<style scoped lang="scss">
  .chats-wrapper {
    display: flex;
    //height: 100%;
    //overflow: hidden;
    max-height: 85vh;

    .sidebar {
      overflow: scroll;
      flex: 0.27;
      box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, 0.3);
      padding-bottom: 20px;
      //height: 90vh;

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

        position: relative;

        .unread {
          position: absolute;
          top: 10px;
          left: 10px;
          font-size: 1em;
          padding: 5px;
        }

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
    position: relative;
    overflow: scroll;

    .chat-box {
      position: sticky;
      bottom: 30px;
      font-size: 10em;
      //background-color: white;
    }

    .messages-wrapper {
      width: 100%;
      min-height: 65vh;
      color: white;
      padding: 0 20px 20px 30px;

      .message {

      }
    }
  }
</style>

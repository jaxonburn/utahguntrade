<template>
  <q-item class="q-my-sm" @click.stop="$emit('openChat', chat)" clickable>
    <q-badge v-if="chat.users.filter((chatUser) => chatUser.user === user._id)[0].unreadMessages.length > 0"
             color="primary" class="q-mr-md" floating>
      <span class="text-weight-bolder">{{ chat.users.filter((chatUser) => chatUser.user === user._id)[0].unreadMessages.length }}</span>
    </q-badge>
    <div class="flex flex-center">
      <q-icon name="fiber_manual_record" :color="$lget($lget(chat, '_fastjoin.users', []).filter((chatUser) => chatUser._id !== user._id), '[0].active', false) ? 'positive' : 'negative'"
              style="font-size: 1em;"></q-icon>
    </div>
    <q-item-section avatar
                    v-for="users in chat._fastjoin.users.filter((userFilt) => {return userFilt._id !== user._id;})"
                    :key="users._id" class="q-mr-none q-pa-none">
      <q-avatar color="white" text-color="white">
        <img :src="users.avatar" alt="Avatar"/>
      </q-avatar>
    </q-item-section>
    <q-item-section>
      <q-item-label>{{
          chat._fastjoin.users[0]._id === user._id ? $lget(chat, '_fastjoin.users[1].username', 'Username Not Found') : chat._fastjoin.users[0].username
        }}
      </q-item-label>
      <q-item-label caption lines="1">
        {{ $lget(chat, `messages[[${$lget(chat, 'messages.length', 0) - 1}]].message`, '') }}
      </q-item-label>
    </q-item-section>

    <q-item-section side @click.stop>
      <div>
        <q-btn-dropdown
          class="bg-white text-bg-blue-grey-4"
          dropdown-icon="more_horiz"
          style="width: 100%;z-index: 5;"
          flat
        >
          <q-list>
            <q-item clickable v-ripple class="cursor-pointer" @click="leaveChatDialog = true">
              <q-item-section style="display: flex; flex-direction: row;justify-content: center; align-items: center;" @click.stop="leaveChatDialog = true">
                <q-icon name="fas fa-sign-out-alt" class="q-mr-sm" color="primary" size="xs"></q-icon>
                <span class="nameFont">Leave Chat</span>
              </q-item-section>
            </q-item>
            <q-separator/>
            <q-item clickable v-ripple class="cursor-pointer" @click="reportDialog = true">
              <q-item-section style="display: flex; flex-direction: row;justify-content: center; align-items: center;">
                <q-icon name="fas fa-exclamation-triangle" class="q-mr-sm" color="warning" size="xs"></q-icon>
                <span class="nameFont">Report Chat</span>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </q-item-section>
    <q-dialog v-model="leaveChatDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Are you sure you'd like to leave this chat?</div>
        </q-card-section>
        <q-card-section>
          You won't be able to see any new or previous messages from this user.
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup color="red"/>
          <q-btn @click="leaveChat" label="Leave Chat" v-close-popup color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="reportDialog">
      <report-dialog service="chats" :data-id="chat._id" name="chat"></report-dialog>
    </q-dialog>
  </q-item>
</template>

<script>
import ReportDialog from "components/common/Dialogs/ReportDialog";
export default {
  name: "chatItem",
  components: {ReportDialog},
  props: {
    chat: {type: Object, required: true},
    user: {type: Object, required: true}
  },
  data(){
    return {
      leaveChatDialog: false,
      reportDialog: false,
    }
  },
  methods: {
    leaveChat(){
      this.chat.users.forEach((chatUser) => {
        if(chatUser.user === this.user._id){
          chatUser.left = true;
        }
      });
      this.user.chats = this.user.chats.filter((userChat) => {
        return userChat !== this.chat._id;
      });
      Promise.all([this.user.save(), this.chat.save()]).then((res) => {
        console.log(res);
      }).catch((err) => {
        console.error(err);
        this.$q.notify({message: 'Something went wrong removing chat, please refresh and try again.'})
      })
    }
  }
}
</script>

<style scoped>

</style>

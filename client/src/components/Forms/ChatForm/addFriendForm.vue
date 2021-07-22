<template>
  <q-card style="width: 90%;">
    <q-card-section style="display: grid; grid-template-columns: 3fr 0.5fr;align-items: center;">
      <q-select
        filled
        v-model="searchUser"
        use-input
        use-chips
        hide-selected
        fill-input
        input-debounce="500"
        label="Add Users to Chat"
        :options="options"
        @filter="filterFn"
        @filter-abort="abortFilterFn"
        emit-value
        map-options
        option-label="email"
        option-value="_id"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
        <template v-slot:append>
          <q-icon name="add" size="sm" color="primary" class="cursor-pointer" @click.stop="addChat"/>
        </template>
      </q-select>
      <div class="flex flex-center">
        <q-icon name="cancel" size="md" class="q-ma-sm cursor-pointer" color="secondary"
                @click="$emit('close')"></q-icon>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
  import {mapActions, mapState} from 'vuex';
  import {models} from 'feathers-vuex';

  export default {
    name: 'addFriendForm',
    data() {
      return {
        searchUser: [],
        options: [],
      }
    },
    computed: {
      ...mapState('auth', {
        user: 'user'
      }),
    },
    methods: {
      ...mapActions('users', {
        loadUsers: 'find',
      }),
      ...mapActions('chats', {
        loadChats: 'find',
      }),
      filterFn(val, update) {
        this.loadUsers({query: {"email": {$regex: val}}}).then((res) => {
          setTimeout(() => {
            update(() => {
              this.options = res.data;
            })
          }, 1500)
        }).catch((err => {
          console.error(err);
        }))
      },
      abortFilterFn() {
        // console.log('abortFilter');
      },
      addChat() {
        this.$isLoading = true;
        let newChat = new models.api.Chats({users: [{user: this.user._id, unreadMessages: []}, {user: this.searchUser, unreadMessages: []}]})
        newChat.create().then((res) => {
          this.$q.notify({
            color: 'secondary',
            textColor: 'white',
            icon: 'check_circle',
            message: `Chat Created`,
            position: 'top-right',
            timeout: 3000,
          })
          this.loadChats({query: {_id: {$in: this.user.chats}}});
          this.$emit('close');
        }).catch((err) => {
          console.error(err);
          if(err.name === 'GeneralError'){
            this.$q.notify({
              color: 'primary',
              textColor: 'white',
              icon: 'cancel',
              message: `You already have a chat with this person.`,
              position: 'top-right',
              timeout: 8000,
            })
          }
        })
      }
    }
  };
</script>

<style scoped>

</style>

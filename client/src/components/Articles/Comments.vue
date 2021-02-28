<template>
  <div>
    <div class="q-mt-lg specialFont q-ml-sm">
      Comments({{ $lget(article, 'comments.length', 0) }})
    </div>
    <div class="q-ma-xs">
      <div>
        <q-input type="textarea" outlined class="q-ma-lg" label="What do you think?" v-model="message"/>
      </div>
      <div class="flex justify-end">
        <q-btn color="primary" @click="sendChat" glossy class="q-ma-sm">Send</q-btn>
      </div>
    </div>
    <div v-for="(comment,index) in $lget(article, '_fastjoin.comments', [])" :key="index">
      <q-card class="q-ma-md" flat>
        <q-card-section class="row">
          <q-avatar size="40px"><img :src="comment.user.avatar" alt="User Avatar"/></q-avatar>
          <div style="display: flex; flex-direction: column;" class="q-ml-sm">
            <span class="nameFont">{{ comment.user.username }}</span>
            <span class="aboutFont q-mt-xs">{{ comment.createdAt | format }} ago</span>
          </div>
          <q-space/>
          <div>
            <q-btn-dropdown
              class="bg-white text-bg-blue-grey-4"
              dropdown-icon="more_horiz"
              style="width: 100%;"
              flat
            >
              <q-list>
                <q-item clickable v-ripple class="cursor-pointer" @click="reportDialog = true">
                  <q-item-section style="display: flex; flex-direction: row;justify-content: center; align-items: center;">
                    <q-icon name="fas fa-exclamation-triangle" class="q-mr-sm" color="warning" size="xs"></q-icon>
                    <span class="nameFont">Report comment</span>
                  </q-item-section>
                </q-item>
                <q-separator/>
                <q-item clickable v-ripple class="cursor-pointer" v-if="comment.sentBy === user._id" @click="removeComment(comment)">
                  <q-item-section style="display: flex; flex-direction: row;justify-content: center; align-items: center;">
                    <q-icon name="delete" class="q-mr-sm" color="negative" size="sm"></q-icon>
                    <span class="nameFont">Delete comment</span>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </q-card-section>
        <q-card-section>
          {{ comment.message }}
        </q-card-section>
        <q-card-section class="row items-center nameFont">
          <q-icon @click="likeComment(index)" size="xs"
                  :name="$lget(comment, 'message.upVote', []).includes(user._id) ? 'fas fa-thumbs-up' : 'far fa-thumbs-up'"
                  class="text-secondary cursor-pointer"></q-icon>
          <span class="q-ml-xs">{{ comment.upVote.length }}</span>
        </q-card-section>
      </q-card>
      <div class="flex justify-center">
        <q-separator style="width: 80%;"/>
      </div>
    </div>
    <q-dialog v-model="reportDialog">
      <q-card>
        <q-card-section class="nameFont" style="font-size: 2.3em;">
          Report this comment?
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import dateUtils from '../../helpers/dateUtils';


  export default {
    name: 'Comments',
    props: {
      article: Object,
      user: Object,
    },
    data() {
      return {
        message: '',
        reportDialog: false,
      }
    },
    filters: {
      format(date) {
        let newDate = new Date(date);
        return dateUtils(newDate);
      }
    },
    methods: {
      removeComment(comment){
        this.article.comments = this.article.comments.filter((comm) => {
          return  comm._id !== comment._id;
        })
        this.article.save().then((res) => {
          this.$q.notify({
            color: 'primary',
            textColor: 'white',
            icon: '',
            message: 'Deleted Comment',
            position: 'bottom',
            timeout: 3000,
          })
        }).catch((err) => {
          this.$q.notify({
            type: 'error',
            message: 'Something went wrong when removing your comment, please refresh and try again'
          })
        })
      },
      likeComment(index) {
        if (this.article.comments[index].upVote.includes(this.user._id)) {
          this.article.comments[index].upVote = this.article.comments[index].upVote.filter((userUp) => {
            return userUp !== this.user._id;
          })
          this.article.save().then((res) => {
            this.$q.notify({
              color: 'primary',
              textColor: 'white',
              icon: '',
              message: 'Unliked',
              position: 'bottom',
              timeout: 3000,
            })
          }).catch((err) => {
            console.log(err);
            this.$q.notify({
              type: 'error',
              message: 'Something went wrong with liking, please refresh and try again'
            })
          })
        } else {
          this.article.comments[index].upVote.push(this.user._id);
          this.article.save().then((res) => {
            console.log(res);
            this.$q.notify({
              color: 'primary',
              textColor: 'white',
              icon: 'fas fa-thumbs-up',
              message: 'Liked',
              position: 'bottom',
              timeout: 3000,
            })
          }).catch((err) => {
            console.log(err);
            this.$q.notify({
              type: 'error',
              message: 'Something went wrong with liking, please refresh and try again'
            })
          })
        }
      },
      sendChat() {
        this.$q.loading.show();
        let comment = {
          sentBy: this.user._id,
          message: this.message,
          upVote: [],
          replies: [],
          createdAt: new Date(),
        };
        this.article.comments.push(comment);
        this.article.save().then(() => {
          this.$q.loading.hide();
          this.$q.notify({
            color: 'secondary',
            textColor: 'white',
            icon: 'mdi-comment-text-multiple',
            message: 'Comment Added',
            position: 'bottom',
            timeout: 6000,
          })
          this.message = '';
        }).catch(() => {
          this.$q.loading.hide();
          this.$q.notify({
            color: 'primary',
            textColor: 'white',
            icon: 'mdi-comment-text-multiple',
            message: 'Something went wrong, please refresh and try again.',
            position: 'bottom',
            timeout: 10000,
          })
        })
      }
    }
  };
</script>

<style scoped>


  .specialFont {
    font-family: "Kuchek", Times, Serif;
    line-height: 1.2em;
    font-weight: 500;
    font-size: 1.4em;
  }


  .aboutFont {
    font-family: "KuchekThin", Times, Serif;
    line-height: 1em;
    font-weight: 550;
    font-size: 1em;
  }

  .nameFont {
    font-family: "KuchekMedium", Times, Serif;
    line-height: 1em;
    font-weight: 400;
    font-size: 1em;
  }
</style>

<template>
    <q-page class="flex flex-center" style="background: #FAFBFD;">
      <div>
      <q-card class="mainCard" :flat="cardFlat" :dark="cardDark">
        <div>
          <q-avatar size="75px" color="primary" text-color="white" :icon="headerIcon" class="floatingIcon"/>
        </div>
        <q-card-section class="flex items-end justify-center headerSection q-mb-md" :class="cardDark ? 'headerSectionDark' : 'headerSectionLight'">
          <span class="mainFont q-mb-md" style="font-size: 1.3em;font-weight: 400;">{{headerText}}</span>
        </q-card-section>
        <div class="q-pt-xs"
             style="height: 50%;display: flex; justify-content: space-evenly;flex-direction: column;align-items: center;">
          <div class="inputWrapper">
            <label for="email" class="inputFont q-pb-sm" style="width: 95%;">SIGN IN WITH YOUR E-MAIL ADDRESS</label>
            <input type="email" v-model="user.email" name="email" id="email" style="width: 95%;"
                   :style="error ? 'border: 1px solid var(--q-color-negative);' : ''"/>
          </div>
          <div style="width: 95%;">
            <div
              style="width: 100%;display: flex; justify-content: center;position: relative;flex-direction: column;align-items: center;">
              <label for="password" class="inputFont q-pb-sm" style="width: 95%;">PASSWORD</label>
              <input :type="isPasswordType ? 'text' : 'password'" v-model="user.password" name="password" id="password"
                     style="width: 95%;" @keyup.enter="signIn"
                     :style="error ? 'border: 1px solid var(--q-color-negative);' : ''"/>
              <q-icon :name="isPasswordType ? 'visibility' : 'visibility_off'"
                      class="q-mr-sm cursor-pointer passwordIcon"
                      @click.stop="isPasswordType = !isPasswordType"></q-icon>
            </div>
          </div>
          <transition name="fade">
            <div v-if="error" class="mainFont" style="font-size: 0.9em;color: var(--q-color-negative);">
              Incorrect email or password
            </div>
          </transition>
          <div class="flex justify-center" style="width: 100%;">
            <button class="logInButton q-mt-xs cursor-pointer" @click="signIn" id="loginButton"><span>Sign In</span>
              <q-inner-loading :showing="loading">
                <q-spinner
                  color="primary"
                  size="3em"
                  :thickness="2"
                />
              </q-inner-loading>
            </button>
          </div>
        </div>
        <div class="q-my-md centerCenter" v-if="socialLinks.length > 0">
          <div style="width: 25%;height: 1px;background: rgba(220, 220, 220, 1)"></div>
          <span class="q-mx-md inputFont" style="font-size: 0.9em;font-weight: 500;white-space: nowrap;">Sign in with social networks</span>
          <div style="width: 25%;height: 1px;background: rgba(220, 220, 220, 1)"></div>
        </div>
        <OAuthLinks :social-links="socialLinks"></OAuthLinks>
      </q-card>
      <div class="row flex justify-between q-mt-sm">
        <div class="inputFont cursor-pointer" @click="$router.push('/register')">
          Don't have an account yet?
        </div>
        <div class="inputFont cursor-pointer" @click="$emit('forgotPassword')">
          Forgot your password?
        </div>
      </div>
      </div>
    </q-page>
</template>

<script>
  import {mapActions} from 'vuex';
  import OAuthLinks from '../../OAuthRegistration/OAuthLinks/OAuthLinks';

  const isEmailRule = (val) => {
    let reg = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
    return !reg.test(val);
  };

  export default {
    name: 'OAuthLoginForm',
    components: {
      OAuthLinks
    },
    props: {
      headerIcon: {
        type: String,
        default: 'fas fa-sign-in-alt',
      },
      headerText: {
        type: String,
        default: 'Welcome Back! Sign In',
      },
      facebook: {
        type: Boolean,
        default: true,
      },
      google: {
        type: Boolean,
        default: true,
      },
      emitValues: {
        type: Boolean,
        default: false,
      },
      cardFlat: {
        type: Boolean,
        default: false,
      },
      cardDark: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        error: false,
        loading: false,
        isPasswordType: false,
        user: {
          email: '',
          password: '',
        },
        possibleLinks: [
          {
            name: 'Google',
            icon: 'mdi-google',
            img: 'https://rayraysolarstatic.s3-us-west-1.amazonaws.com/Google__G__Logo.svg.png',
            color: 'red',
            link: `${process.env.VUE_APP_FEATHERS_URL}/oauth/google`
          },
          {
            name: 'Facebook',
            icon: 'mdi-facebook',
            color: '#2090E1',
            link: `${process.env.VUE_APP_FEATHERS_URL}/oauth/facebook`
          },
        ]
      }
    },
    computed: {
      socialLinks(){
        let arr = [];
        if(this.google){
          arr.push(this.possibleLinks[0]);
        }
        if(this.facebook){
          arr.push(this.possibleLinks[1]);
        }
        return arr;
      },
    },
    methods: {
      ...mapActions('auth', {
        auth: 'authenticate'
      }),
      signIn() {
        if(!this.emitValues) {
          this.loading = true;
          setTimeout(() => {
            this.auth({...this.user, strategy: 'local'}).then((res) => {
              this.loading = false;
              this.$router.push('/');
              this.$q.notify({
                type: 'positive',
                message: `Welcome back ${this.user.email}`
              })
            }).catch((err) => {
              console.log(err);
              // if err is not authenticated
              if (err.code === 401) {
                this.loading = false;
                this.error = true;
                let button = document.getElementById('loginButton');
                button.classList.add('shake');
                setTimeout(() => {
                  button.classList.remove('shake');
                }, 800)
              } else {
                this.$q.notify({
                  type: 'negative',
                  message: 'Something went wrong, check your connection and try again.'
                })
              }

            })
          }, 500)
        }else {
          this.$emit('submit', this.user);
        }
      }
    }
  };
</script>

<style scoped lang="scss" src="./_OAuthLoginForm.scss">

</style>

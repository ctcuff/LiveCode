<template>
  <div>
    <md-dialog :md-active.sync="showDialog" :md-fullscreen="false" :md-click-outside-to-close="false">
      <md-dialog-title>
        {{authErrorOccurred ? 'Oops!' : 'Chose sign in method'}}
      </md-dialog-title>
      <div v-if="!authErrorOccurred">
        <md-list :class="listDisabled">
          <md-list-item @click="signIn('google')" :disabled="isAuthInProgress">
            <md-icon :md-src="googleSvg"></md-icon>
            <span class="md-list-item-text">Sign in with Google</span>
          </md-list-item>
          <md-list-item @click="signIn('github')" :disabled="isAuthInProgress">
            <md-icon :md-src="githubSvg"></md-icon>
            <span class="md-list-item-text">Sign in with GitHub</span>
          </md-list-item>
        </md-list>
      </div>
      <div v-else>
        <md-dialog-content id="auth-error-msg">
          <span>{{errorMsg}}</span>
        </md-dialog-content>
      </div>
      <md-dialog-actions>
        <md-button class="md-primary" @click="hide">Close</md-button>
        <md-button class="md-primary" @click="authErrorOccurred = false" v-if="authErrorOccurred">
          Retry
        </md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import googleSvg from '@/assets/svg/google.svg';
  import githubSvg from '@/assets/svg/github.svg';

  export default {
    data() {
      return {
        githubSvg,
        googleSvg,
        authErrorOccurred: false,
        errorMsg: '',
        isAuthInProgress: false
      };
    },
    computed: {
      ...mapState('signInDialog', ['showDialog']),
      listDisabled() {
        return {
          'list-disabled': this.isAuthInProgress
        };
      }
    },
    methods: {
      ...mapMutations('user', ['setEmail']),
      hide() {
        this.authErrorOccurred = false;
        this.$store.dispatch('signInDialog/hide');
      },
      signIn(method) {
        if (this.isAuthInProgress) {
          return;
        }
        this.isAuthInProgress = true;
        const firebase = this.$root.$firebase;

        const provider = (method === 'google')
          ? new firebase.auth.GoogleAuthProvider()
          : new firebase.auth.GithubAuthProvider();

        firebase.auth().signInWithPopup(provider)
          .then(this.hide)
          .catch(({ code, message }) => {
            if (code === 'auth/popup-closed-by-user') {
              return;
            }
            this.authErrorOccurred = true;
            this.errorMsg = message;
          })
          .finally(() => (this.isAuthInProgress = false));
      }
    }
  };
</script>

<style lang="scss" scoped>
  .md-dialog-title {
    padding: 24px 24px 0 16px;
  }

  .md-dialog-content {
    padding: 0 24px;
  }

  #auth-error-msg {
    padding-top: 0;
  }

  .list-disabled {
    opacity: 0.5;
  }
</style>


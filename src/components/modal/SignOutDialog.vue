<template>
  <md-dialog :md-active.sync="showDialog">
    <md-dialog-title>Sign out</md-dialog-title>
    <md-dialog-content id="auth-error-msg">
      <span>Are you sure you want to sign out?</span>
    </md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-primary" @click="hide">Cancel</md-button>
      <md-button class="md-primary" @click="signOut">Yes</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
  import { mapState, mapActions } from 'vuex';

  export default {
    computed: {
      ...mapState('user', ['workspaceId']),
      showDialog: {
        get() {
          return this.$store.state.signOutDialog.showDialog;
        },
        set() {
          this.$store.commit('signOutDialog/setShowDialog', false);
        }
      }
    },
    methods: {
      ...mapActions('signOutDialog', ['hide']),
      ...mapActions('snackbar', ['showSnackbar']),
      ...mapActions('user', [
        'disconnectFromWorkspace',
        'clearSession'
      ]),
      async signOut() {
        await this.$firebaseDB
          .ref(`/workspaces/${this.workspaceId}`)
          .update({ online: false })
          .catch(err => console.log(err));

        await this.disconnectFromWorkspace();
        await this.clearSession();
        await this.$firebase.auth().signOut();
        await this.hide();

        this.showSnackbar('Successfully signed out');
      }
    }
  };
</script>

<style lang="scss" scoped>
  .md-dialog-title {
    padding: 24px 24px 0 16px;
  }

  .md-dialog-content {
    padding: 4px 24px 6px 24px;
  }
</style>
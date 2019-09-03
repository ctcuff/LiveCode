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
      ...mapState('signOutDialog', ['showDialog']),
      ...mapState('user', ['workspaceId'])
    },
    methods: {
      ...mapActions('signOutDialog', ['hide']),
      ...mapActions('snackbar', ['showSnackbar']),
      signOut() {
        this.$firebaseDB
          .ref(`/workspaces/${this.workspaceId}`)
          .update({ online: false })
          .then(() => {
            this.$firebase.auth().signOut();
            this.showSnackbar('Successfully signed out');
          })
          .catch(err => console.log(err))
          .finally(this.hide);
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
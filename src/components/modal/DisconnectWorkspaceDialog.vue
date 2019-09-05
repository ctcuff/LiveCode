<template>
  <div>
    <md-dialog :md-active.sync="showDialog" :md-fullscreen="false">
      <md-dialog-title>
        Connected Workspace
      </md-dialog-title>
      <div class="dialog-body">
        <p>You are currently connected to {{connectedWorkspaceEmail}}'s workspace</p>
      </div>
      <md-dialog-actions>
        <md-button class="md-primary" @click="hide">Close</md-button>
        <md-button class="md-primary" @click="disconnect" :disabled="isButtonDisabled">
          Disconnect
        </md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    data() {
      return {
        isButtonDisabled: false,
        connectedWorkspaceEmail: this.$store.state.user.connectedWorkspaceEmail
      };
    },
    computed: {
      showDialog: {
        get() {
          return this.$store.state.disconnectWorkspaceDialog.showDialog;
        },
        set() {
          this.$store.commit('disconnectWorkspaceDialog/setShowDialog', false);
        }
      }
    },
    methods: {
      ...mapActions('disconnectWorkspaceDialog', ['hide']),
      ...mapActions('user', ['disconnectFromWorkspace']),
      ...mapActions('snackbar', ['showSnackbar']),
      disconnect() {
        this.isButtonDisabled = true;
        this.disconnectFromWorkspace()
          .finally(() => {
            this.isButtonDisabled = false;
            this.showSnackbar(`Disconnected from ${this.connectedWorkspaceEmail}'s workspace`);
            this.hide();
          });

      }
    }
  };
</script>

<style lang="scss" scoped>
  .dialog-body {
    padding: 0 16px;

    & p {
      font-size: 16px;
    }
  }
</style>
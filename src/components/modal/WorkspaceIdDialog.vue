<template>
  <div>
    <md-dialog :md-active.sync="showDialog" :md-fullscreen="false">
      <md-dialog-title>
        Workspace ID
      </md-dialog-title>
      <div class="dialog-body" v-if="isSignedIn">
        <p>Your workspace ID is
          <span id="workspace-id">
            <b>{{workspaceId}}</b>
          </span>
        </p>
        <p>Share this with others so they can connect to your editor.</p>
      </div>
      <div class="dialog-body" v-else>
        <p>Sign in to view your workspace ID</p>
      </div>
      <md-dialog-actions>
        <md-button class="md-primary" @click="hide">Close</md-button>
        <md-button class="md-primary" @click="copyToClipboard" v-if="isSignedIn">
          Copy
          <md-tooltip>Copy to clipboard</md-tooltip>
        </md-button>
        <md-button class="md-primary" @click="openSignInDialog" v-else>
          Sign in
        </md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';

  export default {
    data() {
      return {
        snackbarText: 'ID Copied to clipboard'
      };
    },
    computed: {
      showDialog: {
        get() {
          return this.$store.state.workspaceIdDialog.showDialog;
        },
        set() {
          this.$store.commit('workspaceIdDialog/setShowDialog', false);
        }
      },
      ...mapState('user', ['isSignedIn', 'workspaceId'])
    },
    methods: {
      ...mapActions('workspaceIdDialog', ['hide']),
      ...mapActions('snackbar', ['showSnackbar']),
      openSignInDialog() {
        this.$store.dispatch('signInDialog/show');
        this.hide();
      },
      fallbackCopyToClipboard() {
        const textArea = document.createElement("textarea");
        textArea.value = this.workspaceId;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand('copy');
          this.showSnackbar(this.snackbarText);
          this.hide();
        } catch (err) {
          console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
      },
      copyToClipboard() {
        if (!navigator.clipboard) {
          this.fallbackCopyToClipboard();
          return;
        }
        navigator.clipboard.writeText(this.workspaceId)
          .then(() => {
            this.showSnackbar(this.snackbarText);
            this.hide();
          })
          .catch(err => console.log(err));
      }
    }
  };
</script>

<style lang="scss" scoped>
  .md-dialog.md-theme-default {
    padding: 0 16px;
  }

  .md-dialog-title {
    padding: 24px 24px 0 0;
  }

  .dialog-body p {
    font-size: 16px;
  }

  #workspace-id {
    letter-spacing: 2px;
    margin-left: 2px;
  }

  .md-snackbar.md-theme-default {
    background-color: #424242;
    color: #fff;
  }
</style>
<template>
  <div>
    <md-dialog :md-active.sync="showDialog" :md-fullscreen="false">
      <md-dialog-title>
        Connect to Workspace
      </md-dialog-title>
      <div v-if="isSignedIn">
        <md-field id="workspace-field">
          <md-icon>
            info
            <md-tooltip>This is the id of the workspace you'd like to connect to</md-tooltip>
          </md-icon>
          <label>Workspace ID</label>
          <md-input v-model="connectWorkspaceId" maxlength="8" spellcheck="false" required></md-input>
        </md-field>

        <md-field>
          <md-icon>
            person
            <md-tooltip>
              This is the username others will see when you connect
              to their workspace
            </md-tooltip>
          </md-icon>
          <label>Alias</label>
          <md-input v-model="email" disabled></md-input>
        </md-field>
      </div>
      <div class="dialog-body" v-else>
        <p>Sign in to connect to a workspace</p>
      </div>
      <p class="error-msg" v-if="errorMessage !== null">{{errorMessage}}</p>
      <md-dialog-actions>
        <md-button class="md-primary" @click="closeDialog">Close</md-button>
        <md-button
            class="md-primary"
            @click="connect"
            :disabled="isButtonDisabled"
            v-if="isSignedIn"
        >
          <span>Connect</span>
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
        connectWorkspaceId: '',
        isButtonDisabled: true,
        errorMessage: null
      };
    },
    computed: {
      showDialog: {
        get() {
          return this.$store.state.connectWorkspaceDialog.showDialog;
        },
        set() {
          this.$store.commit('connectWorkspaceDialog/setShowDialog', false);
        }
      },
      ...mapState('user', [
        'isSignedIn',
        'email',
        'connectedWorkspaceId'
      ]),
      ...mapState('user', {
        userWorkspaceId: 'workspaceId',
        connectedWorkspaceEmail: 'connectedWorkspaceEmail'
      })
    },
    watch: {
      connectWorkspaceId(value) {
        // Only allow letters and numbers
        const regex = /^[a-z0-9]+$/i;

        if (value === this.userWorkspaceId) {
          this.isButtonDisabled = true;
          this.errorMessage = "You can't connect to your own workspace!";
        } else if (value && !regex.test(value)) {
          this.isButtonDisabled = true;
          this.errorMessage = "A workspace ID can only contain alphanumeric characters";
        } else if (value.length !== 8) {
          this.isButtonDisabled = true;
          this.errorMessage = null;
        } else {
          this.isButtonDisabled = false;
        }
      }
    },
    methods: {
      ...mapActions('connectWorkspaceDialog', ['hide']),
      ...mapActions('user', ['connectToWorkspace']),
      ...mapActions('snackbar', ['showSnackbar']),
      closeDialog() {
        // Need to reset the state of the dialog
        // when the close button is clicked
        this.isButtonDisabled = false;
        this.errorMessage = null;
        this.connectWorkspaceId = '';
        this.hide();
      },
      openSignInDialog() {
        this.$store.dispatch('signInDialog/show');
        this.hide();
      },
      connect() {
        this.isButtonDisabled = true;
        this.errorMessage = null;
        this.connectWorkspaceId = this.connectWorkspaceId.toUpperCase();
        this.connectToWorkspace(this.connectWorkspaceId)
          .then(async () => {
            await this.hide();
            await this.showSnackbar(`Connected to ${this.connectedWorkspaceEmail}'s workspace`);
          })
          .catch(err => {
            this.errorMessage = err.message;
          });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .md-dialog.md-theme-default {
    padding: 0 16px;
  }

  #workspace-field {
    margin: 0 0 24px 0;

    & .md-input {
      text-transform: uppercase;
    }
  }

  .md-dialog-title {
    padding: 24px 24px 0 0;
  }

  .dialog-body p {
    font-size: 16px;
  }

  .md-dialog-content {
    padding: 0 24px;
  }

  .md-field {
    margin: 4px 0 6px 0;

    // Removes the underline from the icons
    // before the input
    &.md-theme-default > .md-icon:after {
      background-color: #424242;
    }

    // Removes the underline from the alias input
    &.md-theme-default.md-disabled:after {
      height: 0;
    }
  }

  .error-msg {
    max-width: 266px;
  }
</style>
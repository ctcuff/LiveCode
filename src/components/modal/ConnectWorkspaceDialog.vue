<template>
  <div>
    <md-dialog :md-active.sync="showDialog" :md-click-outside-to-close="false" :md-fullscreen="false">
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
          <md-input v-model="alias" disabled></md-input>
        </md-field>
      </div>
      <div class="dialog-body" v-else>
        <p>Sign in to connect to a workspace</p>
      </div>

      <md-dialog-actions>
        <md-button class="md-primary" @click="hide">Close</md-button>
        <md-button
            class="md-primary"
            @click="connectToWorkspace"
            :disabled="connectWorkspaceId.length !== 8"
            v-if="isSignedIn"
        >
          <md-progress-spinner
              class="md-primary"
              md-mode="indeterminate"
              :md-diameter="20"
              :md-stroke="2"
              v-if="isConnecting"
          ></md-progress-spinner>
          <span v-else>Connect</span>
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
  import { connectWorkspaceDialog } from '@/store/modules/moduleNames';

  export default {
    data() {
      return {
        connectWorkspaceId: '',
        isConnecting: false
      };
    },
    computed: {
      ...mapState(connectWorkspaceDialog, ['showDialog']),
      ...mapState('user', ['isSignedIn', 'workspaceId']),
      alias() {
        return `user-${this.workspaceId}`;
      }
    },
    methods: {
      ...mapActions(connectWorkspaceDialog, ['hide']),
      openSignInDialog() {
        this.$store.dispatch('signInDialog/show');
        this.hide();
      },
      connectToWorkspace() {
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

  // Removes the underline from the alias input
  .md-field {
    margin: 4px 0 6px 0;

    // Removes the underline from the icons
    // before the input
    &.md-theme-default > .md-icon:after {
      background-color: #424242;
    }

    &.md-theme-default.md-disabled:after {
      height: 0;
    }
  }
</style>
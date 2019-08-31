<template>
  <div>
    <md-dialog :md-active.sync="showDialog" :md-click-outside-to-close="false" :md-fullscreen="false">
      <md-dialog-title>
        Connect to Workspace
      </md-dialog-title>
      <md-field id="workspace-field">
        <md-icon>
          info
          <md-tooltip>This is the id of the workspace you'd like to connect to</md-tooltip>
        </md-icon>
        <label>Workspace ID</label>
        <md-input v-model="workspaceId" maxlength="8" required></md-input>
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

      <md-dialog-actions>
        <md-button class="md-primary" @click="hide">Close</md-button>
        <md-button
            class="md-primary"
            @click="connectToWorkspace"
            :disabled="workspaceId.length !== 8"
        >
          Connect
        </md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  import Vue from 'vue';
  import MdDialog from 'vue-material/dist/components/MdDialog';
  import MdButton from 'vue-material/dist/components/MdButton';
  import MdField from 'vue-material/dist/components/MdField';
  import MdIcon from 'vue-material/dist/components/MdIcon';
  import MdTooltip from 'vue-material/dist/components/MdTooltip';
  import MdDivider from 'vue-material/dist/components/MdDivider';
  import { mapState, mapActions } from 'vuex';
  import { connectWorkspaceDialog } from '@/store/modules/moduleNames';

  Vue.use(MdDialog);
  Vue.use(MdButton);
  Vue.use(MdField);
  Vue.use(MdIcon);
  Vue.use(MdTooltip);
  Vue.use(MdDivider);

  export default {
    data() {
      return {
        workspaceId: '',
        alias: 'user-' + this.$root.workspaceId,
        hasError: false
      };
    },
    computed: mapState(connectWorkspaceDialog, ['showDialog']),
    methods: {
      ...mapActions(connectWorkspaceDialog, ['hide']),
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

    }
  }

  .md-field > .md-icon:after {
    width: 0;
  }

  .md-dialog-title {
    padding: 24px 24px 0 0;
  }

  .dialog-body p {
    font-size: 16px;
  }
</style>
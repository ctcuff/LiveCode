<template>
  <div>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>
        <md-icon>info</md-icon>
        Workspace ID
      </md-dialog-title>
      <div id="dialog-body">
        <p>Your workspace ID is
          <span id="workspace-id">
            <b>{{workspaceId}}</b>
          </span>
        </p>
        <p>Share this with others so they can connect to your editor</p>
      </div>
      <md-dialog-actions>
        <md-button class="md-primary" @click="hide">Close</md-button>
        <md-button class="md-primary" @click="copyToClipboard">
          Copy
          <md-tooltip>Copy to clipboard</md-tooltip>
        </md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-snackbar
        md-position="center"
        :md-duration="3000"
        :md-active.sync="showSnackbar"
    >
      <span>ID Copied to clipboard</span>
      <md-button class="md-primary" @click="showSnackbar = false">dismiss</md-button>
    </md-snackbar>
  </div>
</template>

<script>
  import Vue from 'vue';
  import MdButton from 'vue-material/dist/components/MdButton';
  import MdDialog from 'vue-material/dist/components/MdDialog';
  import MdTooltip from 'vue-material/dist/components/MdTooltip';
  import MdSnackbar from 'vue-material/dist/components/MdSnackbar';
  import { mapState, mapActions } from 'vuex';
  import { workspaceIdDialog } from '@/store/modules/moduleNames';

  Vue.use(MdButton);
  Vue.use(MdDialog);
  Vue.use(MdTooltip);
  Vue.use(MdSnackbar);

  export default {
    data() {
      return {
        showSnackbar: false,
        workspaceId: this.$root.workspaceId
      };
    },
    computed: mapState(workspaceIdDialog, ['showDialog']),
    methods: {
      ...mapActions(workspaceIdDialog, ['hide']),
      fallbackCopyToClipboard() {
        const textArea = document.createElement("textarea");
        textArea.value = this.workspaceId;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand('copy');
          this.showSnackbar = true;
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
            this.showSnackbar = true;
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

  #dialog-body p {
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
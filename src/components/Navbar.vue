<template>
  <md-toolbar md-elevation="0">
    <md-button class="md-icon-button" @click="openMenu" title="Settings">
      <md-icon>settings</md-icon>
    </md-button>

    <md-button class="md-icon-button" @click="toggleFullscreen" title="Toggle fullscreen">
      <md-icon v-if="isFullScreen">fullscreen_exit</md-icon>
      <md-icon v-else>fullscreen</md-icon>
    </md-button>

    <md-button class="md-icon-button" title="Connect to workspace" @click="openConnectDialog">
      <md-icon>meeting_room</md-icon>
      <ConnectWorkspaceDialog />
    </md-button>

    <md-button class="md-icon-button" @click="openIdDialog" title="View workspace id">
      <md-icon>info</md-icon>
      <WorkspaceIdDialog />
    </md-button>

  </md-toolbar>
</template>

<script>
  import WorkspaceIdDialog from '@/components/modal/WorkspaceIdDialog';
  import ConnectWorkspaceDialog from '@/components/modal/ConnectWorkspaceDialog';
  import { mapActions, mapState } from 'vuex';

  // Events fired when the site enters fullscreen
  const events = [
    'mozfullscreenchange',
    'fullscreenchange',
    'webkitfullscreenchange',
    'requestFullscreen'
  ];

  export default {
    components: {
      WorkspaceIdDialog,
      ConnectWorkspaceDialog
    },
    name: 'Navbar',
    data() {
      return {
        isFullScreen: document.fullscreenElement
      };
    },
    mounted() {
      events.forEach(event => {
        document.addEventListener(event, this.toggleFullscreenIcon);
      });
    },
    destroyed() {
      events.forEach(event => {
        document.removeEventListener(event, this.toggleFullscreenIcon);
      });
    },
    computed: mapState('user', ['isSignedIn']),
    methods: {
      ...mapActions('workspaceIdDialog', { openIdDialog: 'show' }),
      ...mapActions('settingsDrawer', { openMenu: 'show' }),
      ...mapActions('connectWorkspaceDialog', { openConnectDialog: 'show' }),
      toggleFullscreenIcon() {
        this.isFullScreen =
          document.fullScreen ||
          document.mozFullScreen ||
          document.webkitIsFullScreen;
      },
      toggleFullscreen() {
        if (document.fullScreenElement ||
          (!document.mozFullScreen && !document.webkitIsFullScreen)) {
          if (document.documentElement.requestFullScreen) {
            document.documentElement.requestFullScreen();
          } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
          } else if (document.documentElement.webkitRequestFullScreen) {
            document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
          }
        } else {
          if (document.cancelFullScreen) {
            document.cancelFullScreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
          }
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../assets/scss/navbar";


  .md-icon.md-theme-default.md-icon-font {
    color: #b9b9b9
  }

  .md-toolbar {
    height: $navbar-height;
    min-height: $navbar-height;

    &.md-theme-default {
      background-color: $navbar-color;
    }
  }
</style>
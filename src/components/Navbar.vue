<template>
  <md-toolbar md-elevation="0">
    <md-button class="md-icon-button" @click="openMenu" title="Settings">
      <md-icon>settings</md-icon>
    </md-button>

    <md-button class="md-icon-button" @click="toggleFullscreen" title="Toggle fullscreen">
      <md-icon v-if="isFullScreen">fullscreen_exit</md-icon>
      <md-icon v-else>fullscreen</md-icon>
    </md-button>

    <md-button class="md-icon-button" @click="() => {}" title="Connect to workspace">
      <md-icon>people_alt</md-icon>
    </md-button>

    <md-button class="md-icon-button" @click="openIdDialog" title="View workspace id">
      <md-icon>info</md-icon>
      <WorkspaceIdDialog />
    </md-button>

  </md-toolbar>
</template>

<script>
  import Vue from 'vue';
  import MdButton from 'vue-material/dist/components/MdButton';
  import MdIcon from 'vue-material/dist/components/MdIcon';
  import MdToolbar from 'vue-material/dist/components/MdToolbar';
  import WorkspaceIdDialog from '@/components/modal/WorkspaceIdDialog';
  import { workspaceIdDialog, settingsDrawer } from '@/store/modules/moduleNames';
  import { mapActions } from 'vuex';

  // Events fired when the site enters fullscreen
  const events = [
    'mozfullscreenchange',
    'fullscreenchange',
    'webkitfullscreenchange',
    'requestFullscreen'
  ];

  Vue.use(MdButton);
  Vue.use(MdIcon);
  Vue.use(MdToolbar);

  export default {
    components: {
      WorkspaceIdDialog
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
    methods: {
      ...mapActions(workspaceIdDialog, {
        openIdDialog: 'show'
      }),
      ...mapActions(settingsDrawer, {
        openMenu: 'show'
      }),
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

  nav {
    align-items: center;
    height: $navbar-height;
    color: white;
    display: flex;
    font-family: 'Avenir', Consolas, monospace;
    background-color: #333333;
    width: 100%;
  }

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
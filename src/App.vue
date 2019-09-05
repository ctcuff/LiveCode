<template>
  <div id="app">
    <SettingsDrawer />
    <Navbar />
    <Editor />
    <Gutter />
    <Snackbar />
  </div>
</template>

<script>
  import Editor from '@/components/Editor';
  import Navbar from '@/components/Navbar';
  import Gutter from '@/components/Gutter';
  import SettingsDrawer from '@/components/SettingsDrawer';
  import Snackbar from '@/components/modal/Snackbar';

  export default {
    components: {
      Snackbar,
      Editor,
      Navbar,
      Gutter,
      SettingsDrawer,
    }
  };
</script>

<style lang="scss">
  #app {
    user-select: none;
  }
  .md-dialog.md-theme-default {
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: #424242;
    }

    &::-webkit-scrollbar-thumb {
      background: #9e9e9e;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #828181;
    }
  }

  .md-dialog-container {
    // Fixes blurry text in Chrome
    -webkit-filter: blur(0.000001px);
  }
</style>
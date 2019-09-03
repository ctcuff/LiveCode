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

<style>
  #app {
    user-select: none;
  }
</style>
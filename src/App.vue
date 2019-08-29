<template>
  <div id="app">
    <SettingsDrawer />
    <Navbar />
    <Editor />
    <Gutter />
  </div>
</template>

<script>
  import Editor from '@/components/Editor';
  import Navbar from '@/components/Navbar';
  import Gutter from '@/components/Gutter';
  import SettingsDrawer from '@/components/SettingsDrawer';

  export default {
    components: {
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
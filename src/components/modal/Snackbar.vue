<template>
  <md-snackbar
      md-position="center"
      :md-duration="3000"
      :md-active.sync="show"
  >
    <span>{{message}}</span>
    <md-button class="md-primary" @click="hideSnackbar">dismiss</md-button>
  </md-snackbar>
</template>

<script>
  import { mapState, mapActions } from 'vuex';

  export default {
    computed: {
      ...mapState('snackbar', ['message']),
      show: {
        get() {
          return this.$store.state.snackbar.show;
        },
        set() {
          // set is called by the md-snackbar component but
          // it doesn't set the state so we have to manually set
          // the state of the snackbar here
          this.$store.commit('snackbar/setShowSnackbar', false, null);
        }
      }
    },
    methods: mapActions('snackbar', ['hideSnackbar'])
  };
</script>

<style lang="scss" scoped>
  .md-snackbar.md-theme-default {
    background-color: #424242;
    color: #fff;
  }
</style>

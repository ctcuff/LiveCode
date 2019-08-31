<template>
  <md-dialog :md-active.sync="showDialog">
    <md-dialog-title>Sign out</md-dialog-title>
    <md-dialog-content id="auth-error-msg">
      <span>Are you sure you want to sign out?</span>
    </md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-primary" @click="hide">Cancel</md-button>
      <md-button class="md-primary" @click="signOut">Yes</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
  import Vue from 'vue';
  import { mapState, mapActions } from 'vuex';
  import { signOutDialog } from '@/store/modules/moduleNames';
  import MdDialog from 'vue-material/dist/components/MdDialog';
  import MdButton from 'vue-material/dist/components/MdButton';
  import MdIcon from 'vue-material/dist/components/MdIcon';
  import MdList from 'vue-material/dist/components/MdList';

  Vue.use(MdDialog);
  Vue.use(MdButton);
  Vue.use(MdIcon);
  Vue.use(MdList);

  export default {
    computed: {
      ...mapState(signOutDialog, ['showDialog'])
    },
    methods: {
      ...mapActions(signOutDialog, ['hide']),
      signOut() {
        this.$firebase.auth().signOut();
        this.hide();
      }
    }
  };
</script>

<style lang="scss" scoped>
  .md-dialog-title {
    padding: 24px 24px 0 16px;
  }

  .md-dialog-content {
    padding: 4px 24px 6px 24px;
  }
</style>
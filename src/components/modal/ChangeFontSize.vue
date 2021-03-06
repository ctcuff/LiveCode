<template>
  <div>
    <md-dialog :md-active.sync="showDialog" :md-fullscreen="false">
      <md-dialog-title>Change font size</md-dialog-title>
      <md-field :class="errorClass">
        <label>Font size (px)</label>
        <md-input v-model="inputText" type="number" min="5" max="42"></md-input>
        <span class="md-error">{{errorMessage}}</span>
      </md-field>

      <md-dialog-actions>
        <md-button class="md-primary" @click="hide">Cancel</md-button>
        <md-button class="md-primary" @click="saveFontSize">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  import { mapActions, mapMutations } from 'vuex';

  export default {
    data() {
      return {
        noError: null,
        inputText: this.$store.state.editor.fontSize,
        hasError: false,
        errorMessage: null
      };
    },
    computed: {
      showDialog: {
        get() {
          return this.$store.state.fontDialog.showDialog;
        },
        set() {
          this.$store.commit('fontDialog/setShowDialog', false);
        }
      },
      errorClass() {
        return {
          'md-invalid': this.hasError
        };
      },
    },
    watch: {
      inputText() {
        this.verifyFontSize();
      }
    },
    methods: {
      ...mapActions('fontDialog', ['hide']),
      ...mapMutations('editor', ['setFontSize']),
      verifyFontSize() {
        const value = parseInt(this.inputText);

        if (!value) {
          this.errorMessage = 'Enter a value';
          this.hasError = true;
          return false;
        }
        if (value < 5 || value > 42) {
          this.errorMessage = 'Value out of range [5 - 42]';
          this.hasError = true;
          return false;
        }

        this.hasError = false;
        return true;
      },
      saveFontSize() {
        if (!this.verifyFontSize()) {
          return;
        }
        this.setFontSize(parseInt(this.inputText));
        this.hide();
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
</style>

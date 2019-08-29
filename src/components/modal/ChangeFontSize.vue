<template>
  <div>
    <md-dialog :md-active.sync="show" :md-click-outside-to-close="false">
      <md-dialog-title>Change font size</md-dialog-title>
      <md-field :class="errorClass">
        <label>Font size (px)</label>
        <md-input v-model="inputText" type="number" min="5" max="42"></md-input>
        <span class="md-error">{{errorMessage}}</span>
      </md-field>

      <md-dialog-actions>
        <md-button class="md-primary" @click="show = false">Cancel</md-button>
        <md-button class="md-primary" @click="saveFontSize">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  import Vue from 'vue';
  import MdDialog from 'vue-material/dist/components/MdDialog';
  import MdButton from 'vue-material/dist/components/MdButton';
  import MdField from 'vue-material/dist/components/MdField';
  import { EventBus, Events } from '@/util/eventBus';
  import editorStore from '@/store/editorConfig';

  Vue.use(MdDialog);
  Vue.use(MdButton);
  Vue.use(MdField);

  export default {
    data() {
      return {
        show: false,
        noError: null,
        inputText: editorStore.state.fontSize,
        hasError: false,
        errorMessage: null
      };
    },
    computed: {
      errorClass() {
        return {
          'md-invalid': this.hasError
        };
      }
    },
    mounted() {
      EventBus.$on(Events.SHOW_FONT_DIALOG, () => (this.show = true));
    },
    watch: {
      inputText() {
        this.verifyFontSize();
      }
    },
    methods: {
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
        this.show = false;
        editorStore.commit('setFontSize', parseInt(this.inputText));
      }
    }
  };
</script>

<style lang="scss" scoped>
  .md-dialog.md-theme-default {
    padding: 0 16px;
  }
</style>

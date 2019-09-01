<template>
  <div>
    <md-dialog :md-active.sync="showDialog" :md-click-outside-to-close="false" :md-fullscreen="false">
      <md-dialog-title>Indentation Style</md-dialog-title>
      <md-checkbox v-model="useTabs" class="md-primary">
        Indent using tabs<br />
      </md-checkbox>
      <md-field>
        <label>Indent size</label>
        <md-select v-model="selectedIndentSize">
          <md-option v-for="n in 12" :key="n" :value="n">
            Indent size: {{n}}
          </md-option>
        </md-select>
      </md-field>
      <md-dialog-actions>
        <md-button class="md-primary" @click="hide">Cancel</md-button>
        <md-button class="md-primary" @click="updateIndentOptions">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  import { mapActions, mapState, mapMutations } from 'vuex';

  export default {
    data() {
      return {
        useTabs: this.$store.state.editor.useTabs,
        selectedIndentSize: this.$store.state.editor.indentSize
      };
    },
    computed: mapState('indentDialog', ['showDialog']),
    methods: {
      ...mapMutations('editor', [
        'setUseTabs',
        'setIndentSize'
      ]),
      ...mapActions('indentDialog', ['hide']),
      updateIndentOptions() {
        this.show = false;
        this.setUseTabs(this.useTabs);
        this.setIndentSize(this.selectedIndentSize);
        this.hide();
      }
    }
  };
</script>

<style lang="scss" scoped>
  .md-dialog.md-theme-default {
    padding: 0 16px;
  }

  .md-checkbox {
    margin: 16px 16px 24px 0;
  }

  .md-dialog-title {
    padding: 24px 24px 0 0;
  }
</style>
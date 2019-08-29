<template>
  <div>
    <md-dialog :md-active.sync="show" :md-click-outside-to-close="false">
      <md-dialog-title>Indentation Style</md-dialog-title>
      <md-checkbox v-model="useTabs" class="md-primary">
        Indent using tabs<br/>
        <small>The editor will use {{useTabs ? 'tabs': 'spaces'}} as indentation</small>
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
        <md-button class="md-primary" @click="show = false">Cancel</md-button>
        <md-button class="md-primary" @click="updateIndentOptions">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  import Vue from 'vue';
  import MdDialog from 'vue-material/dist/components/MdDialog';
  import MdButton from 'vue-material/dist/components/MdButton';
  import MdField from 'vue-material/dist/components/MdField';
  import MdCheckbox from 'vue-material/dist/components/MdCheckbox';
  import { EventBus, Events } from '@/util/eventBus';
  import editorStore from '@/store/editorConfig';

  Vue.use(MdDialog);
  Vue.use(MdButton);
  Vue.use(MdField);
  Vue.use(MdCheckbox);

  export default {
    data() {
      return {
        show: false,
        useTabs: editorStore.state.useTabs,
        selectedIndentSize: editorStore.state.indentSize
      };
    },
    mounted() {
      EventBus.$on(Events.SHOW_INDENTATION_DIALOG, () => (this.show = true));
    },
    methods: {
      updateIndentOptions() {
        this.show = false;
        editorStore.commit('setUseTabs', this.useTabs);
        editorStore.commit('setIndentSize', this.selectedIndentSize);
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
</style>
<template>
  <div>
    <div id="gutter" ref="gutter">
      <div class="line-info" v-if="charactersSelected > 0 || linesSelected > 0">
        <span v-if="charactersSelected > 0">
          {{charactersSelected}} chars<span v-if="linesSelected > 0">,</span>
        </span>
        <span v-if="linesSelected > 0">{{linesSelected}} lines</span>
      </div>
      <div class="line-info" v-else>
        <span>Line {{currentLine}},</span>
        <span>Column {{currentCol}}</span>
      </div>

      <span id="lang" class="editor-info">{{ selectedLanguage }}</span>
      <span class="editor-info" id="file-size">{{fileSize}} Bytes</span>
      <span
          id="indentation-type"
          class="editor-info"
          @click="showIndentDialog"
      >
        <md-tooltip md-direction="top">Click to change</md-tooltip>
        {{useTabs ? 'Tab Width' : 'Spaces'}}: {{indentSize}}
      </span>
    </div>

    <IndentationDialog />
  </div>
</template>

<script>
  import Vue from 'vue';
  import editorStore from '@/store/editorConfig';
  import { EventBus, Events } from '@/util/eventBus';
  import { allThemes } from '@/util/editorThemes';
  import IndentationDialog from '@/components/modal/IndentaionDialog';
  import MdTooltip from 'vue-material/dist/components/MdTooltip';
  // noinspection ES6CheckImport
  import { gutterDark, gutterLight } from '@/assets/scss/_gutter.scss';

  Vue.use(MdTooltip);

  export default {
    components: {
      IndentationDialog
    },
    data() {
      return {
        currentLine: 1,
        currentCol: 1,
        linesSelected: 0,
        charactersSelected: 0,
        fileSize: 0
      };
    },
    computed: {
      selectedLanguage() {
        const lang = editorStore.state.selectedLanguage;
        // Capitalize the first letter
        return lang.charAt(0).toUpperCase() + lang.slice(1);
      },
      currentTheme() {
        return editorStore.state.currentTheme;
      },
      indentSize() {
        return editorStore.state.indentSize;
      },
      useTabs() {
        return editorStore.state.useTabs;
      }
    },
    methods: {
      showIndentDialog() {
        EventBus.$emit(Events.SHOW_INDENTATION_DIALOG);
      }
    },
    watch: {
      currentTheme(selectedTheme) {
        this.$refs.gutter.style.backgroundColor = allThemes[selectedTheme].isLight
          ? gutterDark
          : gutterLight;
      }
    },
    mounted() {
      EventBus.$on(Events.UPDATE_CURSOR_POSITION, ({ lineNumber, column }) => {
        this.currentLine = lineNumber;
        this.currentCol = column;
      });

      EventBus.$on(Events.CHARACTER_SELECTION_CHANGE, ({ linesSelected, charactersSelected }) => {
        this.linesSelected = linesSelected;
        this.charactersSelected = charactersSelected;
      });

      EventBus.$on(Events.ON_TEXT_CONTENT_CHANGE, bytes => (this.fileSize = bytes));
    }
  };
</script>

<style lang="scss" scoped>
  @import "../assets/scss/gutter";

  #gutter {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: $gutter-height;
    background-color: $gutter-light;
    z-index: 1;
    display: flex;
    align-items: center;

    *:not(#indentation-type) {
      cursor: default;
    }
  }

  span {
    font-family: 'Avenir', Consolas, monospace;
    margin-right: 5px;
  }

  .editor-info {
    margin: 0 12px;
  }

  #lang {
    font-size: 14px;
    color: white;

    @media screen and (max-width: 330px) {
      display: none;
    }
  }

  #file-size {
    @media screen and (max-width: 450px) {
      display: none;
    }
  }

  .line-info {
    margin-left: 12px;
    flex: 1;

    & span {
      flex: 1;
      font-weight: 600;
    }
  }

  #indentation-type {
    cursor: pointer;
  }

</style>
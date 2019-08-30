<template>
  <div>
    <div id="gutter" ref="gutter">
      <div class="line-info" v-if="selection.chars > 0 || selection.lines > 0">
        <span v-if="selection.chars > 0">
          {{selection.chars}} chars<span v-if="selection.lines > 0">,</span>
        </span>
        <span v-if="selection.lines > 0">{{selection.lines}} lines</span>
      </div>
      <div class="line-info" v-else>
        <span>Line {{cursorPosition.line}},</span>
        <span>Column {{cursorPosition.col}}</span>
      </div>

      <span id="lang" class="editor-info">{{ selectedLanguage }}</span>
      <span class="editor-info" id="file-size">{{contentSizeInBytes}} Bytes</span>
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
  import { mapState, mapActions, mapGetters } from 'vuex';
  import { allThemes } from '@/util/editorThemes';
  import IndentationDialog from '@/components/modal/IndentaionDialog';
  import MdTooltip from 'vue-material/dist/components/MdTooltip';
  import { editor, indentDialog } from '@/store/modules/moduleNames';
  // noinspection ES6CheckImport
  import { gutterDark, gutterLight } from '@/assets/scss/_gutter.scss';

  Vue.use(MdTooltip);

  export default {
    components: {
      IndentationDialog
    },
    computed: {
      ...mapState(editor, {
        selectedLanguage: state => {
          // Capitalize the first letter of the language
          const lang = state.selectedLanguage;
          return lang.charAt(0).toUpperCase() + lang.slice(1);
        }
      }),
      ...mapState(editor, [
        'currentTheme',
        'indentSize',
        'useTabs',
        'cursorPosition',
        'selection'
      ]),
      ...mapGetters(editor, ['contentSizeInBytes'])
    },
    methods: {
      ...mapActions(indentDialog, {
        showIndentDialog: 'show'
      })
    },
    mounted() {
      this.$store.watch(
        state => state.editor.currentTheme,
        theme => {
          this.$refs.gutter.style.backgroundColor = allThemes[theme].isLight
            ? gutterDark
            : gutterLight;
        }
      );
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
<template>
  <md-drawer :md-active.sync="showMenu" md-persistent="full">
    <md-toolbar md-elevation="0">
      <span>Settings</span>
      <div class="md-toolbar-section-end">
        <md-button class="md-icon-button md-dense" @click="hide">
          <md-icon>keyboard_arrow_left</md-icon>
        </md-button>
      </div>
    </md-toolbar>
    <md-list class="md-double-line">
      <md-menu md-size="medium">

        <!--
        Give the menu-item an empty click listener so it
        renders as a button and gets the ripple effect
        -->
        <md-list-item @click="() => {}" md-menu-trigger>
          <md-icon>code</md-icon>
          <div class="md-list-item-text">
            <span>Language</span>
            <span>Current: {{selectedLanguage}}</span>
          </div>
          <md-menu-content>
            <md-menu-item
                v-for="lang in editorLanguages"
                :key="lang"
                @click="setLanguage(lang)"
            >
              {{lang}}
            </md-menu-item>
          </md-menu-content>
        </md-list-item>
      </md-menu>


      <md-list-item @click="openFontDialog">
        <md-icon>text_fields</md-icon>
        <div class="md-list-item-text">
          <span>Font size</span>
          <span>Current: {{fontSize}}px | Default: {{defaultFontSize}}px</span>
        </div>
        <ChangeFontSize />
      </md-list-item>

      <md-list-item @click="toggleMinimap">
        <md-icon>map</md-icon>
        <div class="md-list-item-text">
          <span>Toggle minimap</span>
          <span>Minimap is {{showMinimap ? 'showing' : 'hidden'}}</span>
        </div>
      </md-list-item>

      <md-menu md-size="medium">
        <md-list-item @click="() => {}" md-menu-trigger>
          <md-icon>color_lens</md-icon>
          <div class="md-list-item-text">
            <span>Change theme</span>
            <span>Current: {{currentTheme}}</span>
          </div>
          <md-menu-content>
            <md-menu-item
                v-for="theme in themes"
                :key="theme"
                @click="setEditorTheme(theme)"
            >
              {{theme}}
            </md-menu-item>
          </md-menu-content>
        </md-list-item>
      </md-menu>

      <md-list-item @click="toggleWhitespace">
        <md-icon>settings_ethernet</md-icon>
        <div class="md-list-item-text">
          <span>Render whitespace</span>
          <span>Whitespace will be {{renderWhitespace ? 'shown' : 'hidden'}}</span>
        </div>
      </md-list-item>

    </md-list>
  </md-drawer>
</template>

<script>
  import Vue from 'vue';
  import { mutationTypes, editorDefaults } from '@/store/modules/editor';
  import { editor, fontDialog, settingsDrawer } from '@/store/modules/moduleNames';
  import { mapState, mapMutations, mapActions } from 'vuex';
  import MdDrawer from 'vue-material/dist/components/MdDrawer';
  import MdList from 'vue-material/dist/components/MdList';
  import MdIcon from 'vue-material/dist/components/MdIcon';
  import MdToolbar from 'vue-material/dist/components/MdToolbar';
  import MdMenu from 'vue-material/dist/components/MdMenu';
  import { languages } from 'monaco-editor';
  import { themeNames } from '@/util/editorThemes';
  import ChangeFontSize from '@/components/modal/ChangeFontSize';

  Vue.use(MdDrawer);
  Vue.use(MdList);
  Vue.use(MdIcon);
  Vue.use(MdToolbar);
  Vue.use(MdMenu);

  export default {
    components: {
      ChangeFontSize,
    },
    computed: {
      ...mapState(editor, [
        'selectedLanguage',
        'showMinimap',
        'fontSize',
        'currentTheme',
        'renderWhitespace'
      ]),
      ...mapState(settingsDrawer, {
        showMenu: 'showDialog'
      })
    },
    data() {
      const editorLanguages = [];
      languages.getLanguages().forEach(({ id }) => editorLanguages.push(id));
      editorLanguages.sort();

      return {
        editorLanguages,
        menuVisible: false,
        defaultFontSize: editorDefaults.fontSize,
        defaultTheme: editorDefaults.theme,
        themes: themeNames.slice().sort()
      };
    },
    methods: {
      ...mapMutations(editor, [
        mutationTypes.setLanguage,
        mutationTypes.toggleMinimap,
        mutationTypes.setEditorTheme,
        mutationTypes.toggleWhitespace
      ]),
      ...mapActions(fontDialog, {
        openFontDialog: 'show'
      }),
      ...mapActions(settingsDrawer, ['hide'])
    }
  };

</script>

<style lang="scss" scoped>
  $text-color: #b9b9b9;
  $bg-color: #252526;
  $drawer-font-size: 17px;

  .md-drawer {
    width: 245px;

    &.md-theme-default {
      background-color: #252526;
    }
  }

  .md-list-item {
    cursor: pointer;
  }


  .md-list-item-text {
    & span {
      color: $text-color !important;
      font-size: 12px;
    }

    & span:nth-child(1) {
      font-size: $drawer-font-size;
    }
  }

  .md-list.md-theme-default {
    background-color: #252526;
    color: $text-color;
  }

  .md-toolbar {
    margin-top: 8px;
    height: 40px;
    min-height: 40px;

    &.md-theme-default {
      color: $text-color;
      background-color: $bg-color;
      font-size: $drawer-font-size;
    }
  }

  .md-icon.md-theme-default.md-icon-font {
    color: $text-color;
  }

  .md-list.md-theme-default .md-list-item-container {
    color: $text-color;
  }
</style>
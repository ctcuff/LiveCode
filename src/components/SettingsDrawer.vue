<template>
  <md-drawer :md-active.sync="showMenu" md-persistent="full" class="md-scrollbar">
    <md-toolbar md-elevation="0">
      <span>Settings</span>
      <div class="md-toolbar-section-end">
        <md-button class="md-icon-button md-dense" @click="hide">
          <md-icon>keyboard_arrow_left</md-icon>
        </md-button>
      </div>
    </md-toolbar>
    <md-list class="md-double-line">

      <md-list-item @click="openSignOutDialog" v-if="isSignedIn">
        <md-icon>exit_to_app</md-icon>
        <div class="md-list-item-text">
          <span>Sign out</span>
          <span>Signed in as {{email}}</span>
        </div>
        <SignOutDialog />
      </md-list-item>

      <md-list-item @click="openSignInDialog" v-else>
        <md-icon>exit_to_app</md-icon>
        <div class="md-list-item-text">
          <span>Sign in</span>
          <span>Sign in to share your workspace or connect with others</span>
        </div>
        <SignInDialog />
      </md-list-item>

      <md-divider></md-divider>
      <md-subheader>Editor Settings</md-subheader>
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

      <md-list-item @click="toggleMinimap">
        <md-icon>map</md-icon>
        <div class="md-list-item-text">
          <span>Toggle minimap</span>
          <span>Minimap is {{showMinimap ? 'showing' : 'hidden'}}</span>
        </div>
      </md-list-item>

      <md-list-item @click="toggleWhitespace">
        <md-icon>settings_ethernet</md-icon>
        <div class="md-list-item-text">
          <span>Toggle whitespace</span>
          <span>Whitespace will be {{renderWhitespace ? 'shown' : 'hidden'}}</span>
        </div>
      </md-list-item>

      <md-list-item @click="toggleWordWrap">
        <md-icon>wrap_text</md-icon>
        <div class="md-list-item-text">
          <span>Toggle word wrap</span>
          <span>Word wrap is {{wordWrap ? 'on' : 'off'}}</span>
        </div>
      </md-list-item>

      <md-list-item @click="toggleLineNumbers">
        <md-icon>format_list_numbered</md-icon>
        <div class="md-list-item-text">
          <span>Toggle line numbers</span>
          <span>Line numbers are {{showLineNumbers ? 'on' : 'off'}}</span>
        </div>
      </md-list-item>

    </md-list>

  </md-drawer>
</template>

<script>
  import Vue from 'vue';
  import { mutationTypes, editorDefaults } from '@/store/modules/editor';
  import {
    editor,
    fontDialog,
    settingsDrawer,
    signInDialog,
    signOutDialog
  } from '@/store/modules/moduleNames';
  import { mapState, mapMutations, mapActions } from 'vuex';
  import MdDrawer from 'vue-material/dist/components/MdDrawer';
  import MdList from 'vue-material/dist/components/MdList';
  import MdIcon from 'vue-material/dist/components/MdIcon';
  import MdToolbar from 'vue-material/dist/components/MdToolbar';
  import MdMenu from 'vue-material/dist/components/MdMenu';
  import MdSubheader from 'vue-material/dist/components/MdSubheader';
  import { languages } from 'monaco-editor';
  import { themeNames } from '@/util/editorThemes';
  import ChangeFontSize from '@/components/modal/ChangeFontSize';
  import SignInDialog from '@/components/modal/SignInDialog';
  import SignOutDialog from '@/components/modal/SignOutDialog';

  Vue.use(MdDrawer);
  Vue.use(MdList);
  Vue.use(MdIcon);
  Vue.use(MdToolbar);
  Vue.use(MdMenu);
  Vue.use(MdSubheader);

  export default {
    components: {
      SignOutDialog,
      ChangeFontSize,
      SignInDialog
    },
    computed: {
      ...mapState(editor, [
        'selectedLanguage',
        'showMinimap',
        'fontSize',
        'currentTheme',
        'renderWhitespace',
        'wordWrap',
        'showLineNumbers'
      ]),
      ...mapState(settingsDrawer, {
        showMenu: 'showDialog'
      }),
      ...mapState('user', [
        'isSignedIn',
        'email'
      ])
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
        mutationTypes.toggleWhitespace,
        mutationTypes.toggleWordWrap,
        mutationTypes.toggleLineNumbers
      ]),
      ...mapActions(fontDialog, {
        openFontDialog: 'show'
      }),
      ...mapActions(settingsDrawer, ['hide']),
      ...mapActions('user', ['signOut']),
      openSignInDialog() {
        this.hide();
        this.$store.dispatch(`${signInDialog}/show`);
      },
      openSignOutDialog() {
        this.hide();
        this.$store.dispatch(`${signOutDialog}/show`);
      }
    }
  };

</script>

<style lang="scss" scoped>
  $text-color: #b9b9b9;
  $bg-color: #252526;
  $drawer-font-size: 17px;

  .md-drawer {
    width: auto;

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
      white-space: pre-line;
      max-width: 180px;
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
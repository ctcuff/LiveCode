const ace = window.ace;
const mobileThemes = ace.require('ace/ext/themelist').themesByName;
const desktopThemes = {
  'vs-dark': {
    isDark: true
  },
  'vs-light': {
    isDark: false
  }
};

export { desktopThemes, mobileThemes };
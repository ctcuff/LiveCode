// Return the modal's state with a function
// so that modals don't accidentally share properties
const generateModalState = () => ({
  namespaced: true,
  state: {
    showDialog: false,
  },
  mutations: {
    setShowDialog: (state, show) => {
      state.showDialog = show;
    }
  },
  actions: {
    show(context) {
      context.commit('setShowDialog', true);
    },
    hide(context) {
      context.commit('setShowDialog', false);
    }
  }
});

export default generateModalState;
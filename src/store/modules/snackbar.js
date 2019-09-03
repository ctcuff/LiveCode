export default {
  namespaced: true,
  state: {
    show: false,
    message: null
  },
  mutations: {
    setShowSnackbar: (state, payload) => {
      state.show = payload.show;
      state.message = payload.message;
    }
  },
  actions: {
    showSnackbar: (context, message) => {
      context.commit('setShowSnackbar', {
        show: true,
        message
      });
    },
    hideSnackbar: context => {
      context.commit('setShowSnackbar', {
        show: false,
        message: null
      });
    }
  }
};
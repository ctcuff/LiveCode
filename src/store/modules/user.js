export default {
  namespaced: true,
  state: {
    isSignedIn: false,
    email: null,
    uid: null,
    workspaceId: null
  },
  mutations: {
    setEmail: (state, email) => {
      state.email = email;
    },
    setIsSignedIn: (state, isSignedIn) => {
      state.isSignedIn = isSignedIn;
    },
    setUid: (state, uid) => {
      state.uid = uid;
    },
    setWorkspaceId: (state, workspaceId) => {
      state.workspaceId = workspaceId;
    }
  }
};
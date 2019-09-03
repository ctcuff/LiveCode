import { firebaseDatabase } from '@/util/firebase';

export default {
  namespaced: true,
  state: {
    isSignedIn: false,
    email: null,
    uid: null,
    workspaceId: null,
    isConnectedToWorkspace: false,
    connectedWorkspaceId: null,
    connectedWorkspaceEmail: null
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
    },
    setIsConnected: (state, isConnected) => {
      state.isConnectedToWorkspace = isConnected;
    },
    setConnectedWorkspaceId: (state, id) => {
      state.connectedWorkspaceId = id;
    },
    setConnectedWorkspaceEmail: (state, email) => {
      state.connectedWorkspaceEmail = email;
    }
  },
  actions: {
    clearSession: ({ commit }) => {
      commit('setIsSignedIn', false);
      commit('setUid', null);
      commit('setWorkspaceId', null);
      commit('setIsConnected', false);
      commit('setEmail', null);
      commit('setConnectedWorkspaceId', null);
      commit('setConnectedWorkspaceEmail', null);
    },
    connectToWorkspace: ({ state, commit }, workspaceId) => {
      workspaceId = workspaceId.toUpperCase();

      return new Promise((resolve, reject) => {
        const workspacesRef = firebaseDatabase.ref(`/workspaces/${workspaceId}`);
        const currentUserRef = firebaseDatabase.ref(`/workspaces/${state.workspaceId}`);

        // Update the "usersConnected" node for the user's
        // workspace we're connecting to
        workspacesRef.once('value').then(snapshot => {
          if (!snapshot.exists()) {
            reject("Couldn't find a workspace with this ID");
          } else {
            workspacesRef.child('usersConnected')
              .child(state.workspaceId)
              .set(state.email)
              .then(() => {
                const { owner } = snapshot.val();

                commit('setIsConnected', true);
                commit('setConnectedWorkspaceId', workspaceId);
                commit('setConnectedWorkspaceEmail', owner);

                currentUserRef
                  .update({ connectedWorkspaceId: workspaceId })
                  .catch(err => console.log(err));

                resolve(owner);
              })
              .catch(err => reject(err));
          }
        });
      });
    },
    disconnectFromWorkspace: async context => {
      if (!context.state.isSignedIn) {
        return;
      }

      const currentUserRef = firebaseDatabase.ref(`/workspaces/${context.state.workspaceId}`);

      await currentUserRef
        .once('value')
        .then(snapshot => {

          // Makes sure that we also let the user we were connected to
          // know that we're no longer connected to their workspace
          const { connectedWorkspaceId } = snapshot.val();
          const connectedWorkspaceRef = firebaseDatabase.ref(`/workspaces/${connectedWorkspaceId}`);

          connectedWorkspaceRef.child('usersConnected')
            .child(context.state.workspaceId)
            .remove()
            .then(() => console.log('Done in first'))
            .catch(err => console.log(err));

        })
        .catch(err => console.log(err));

      // Makes sure the the database knows that this is
      // no longer connected to any workspace
      await currentUserRef
        .child('connectedWorkspaceId')
        .remove()
        .then(() => {
          console.log('Done in second');
          context.commit('setIsConnected', false);
          context.commit('setConnectedWorkspaceId', null);
          context.commit('setConnectedWorkspaceEmail', null);
        })
        .catch(err => console.log(err));
    }
  }
};
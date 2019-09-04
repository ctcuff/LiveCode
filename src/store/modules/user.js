import { firebaseDatabase } from '@/util/firebase';
import { joinRoom } from '@/util/socket';

export default {
  namespaced: true,
  state: {
    isSignedIn: false,
    email: null,
    uid: null,
    workspaceId: null,
    isConnectedToWorkspace: false,
    connectedWorkspaceId: null,
    connectedWorkspaceEmail: null,
    usersConnected: []
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
      if (workspaceId) {
        workspaceId = workspaceId.toUpperCase();
      }
      state.workspaceId = workspaceId;
    },
    setIsConnected: (state, isConnected) => {
      state.isConnectedToWorkspace = isConnected;
    },
    setConnectedWorkspaceId: (state, id) => {
      if (id) {
        id = id.toUpperCase();
      }
      state.connectedWorkspaceId = id;
    },
    setConnectedWorkspaceEmail: (state, email) => {
      state.connectedWorkspaceEmail = email;
    },
    addUserToWorkspace: (state, user) => {
      state.usersConnected.push({
        email: user.email,
        workspaceId: user.workspaceId
      });
    },
    removeUserFromWorkspace: (state, index) => {
      state.usersConnected.splice(index, 1);
    }
  },
  actions: {
    removeUserFromWorkspace: ({ state, commit }, userWorkspaceId) => {
      return new Promise((resolve, reject) => {
        const found = state.usersConnected.find(user => user.workspaceId === userWorkspaceId);
        if (found) {
          const deleteIndex = state.usersConnected.indexOf(found);
          const userEmail = state.usersConnected[deleteIndex].email;
          commit('removeUserFromWorkspace', deleteIndex);
          resolve(userEmail);
        } else {
          reject('User not found');
        }
      });
    },
    clearSession: ({ commit }) => {
      commit('setIsSignedIn', false);
      commit('setUid', null);
      commit('setWorkspaceId', null);
      commit('setIsConnected', false);
      commit('setEmail', null);
      commit('setConnectedWorkspaceId', null);
      commit('setConnectedWorkspaceEmail', null);
    },
    connectToWorkspace: ({ state, commit, dispatch }, connectedWorkspaceId) => {
      return new Promise((resolve, reject) => {
        const workspacesRef = firebaseDatabase.ref(`/workspaces/${connectedWorkspaceId}`);
        const currentUserRef = firebaseDatabase.ref(`/workspaces/${state.workspaceId}`);

        workspacesRef.once('value').then(snapshot => {
          if (!snapshot.exists()) {
            reject("Couldn't find a workspace with this ID");
          } else {
            const { owner, online } = snapshot.val();

            if (!online) {
              reject("Can't connect to this workspace, this user is currently offline");
            } else {

              currentUserRef.child('usersConnected')
                .once('value')
                .then(async snapshot => {
                  const connectedUsers = snapshot.val();

                  if (connectedUsers && Object.values(connectedUsers).includes(owner)) {
                    reject(`Can't connect to this workspace. ${owner} is already connected to yours.`);
                  } else {

                    try {
                      await workspacesRef.child('usersConnected')
                        .child(state.workspaceId)
                        .set(state.email);

                      commit('setIsConnected', true);
                      commit('setConnectedWorkspaceId', connectedWorkspaceId);
                      commit('setConnectedWorkspaceEmail', owner);

                    } catch (err) {
                      console.log(err);
                    }

                    try {
                      await currentUserRef.update({ connectedWorkspaceId });
                    } catch(err) {
                      console.log(err);
                    }

                    try {
                      // Makes sure to join the socket room of the user we're
                      // connecting to so we can listen for editor text changes
                      await joinRoom(connectedWorkspaceId);
                    } catch (err) {
                      console.log(err);
                    }

                    resolve(owner);
                  }
                });

              workspacesRef
                .child('usersConnected')
                .on('child_removed', async () => {
                  await dispatch('disconnectFromWorkspace');
                  await dispatch(
                    'snackbar/showSnackbar',
                    `Disconnected from ${owner}'s workspace`,
                    { root: true }
                  );
                });
            }
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
            .catch(err => console.log(err));

        })
        .catch(err => console.log(err));

      // Makes sure the the database knows that this is
      // no longer connected to any workspace
      await currentUserRef
        .child('connectedWorkspaceId')
        .remove()
        .then(() => {
          context.commit('setIsConnected', false);
          context.commit('setConnectedWorkspaceId', null);
          context.commit('setConnectedWorkspaceEmail', null);
        })
        .catch(err => console.log(err));
    }
  },
  getters: {
    numUsersConnected: state => state.usersConnected.length
  }
};
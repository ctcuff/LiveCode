import { firebaseDatabase } from '@/util/firebase';
import { joinRoom, leaveRoom } from '@/util/socket';

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
    setIsAnonymous: (state, isAnonymous) => {
      state.isAnonymous = isAnonymous;
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
    clearSession: async ({ commit }) => {
      commit('setIsSignedIn', false);
      commit('setUid', null);
      commit('setWorkspaceId', null);
      commit('setIsConnected', false);
      commit('setEmail', null);
      commit('setConnectedWorkspaceId', null);
      commit('setConnectedWorkspaceEmail', null);
    },
    connectToWorkspace: async ({ state, commit, dispatch }, connectedWorkspaceId) => {
      const connectedWorkspaceRef = firebaseDatabase.ref(`/workspaces/${connectedWorkspaceId}`);
      const currentUserRef = firebaseDatabase.ref(`/workspaces/${state.workspaceId}`);

      await connectedWorkspaceRef.once('value').then(snapshot => {
        if (!snapshot.exists()) {
          throw new Error("Couldn't find a user with this workspace ID");
        }

        const { owner, online } = snapshot.val();

        if (!online) {
          throw new Error("Can't connect to this workspace, this user is currently offline");
        }

        commit('setConnectedWorkspaceEmail', owner);
      });

      // Check to make sure this user isn't connecting to a workspace
      // that's already connected to theirs
      await currentUserRef
        .child('usersConnected')
        .once('value')
        .then(async snapshot => {
          if (snapshot.exists()) {
            const connectedUsers = snapshot.val();
            const owner = state.connectedWorkspaceEmail;

            if (Object.values(connectedUsers).includes(owner)) {
              throw new Error(
                `Can't connect to this workspace. 
                ${owner} is already connected to yours.`
              );
            }
          }
        });

      await connectedWorkspaceRef
        .child('usersConnected')
        .child(state.workspaceId)
        .set(state.email);

      await currentUserRef.update({ connectedWorkspaceId });

      // Makes sure to join the socket room of the user we're
      // connecting to so we can listen for editor text changes
      await joinRoom(connectedWorkspaceId);

      // Makes sure to disconnect from the connected user's
      // workspace when this user leaves the site
      await connectedWorkspaceRef
        .child('usersConnected')
        .child(state.workspaceId)
        .onDisconnect()
        .remove();

      // Disconnect from the connected workspace if the
      // owner goes offline
      await connectedWorkspaceRef.on('child_changed', snapshot => {
        const online = snapshot.val();
        if (!online) {
          dispatch(
            'snackbar/showSnackbar',
            `${state.connectedWorkspaceEmail} disconnected`,
            { root: true }
          );
          dispatch('disconnectFromWorkspace');
        }
      });

      await currentUserRef.child('connectedWorkspaceId')
        .onDisconnect()
        .remove();

      commit('setIsConnected', true);
      commit('setConnectedWorkspaceId', connectedWorkspaceId);
    },
    disconnectFromWorkspace: async context => {
      const { workspaceId, isSignedIn } = context.state;
      if (!isSignedIn) {
        return;
      }

      const workspacesRef = firebaseDatabase.ref('/workspaces');
      const currentUserRef = workspacesRef.child(workspaceId);

      await currentUserRef
        .child('connectedWorkspaceId')
        .once('value')
        .then(async snapshot => {
          if (!snapshot.exists()) {
            return;
          }
          const connectedWorkspaceId = snapshot.val();

          await leaveRoom(connectedWorkspaceId);

          // Make sure to detach the listener we
          // set when we connected to this workspace
          workspacesRef.child(connectedWorkspaceId).off();

          // Makes sure that we let the user we were connected to
          // know that we're no longer connected to their workspace
          await workspacesRef
            .child(connectedWorkspaceId)
            .child('usersConnected')
            .child(workspaceId)
            .remove();
        });

      // Makes sure the the database knows that this
      // user no longer connected to any workspace
      await currentUserRef
        .child('connectedWorkspaceId')
        .remove();

      context.commit('setIsConnected', false);
      context.commit('setConnectedWorkspaceId', null);
      context.commit('setConnectedWorkspaceEmail', null);
    }
  },
  getters: {
    numUsersConnected: state => state.usersConnected.length
  }
};
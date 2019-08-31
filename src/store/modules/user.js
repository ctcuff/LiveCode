import { createSetter } from '@/util/creator';

export default {
  namespaced: true,
  state: {
    isSignedIn: false,
    email: null,
    uid: null,
    workspaceId: null
  },
  mutations: {
    setEmail: createSetter('email'),
    setIsSignedIn: createSetter('isSignedIn'),
    setUid: createSetter('uid'),
    setWorkspaceId: createSetter('workspaceId')
  }
};
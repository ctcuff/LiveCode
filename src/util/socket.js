import io from 'socket.io-client';
import store from '@/store';

const socket = io.connect('http://localhost:3000/');

// Send the content of this user's workspace to anyone
// connecting when they first join
socket.on('sendInitialWorkspace', payload => {
  // Check to make sure this user wasn't the one
  // who sent this request
  if (socket.id !== payload.socketId) {
    socket.emit('updateEditorContent', {
      content: store.state.editor.content,
      room: store.state.user.workspaceId
    });
  }
});

function joinRoomFromWorkspace() {
  return joinRoom(store.state.user.workspaceId);
}

function leaveRoomFromWorkspace() {
  return leaveRoom(store.state.user.workspaceId);
}

function joinRoom(roomName) {
  console.log('Joining room:', roomName);
  return new Promise((resolve, reject) => {
    socket.emit('join room', roomName);
    socket.on('room join success', payload => {
      if (!payload) {
        reject('null payload was received, is there a server issue?');
      }

      if (payload.socketId === socket.id) {
        // Tell the user we're connecting to to
        // send us their workspace
        socket.emit('getInitialWorkspace', {
          id: socket.id,
          room: roomName
        });
        resolve();
      }
    });
  });
}

function leaveRoom(roomName) {
  console.log('Leaving room:', roomName);
  return new Promise((resolve, reject) => {
    socket.emit('leave room', roomName);
    socket.on('room leave success', payload => {
      if (!payload) {
        reject('null payload was received, is there a server issue?');
      }
      if (payload.socketId === socket.id) {
        resolve();
      }
    });
  });
}

export {
  socket,
  joinRoom,
  leaveRoom,
  joinRoomFromWorkspace,
  leaveRoomFromWorkspace
};
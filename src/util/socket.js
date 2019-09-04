import io from 'socket.io-client';
import store from '@/store';

const socket = io.connect('http://localhost:3000/');

function joinRoomFromWorkspace() {
  if (!store.state.user.workspaceId) {
    console.err('FATAL, WORKSPACE ID WAS NULL');
  }
  return joinRoom(store.state.user.workspaceId);
}

function leaveRoomFromWorkspace() {
  if (!store.state.user.workspaceId) {
    console.err('FATAL, WORKSPACE ID WAS NULL');
  }
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

      // Makes sure this event is only fired when this
      // user connects to the room
      if (payload.socketId === socket.id) {
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
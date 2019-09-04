const app = require('express')();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello!');
});

io.on('connect', socket => {
  console.log('User connected');

  socket.on('disconnect', () => console.log('user disconnected'));

  socket.on('join room', room => {
    console.log('User connected to room:', room);
    socket.join(room);

    // This event is emitted to everyone so we need to include the
    // sender socket ID to differentiate users
    io.emit('room join success', {
      socketId: socket.id
    });
  });

  socket.on('leave room', room => {
    console.log('User left', room);
    socket.leave(room);
    io.emit('room leave success', {
      socketId: socket.id
    });
  });

  socket.on('updateEditorContent', payload => {
    const { room, content } = payload;
    console.log({
      ...payload,
      socketId: socket.id
    });
    io.in(room).emit('editorContentUpdated', {
      updatedContent: content,
      socketId: socket.id
    });
  });

  socket.on('getInitialWorkspace', payload => {

    io.in(payload.room).emit('sendInitialWorkspace', {
      socketId: payload.id
    });
  });
});

server.listen(port, () => console.log(`listening on *:${port}`));
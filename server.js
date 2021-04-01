const express = require('express');
const socket = require('socket.io');

const app = express();

const tasks = [];

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);

io.on('connection', (socket) => {
  io.to(socket.id).emit('updateData', tasks);
  console.log('New client! Its id – ' + socket.id);
  
  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
    console.log('New task: ' , task , ' from client ' + socket.id);
    console.log('All tasks: ', tasks);
  });

  socket.on('removeTask', (id) => { 
    const findTask = tasks.find(task => task.id === id);
    const taskIndex = tasks.indexOf(findTask);
    console.log('Client with id - ' + socket.id + ' remove task ' + findTask.name)
    tasks.splice(taskIndex, 1);
    socket.broadcast.emit('removeTask', id);
    console.log('All tasks: ', tasks);
  });
});

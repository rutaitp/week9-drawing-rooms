//Express server setup
let express = require('express');
let app = express();

//Serve public folder
app.use(express.static('public'));

//STEP 2. HTTP Server
let http = require('http');
let server = http.createServer(app);

//Listen
let port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log('Server is listening on localhost: ' + port);
});

//STEP 3. Socket connection
const { Server } = require("socket.io");
const io = new Server(server);

//STEP 3.2 Establish socket connection & log id
io.on('connection', (socket) => {
  console.log('We have a new client: ' + socket.id);

  //Step 6. Listen for data coming in
  socket.on('data', (data) => {
    // console.log(data);

    //Step 7. Emit data to other clients
    //Send to all clients, including us
    io.emit('data', data);
  });

  socket.on('colorChange', () => {
    io.emit('colorChange');
  });

  socket.on('disconnect', () => {
    console.log('A client disconnected: ', socket.id);
  });
});

/*PRIVATE NAMESPACE */
let private = io.of('/private');

private.on('connection', (socket) => {
  console.log('We have a new private client: ' + socket.id);

  //Listen for a room name
  socket.on('room', (data) => {
    console.log(data);

    //Add socket to a room
    socket.join(data.room);

    //Add room property to socket object
    socket.room = data.room;

    //Send a welcome message to new clients
    let welcomeMsg = "Welcome to a private drawing room: " + data.room;

    let welcomeMsgObj = {
      msg: welcomeMsg
    }

    // private.to(data.room).emit('welcome', welcomeMsgObj);
    socket.emit('welcome', welcomeMsgObj);

  });

  //Step 6. Listen for data coming in
  socket.on('data', (data) => {
    // console.log(data);

    //Step 7. Emit data to other clients
    //Send to all clients, including us
    private.to(socket.room).emit('data', data);
  });

  socket.on('colorChange', () => {
    private.to(socket.room).emit('colorChange');
  });

  socket.on('disconnect', () => {
    console.log('A private client disconnected: ', socket.id);

    //Leave room on disconnect
    socket.leave(socket.room)
  });
});

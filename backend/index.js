const { config } = require("dotenv");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes.js");
const chatRouter = require("./routes/chatRoutes.js");
const messageRouter = require("./routes/messageRoutes.js");
const { notFound, errorHandler } = require("./middlewares/APIErrors.js");

config();

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/user', userRouter);
app.use('/api/chats', chatRouter)
app.use('/api/messages', messageRouter)

// In Api testing throws custom url not found message 
app.use(notFound);

// Give error message in response in frontend
app.use(errorHandler)

// Connect to the database
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('=== Mongodb Connected index.js [48] ===');
    })
    .catch((err) => {
        console.log('Error while connecting to the db: ', err);
    })

// Start the server
const server = app.listen(process.env.PORT, () => {
    console.log('App listening on port: ', process.env.PORT);
})

// Socket IO
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: ['http://localhost:5173','https://q36lj4lq-5173.inc1.devtunnels.ms'],
    }
});

// Socket IO Connection
io.on('connection', (socket) => {
    console.log('===  Socket IO Connection Succesful [42] ===');

    socket.on('setup', (userData) => {
        socket.join(userData.id);
        socket.emit('connected');
    });
    socket.on('join chat', (room) => { socket.join(room); console.log('=== room index.js [55] ===', room); });
    socket.on('new message', (newMessage) => {
        const chat = newMessage.chat;
        if (!chat.users) return console.log('=== chat.users index.js [58] ===', chat.users);
        chat.users.forEach((user) => {
            if (user._id === newMessage.sender._id) return
            socket.in(user._id).emit('message received', newMessage);
        });
    });
    socket.on('typing', (room) => {
        socket.in(room).emit('typing');
    })
    socket.on('stop typing', (room) => {
        socket.in(room).emit('stop typing');
    })
})
import { config } from "dotenv"
import express from "express"
import { Server } from "socket.io"

config()
const PORT = process.env.PORT || 3000
const app = express();

const server = app.listen(PORT, () => console.log(`=== Connected to Port: ${PORT} ===`));

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5000", "http://localhost:3000", "http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
});

// Socket IO Connection
io.on('connection', (socket) => {
    // console.log('===  Socket IO Connection Succesful [42] ===');

    socket.on('setup', (userData) => {
        socket.join(userData?.id);
        console.log('=== userData index.js [54] ===', userData);
        socket.emit('connected');
    });
    socket.on('join chat', (room) => { socket.join(room); console.log('=== room index.js [55] ===', room); });
    socket.on('new message', (newMessage) => {
        const chat = newMessage.chat;
        if (!chat.users) ""
        chat.users.forEach((user) => {
            if (user._id === newMessage.sender._id) return
            socket.in(user._id).emit('message received', newMessage);
        });
    });
    socket.on('typing', (room) => {
        socket.in(room.selectedChat ? room.selectedChat : room).emit('typing', room.selectedChat && room.typerName);
        console.log('=== room index.js [67] ===', room);
    })
    socket.on('stop typing', (room) => {
        socket.in(room).emit('stop typing');
    })
})

export {
    app, server, io
}
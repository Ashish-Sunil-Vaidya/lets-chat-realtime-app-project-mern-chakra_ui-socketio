import { config } from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { notFound, errorHandler } from "./middlewares/apiErrors.js";
import path from 'path';
import { Server } from 'socket.io';
import { fileURLToPath } from "url";

config();

const app = express();
const __dirname1 = path.dirname(fileURLToPath(import.meta.url));
const __dirname2 = path.join(__dirname1, '../');

app.use(cors());
app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/chats', chatRouter)
app.use('/api/messages', messageRouter)

// DEPLOYMENT CODE
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname2, '/frontend/dist')));
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname2, 'frontend', 'dist', 'index.html')));
}
else {
    app.get('/', (req, res) => {
        res.send('API is running in dev mode');
    });
}



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

// Socket IO initial setup

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:5173'
    }
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
        if (!chat.users) return console.log('=== chat.users index.js [58] ===', chat.users);
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

export default app;

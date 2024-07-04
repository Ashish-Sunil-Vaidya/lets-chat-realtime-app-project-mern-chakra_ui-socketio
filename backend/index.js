import { config } from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routes/user.routes.js";
import chatRouter from "./routes/chat.routes.js";
import messageRouter from "./routes/message.routes.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";
import path from 'path';
import { fileURLToPath } from "url";
import { app } from "./socket/index.js"

config();

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
        res.send('Server is running in dev mode');
    });
}


// In Api testing throws custom url not found message 
app.use(notFound);

// Give error message in response in frontend
app.use(errorHandler)

// Connect to the database
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('=== Mongodb Connected ===');
    })
    .catch((err) => {
        console.log('Error while connecting to the db: ', err);
    })



export default app;

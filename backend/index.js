const { config } = require("dotenv");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes.js");
const chatRouter = require("./routes/chatRoutes.js")
const { notFound, errorHandler } = require("./middlewares/APIErrors.js");

config();

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/user', userRouter);
app.use('/api/chats', chatRouter)

// In Api testing throws custom url not found message 
app.use(notFound);

// Give error message in response in frontend
app.use(errorHandler)

mongoose.connect(process.env.MONGO_URI)
    .then(() => {

        app.listen(process.env.PORT, () => {
            console.log('=== Connection Successful ===',);
            console.log('App listening on port: ', process.env.PORT);
            console.log('=============================',);
        })
    })
    .catch((err) => {
        console.log('Error while connecting to the db: ', err);
    })
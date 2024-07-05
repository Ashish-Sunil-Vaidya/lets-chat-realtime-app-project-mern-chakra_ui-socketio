# Lets Chat - A Minimalist Real-Time Chat App

Lets Chat is a real-time chat application that allows users to engage in private and group chats. Built with a modern tech stack, this application offers a sleek, minimalist design and a user-friendly interface, making online communication seamless and enjoyable.
Try it out [here](https://lets-chat-a-minimalist-real-time-chat-app.onrender.com/auth).

## Features

- **Real-Time Messaging:** Instantly send and receive messages with Socket.IO integration.
- **Private and Group Chats:** Engage in one-on-one conversations or group chats with multiple participants.
- **User Authentication:** Secure user authentication system to protect your chats.

## Tech Stack

- **Frontend:** React, Vite, Chakra UI, Socket.IO Client
- **Backend:** Node.js, Express, Socket.IO
- **Database:** MongoDB
- **Deployment:** Render

## Objectives

- **Real-Time Messaging:** Instantly send and receive messages with Socket.IO integration.
- It also has given experience to work with MongoDB, Express, React, Node.js, Socket.IO, and Chakra UI.


## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- MongoDB instance (local or cloud)

### Installation

1. Clone the repository

   ````sh
   git clone https://github.com/your-username/lets-chat.git```
   ````

2. Navigate to the project directory

   ```sh
    cd lets-chat
   ```

3. Install dependencies

   ```sh
   npm install or yarn install
   ```

4. Set up environment variables in backend directory

   ```sh
   #ADD Following Environment Variables in .env file in backend directory
   PORT = 5000
   MONGO_URI = "your-mongodb-uri"
   JWT_SECRET_KEY = 'jwt-secret'
   NODE_ENV = "dev"
   ```

5. Start the application

   ```sh
   # Start the backend server
   cd backend
   npm start or yarn start

   # Start the frontend server
   cd frontend
   npm start or yarn start

   # Or start both servers concurrently
    npm run dev or yarn dev
   ```

## Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Chakra UI](https://chakra-ui.com/)
- [Socket.IO](https://socket.io/)
- [MongoDB](https://www.mongodb.com/)


<hr>

# To know more about the project, visit [documentation](Documentation.md)

<hr>

`beta version 1.0.0`
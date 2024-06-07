import {  Routes, Route } from "react-router-dom";
import ChatProvider from "../../../Lets Chat!/frontend/context/ChatProvider";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/authentication/AuthPage";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <ChatProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </ChatProvider>
  );
}

export default App;

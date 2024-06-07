import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ChatContext = createContext();
const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userDetails"))
  );
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [notifications, setNotifications] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log('=== user ChatProvider.jsx [16] ===', user);
      navigate("/chats");
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        fetchAgain,
        setFetchAgain,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;

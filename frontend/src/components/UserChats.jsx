import { ChatDetails } from "./ChatDetails";
import {
  Box,
  Text,
  Skeleton,
  Grid,
  VStack,
  HStack,
  Avatar,
} from "@chakra-ui/react";
import InputField from "./InputField";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import useChatContext from "../hooks/useChatContext";

const UserChats = () => {
  const { user, chats, setChats, selectedChat, setSelectedChat, fetchAgain } =
    useChatContext();
  const [isLoading, setLoading] = useState(true);
  const toast = useToast();
  const [loggedInUser, setLoggedInUser] = useState(null);

  const fetchChats = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    await axios
      .get("/api/chats", config)
      .then((res) => {
        setChats(res.data);
      })
      .catch((err) => {
        if (toast.isActive("toast")) {
          return toast.close();
        }
        toast({
          id: "toast",
          title: err.response.data.message,
          status: "warning",
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoggedInUser(JSON.parse(localStorage.getItem("userDetails")));
    fetchChats();
    console.log('===  UserChats.jsx [51] ===', );
  }, [fetchAgain]);

  return (
    <Grid px={3} templateRows="auto 1fr" gap={3} h="100%" overflowY="auto">
      <InputField
        type="text"
        placeholder="Search for chats"
        isRequired={false}
      />
      {!isLoading && chats ? (
        <VStack gap={3} pb={3}>
          {/* {console.log("=== chats UserChats.jsx [57] ===", chats)} */}
          {chats &&
            chats.map((chat) => (
              <ChatDetails
                key={chat._id}
                setSelectedChat={setSelectedChat}
                chat={chat}
                selectedChat={selectedChat}
                loggedInUser={loggedInUser}
              />
            ))}
        </VStack>
      ) : (
        <Grid gap={3} h="100%">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} rounded="md" />
          ))}
        </Grid>
      )}
    </Grid>
  );
};

export default UserChats;

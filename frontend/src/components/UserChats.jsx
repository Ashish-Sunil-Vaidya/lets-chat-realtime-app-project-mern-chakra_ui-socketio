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
import { getSender, getSenderFull } from "../config/ChatLogics";

const UserChats = ({ fetchAgain, setFetchAgain }) => {
  const { user, chats, setChats, selectedChat, setSelectedChat } =
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
        // console.log("=== res.data UserChats.jsx [25] ===", res.data);
      })
      .catch((err) => {
        if (toast.isActive("toast")) {
          return toast.closeAll();
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
    if (user) {
      setLoggedInUser(user);
      fetchChats();
    }
  }, [user, fetchAgain]);

  return (
    <Grid px={3} templateRows="auto 1fr" gap={3} h="100%" overflowY="auto">
      <InputField
        type="text"
        placeholder="Search for chats"
        isRequired={false}
      />
      {!isLoading && chats ? (
        <VStack gap={3}>
          {/* {console.log("=== chats UserChats.jsx [57] ===", chats)} */}
          {chats.map((chat) => (
            <Box
              w="100%"
              key={chat._id}
              p={3}
              borderRadius="md"
              onClick={() => setSelectedChat(chat)}
              bg={selectedChat?._id === chat._id ? "blue.100" : "gray.50"}
              // color={selectedChat === chat._id ? "white" : "black"}
            >
              <HStack>
                <Avatar
                  name={
                    !chat.isGroupChat
                      ? getSender(loggedInUser, chat.users)
                      : chat.chatName
                  }
                  src={
                    !chat.isGroupChat
                      ? getSenderFull(loggedInUser, chat.users).profilePic
                      : null
                  }
                />
                <Box>
                  <Text fontWeight="bold">
                    {!chat.isGroupChat
                      ? getSender(loggedInUser, chat.users)
                      : chat.chatName}
                  </Text>
                  <Text
                    fontSize="sm"
                    // color={selectedChat === chat._id ? "white" : "gray.500"}
                  >
                    {chat.createdAt}
                  </Text>
                </Box>
              </HStack>
              <Text>{chat.latestMessage}</Text>
            </Box>
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

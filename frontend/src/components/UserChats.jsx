import { ChatDetails } from "./ChatDetails";
import {
  Box,
  Text,
  Skeleton,
  Grid,
  VStack,
  HStack,
  Avatar,
  Button,
  Flex,
} from "@chakra-ui/react";
import InputField from "./InputField";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import useChatContext from "../hooks/useChatContext";
import { useColorModeValue } from "@chakra-ui/react";
import SearchChats from "./SearchChats";
import AddUsersDrawer from "./AddUsersDrawer";
import CreateGroupDrawer from "./CreateGroupDrawer";

const UserChats = () => {
  const { user, chats, setChats, selectedChat, setSelectedChat, fetchAgain } =
    useChatContext();
  const [isLoading, setLoading] = useState(true);
  const toast = useToast();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const userChatsBG = useColorModeValue("white", "gray.800");
  const featuresBG = useColorModeValue("gray.50", "gray.700");
  const sectionBorderColor = useColorModeValue("gray.200", "gray.600");

  const fetchChats = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user?.token}`,
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
    // console.log('===  UserChats.jsx [51] ===', chats);
  }, [fetchAgain]);



  return (
    <Grid
      templateRows={{ base: "1fr auto", md: "auto 1fr auto" }}
      overflow="hidden"
      bgColor={userChatsBG}
      borderRightWidth={{ base: "none", md: "2px" }}
      borderColor={sectionBorderColor}
    >
      <Box p={3} display={{ base: "none", md: "block" }}>
        <Box borderRadius="md" bgColor={featuresBG}>
          <SearchChats />
        </Box>
      </Box>
      {!isLoading && chats ? (
        <VStack
          px={3}
          overflowY="auto"
          sx={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": { width: 0, height: 0 },
          }}
        >
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
        <Grid gap={3} h="100%" p={3}>
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} rounded="md" />
          ))}
        </Grid>
      )}
      <Flex p={3} gap={3} bgColor={featuresBG} borderTopWidth="2px">
        <AddUsersDrawer />
        <CreateGroupDrawer />
      </Flex>
    </Grid>
  );
};

export default UserChats;

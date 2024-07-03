import PropTypes from "prop-types";
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
  Input,
  Checkbox,
  IconButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
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
import { getSender } from "../config/ChatLogics";
import { FaTrash } from "react-icons/fa";
import { CloseIcon } from "@chakra-ui/icons";

const UserChats = () => {
  const {
    user,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    fetchAgain,
    setFetchAgain,
    search,
    deleteMode,
    setDeleteMode,
  } = useChatContext();
  const [isLoading, setLoading] = useState(true);
  const toast = useToast();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const userChatsBG = useColorModeValue("white", "gray.800");
  const featuresBG = useColorModeValue("gray.50", "gray.700");
  const sectionBorderColor = useColorModeValue("gray.200", "gray.600");
  const [searchResults, setSearchResults] = useState([]);

  const [selectedUsers, setSelectedUsers] = useState([]);

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

  const handleDeleteUsers = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    };
    await axios
      .delete("/api/chats", { data: { chatIds: selectedUsers }, ...config })
      .then(() => {
        toast({
          title: `${selectedUsers.length} chats deleted`,
          status: "success",
        });
        setDeleteMode(false);
        setSelectedUsers(null);
        setFetchAgain(!fetchAgain);
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
      });
  };

  useEffect(() => {
    setLoggedInUser(JSON.parse(localStorage.getItem("userDetails")));
    fetchChats();
    // console.log('===  UserChats.jsx [51] ===', chats);
  }, [fetchAgain]);

  useEffect(() => {
    if (search) {
      const results = chats.filter((chat) =>
        chat.isGroupChat
          ? chat.chatName.toLowerCase().indexOf(search.toLowerCase()) > -1
          : getSender(loggedInUser, chat.users)
              .toLowerCase()
              .indexOf(search.toLowerCase()) > -1
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [search]);

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
          {deleteMode && (
            <Alert status="error" display="flex" rounded="md" mt={3}>
              <AlertIcon />
              <AlertTitle flex={1}>
                Select the chats you want to delete and click on the trash icon
              </AlertTitle>
              <AlertDescription justifySelf="flex-end">
                <IconButton
                  aria-label="Delete Chats"
                  icon={<FaTrash />}
                  colorScheme="red"
                  onClick={handleDeleteUsers}
                />
              </AlertDescription>
            </Alert>
          )}
     
          {!searchResults.length && !search
            ? chats.length &&
              chats.map((chat) => (
                <HStack key={chat._id} w="full">
                  <ChatDetails
                    setSelectedChat={setSelectedChat}
                    chat={chat}
                    selectedChat={selectedChat}
                    loggedInUser={loggedInUser}
                  />
                  {deleteMode && (
                    <Checkbox
                      type="checkbox"
                      size="lg"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, chat._id]);
                        } else {
                          setSelectedUsers(
                            selectedUsers.filter((_id) => _id !== chat._id)
                          );
                        }
                      }}
                      isChecked={selectedUsers.includes(chat._id)}
                    />
                  )}
                </HStack>
              ))
            : searchResults&&
              searchResults.map((chat) => (
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
        <IconButton
          aria-label="Delete Chats"
          icon={!deleteMode ? <FaTrash /> : <CloseIcon />}
          variant="outline"
          colorScheme={deleteMode ? "red" : "blue"}
          onClick={() => setDeleteMode(!deleteMode)}
        />
      </Flex>
    </Grid>
  );
};

UserChats.propTypes = {
  user: PropTypes.object,
  chats: PropTypes.array,
  setChats: PropTypes.func,
  selectedChat: PropTypes.object,
  setSelectedChat: PropTypes.func,
  fetchAgain: PropTypes.bool,
  setFetchAgain: PropTypes.func,
  search: PropTypes.string,
  deleteMode: PropTypes.bool,
  setDeleteMode: PropTypes.func,
};

export default UserChats;

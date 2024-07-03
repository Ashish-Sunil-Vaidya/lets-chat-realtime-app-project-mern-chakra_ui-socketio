import {
  DrawerOverlay,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  Drawer,
  DrawerContent,
  DrawerCloseButton,
  Button,
  useDisclosure,
  Input,
  FormLabel,
  useToast,
  Box,
  Avatar,
  Flex,
  Skeleton,
  VStack,
  Grid,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import axios from "axios";
import useChatContext from "../hooks/useChatContext";
import InputField from "./InputField";
import UserListItem from "./UserListItem";

const AddUsersDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const toast = useToast();
  const { user, setSelectedChat, setChats, chats } = useChatContext();

  const handleSearch = async () => {
    setLoading(true);
    await axios
      .get(`/api/user?search=${search}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      .then((res) => {
        setSearchResults(res.data);
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

    setLoading(false);
  };

  const accessChat = (userId) => {
    setLoadingChat(true);
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
    };

    axios
      .post(`/api/chats`, { userId }, config)
      .then((response) => {
        const data = response.data;
        if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
        setSelectedChat(data);
        setLoadingChat(false);
        toast({
          title: "Chat created successfully",
          status: "success",
        });
        onClose();
      })
      .catch((error) => {
        toast({
          title: error.message,
          status: "error",
        });
      })
      .finally(() => {
        setLoadingChat(false);
      });
  };

  return (
    <>
      <IconButton
        icon={<AddIcon />}
        colorScheme="blue"
        variant="outline"
        onClick={onOpen}
      />
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">New Chat</DrawerHeader>

          <DrawerBody>
            <Grid h="100%" templateRows="auto 1fr">
              <InputField
                label="Search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for a user"
              />

              <VStack
                w="100%"
                h="100%"
                overflowY="auto"
                sx={{
                  "::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
                py={3}
              >
                {!loading &&
                  searchResults&&
                  searchResults.map((user) => (
                    <UserListItem
                      key={user._id}
                      username={user.username}
                      email={user.email}
                      avatarUrl={user.profilePic}
                      onClick={() => accessChat(user._id)}
                      isLoading={loadingChat}
                    />
                  ))}

                {loading && (
                  <>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <Skeleton key={n} height="50px" />
                    ))}
                  </>
                )}
              </VStack>
            </Grid>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px" display="flex" gap={3}>
            <Button
              variant="outline"
              colorScheme="red"
              onClick={onClose}
              flex={1}
            >
              Cancel
            </Button>
            <Button colorScheme="blue" flex={1} onClick={handleSearch}>
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AddUsersDrawer;

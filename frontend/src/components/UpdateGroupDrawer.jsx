import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerBody,
  DrawerCloseButton,
  Button,
  useDisclosure,
  Flex,
  Avatar,
  Heading,
  Text,
  Box,
  Grid,
  useToast,
  VStack,
  IconButton,
  Skeleton,
  Badge,
  Tag,
  TagCloseButton,
  HStack,
  Input,
} from "@chakra-ui/react";
import useChatContext from "../hooks/useChatContext";
import { MdGroupAdd } from "react-icons/md";
import { useState } from "react";
import InputField from "./InputField";
import axios from "axios";
import { AddIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";

const UpdateGroupDrawer = ({ groupChatName, groupMembers }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat, fetchAgain, setFetchAgain } =
    useChatContext();
  const [groupChatNameInput, setGroupChatName] = useState(groupChatName || "");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();

  const handleSearch = async () => {
    if (toast.isActive("search-toast")) {
      toast.close("search-toast");
    }
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user/?search=${search}`, config);
      const gmid = groupMembers.map((u) => u._id);
      setSearchResults(data.filter((u) => !gmid.includes(u._id)));
    } catch (error) {
      console.error(error);
      toast({
        id: "search-toast",
        title: error.response.data.message,
        status: "error",
      });
    }
    setLoading(false);
  };

  const handleAdd = async (selUser) => {
    if (toast.isActive("add-toast")) {
      toast.close("add-toast");
    }
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    await axios
      .put(
        "/api/chats/addToGroupChat",
        { chatId: selectedChat?._id, userId: selUser._id },
        config
      )
      .then(({ data }) => {
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setSearchResults(searchResults.filter((u) => u._id !== selUser._id));
        toast({
          id: "add-toast",
          title: "User added to group chat",
          status: "success",
        });
      })
      .catch((error) => {
        console.error(error);
        toast({
          id: "add-toast",
          title: error.response.data.message,
          status: "error",
        });
      });
  };

  const handleRemove = async (mem) => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    await axios
      .put(
        `/api/chats/removeFromGroupChat`,
        {
          chatId: selectedChat?._id,
          userId: mem._id,
        },
        config
      )
      .then(({ data }) => {
        mem._id === user._id ? setSelectedChat(null) : setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        toast({
          title: "User removed from group chat",
          status: "success",
        });
      })
      .catch((error) => {
        console.error(error);
        toast({
          id: "remove-toast",
          title: error.response.data.message,
          status: "error",
        });
      });
  };

  const handleRename = async () => {
    if (toast.isActive("edit-toast")) {
      toast.close("edit-toast");
    }
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    await axios
      .put(
        "/api/chats/renameGroupChat",
        { chatId: selectedChat?._id, chatName: groupChatNameInput },
        config
      )
      .then(({ data }) => {
        setSelectedChat(data);
        toast({
          id: "edit-toast",
          title: "Group Chat renamed successfully",
          status: "success",
        });
        setFetchAgain(!fetchAgain);
      })
      .catch((error) => {
        console.error(error);
        toast({
          id: "edit-toast",
          title: error.response.data.message,
          status: "error",
        });
      });
  };
  

  return (
    <>
      <IconButton
        as={EditIcon}
        p={2}
        variant="ghost"
        colorScheme="blue"
        onClick={onOpen}
      />
      <Drawer isOpen={isOpen} onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <HStack justify="space-between">
              <Text>Edit</Text>
              <Button mr={10}>Add Profile Picture</Button>
            </HStack>
          </DrawerHeader>
          <DrawerBody overflowY="auto">
            <Grid h="100%" spacing={1} templateRows="auto 1fr">
              <VStack>
                <HStack w="100%" align="flex-end">
                  <InputField
                    label="Group Chat Name"
                    type="text"
                    placeholder="Group Chat Name"
                    value={groupChatNameInput}
                    onChange={(e) => setGroupChatName(e.target.value)}
                  />
                  <Button colorScheme="blue" onClick={handleRename}>
                    Rename
                  </Button>
                </HStack>
                <Flex w="100%" align="flex-end" gap={3}>
                  <InputField
                    label="Search"
                    type="text"
                    placeholder="Search for users"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                  />

                  <Button
                    colorScheme="blue"
                    isLoading={isLoading}
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </Flex>
              </VStack>

              <VStack w="100%" h="100%" overflowY="auto" p={3} gap={3}>
                {groupMembers.map(
                  (mem) =>
                    mem._id !== selectedChat.groupAdmin._id && (
                      <Flex
                        key={mem._id}
                        p={3}
                        justify="space-between"
                        align="center"
                        w="100%"
                        rounded="md"
                        bg="blue.50"
                      >
                        <Flex align="center" gap={3}>
                          <Avatar
                            name={mem.username}
                            src={mem.avatar}
                            size="sm"
                          />
                          <Text>{mem.username}</Text>
                        </Flex>
                        <Button
                          colorScheme="red"
                          size="sm"
                          onClick={() => handleRemove(mem)}
                          variant="ghost"
                        >
                          <CloseIcon />
                        </Button>
                      </Flex>
                    )
                )}
                {!isLoading &&
                  searchResults.map((user) => (
                    <Flex
                      key={user._id}
                      p={3}
                      justify="space-between"
                      align="center"
                      w="100%"
                      rounded="md"
                    >
                      <Flex align="center" gap={3}>
                        <Avatar
                          name={user.username}
                          src={user.avatar}
                          size="sm"
                        />
                        <Text>{user.username}</Text>
                      </Flex>

                      <Button
                        colorScheme="blue"
                        size="sm"
                        onClick={() => handleAdd(user)}
                        variant="ghost"
                      >
                        <AddIcon />
                      </Button>
                    </Flex>
                  ))}
                {isLoading && (
                  <Grid gap={3} h="100%" w="100%">
                    {[...Array(8)].map((_, i) => (
                      <Skeleton key={i} rounded="md" />
                    ))}
                  </Grid>
                )}
              </VStack>
            </Grid>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default UpdateGroupDrawer;

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
import { useColorModeValue } from "@chakra-ui/react";

const UpdateGroupDrawer = ({
  groupChatName,
  groupMembers,
  groupChatProfilePic,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat, fetchAgain, setFetchAgain } =
    useChatContext();
  const [groupChatNameInput, setGroupChatName] = useState(groupChatName || "");

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();
  const selectedUserBG = useColorModeValue("blue.50", "gray.600");
  const [avatar, setAvatar] = useState("");
  const [cloudinaryUrl, setCloudinaryUrl] = useState(groupChatProfilePic);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleSearch = async () => {
    if (toast.isActive("search-toast")) {
      toast.close("search-toast");
    }
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.get(`/api/user/?search=${search}`, config);
      const gmid = groupMembers && groupMembers.map((u) => u._id);
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
        Authorization: `Bearer ${user?.token}`,
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

  const handleUpload = () => {
    if (
      ["image/jpeg", "image/png", "image/webp"].includes(cloudinaryUrl.type)
    ) {
      setUploadLoading(true);
      const data = new FormData();
      data.append("file", cloudinaryUrl);
      data.append("upload_preset", "letschat");
      data.append("cloud_name", "calmperson");
      fetch("https://api.cloudinary.com/v1_1/calmperson/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data.url);
          setCloudinaryUrl(data.url);

          setUploadLoading(false);
          setUploaded(true);
          const config = {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          };
          axios
            .put(
              "/api/chats/updateProfilePic",
              { chatId: selectedChat?._id, groupChatProfilePic: data.url },
              config
            )
            .then(({ data }) => {
              setSelectedChat(data);
              setFetchAgain(!fetchAgain);
            })
            .catch((err) => {
              console.log(err);
              toast({
                title: err.message,
                status: "error",
              });
              setUploadLoading(false);
            });
        })
        .catch((err) => {
          console.log(err);
          toast({
            title: err.message,
            status: "error",
          });
          setUploadLoading(false);
        })
        .finally(() => {
          toast({
            title: "Image Uploaded Successfully",
            status: "success",
          });
        });
    } else {
      toast({
        title: "Invalid File Format",
        status: "error",
      });
    }
  };

  const handleRemove = async (mem) => {
    const config = {
      headers: {
        Authorization: `Bearer ${user?.token}`,
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
        Authorization: `Bearer ${user?.token}`,
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
            </HStack>
          </DrawerHeader>
          <DrawerBody overflowY="auto">
            <Grid h="100%" spacing={1} templateRows="auto 1fr">
              <VStack>
                <VStack>
                  <Box position="relative" justify="center" h="100%">
                    <Input
                      type="file"
                      position="absolute"
                      opacity={0}
                      w="100%"
                      bgColor="red.100"
                      h="100%"
                      zIndex={999}
                      onChange={(e) => {
                        setAvatar(URL.createObjectURL(e.target.files[0]));
                        setCloudinaryUrl(e.target.files[0]);
                        setUploaded(false);
                      }}
                    />
                    <Avatar
                      boxSize="200px"
                      name={groupChatName}
                      src={avatar}
                      size="xl"
                      bg="blue.500"
                    />
                  </Box>
                  {!avatar ? (
                    <Text color="blue.200">
                      Click anywhere around Avatar or Drag n Drop
                    </Text>
                  ) : (
                    !uploaded && (
                      <>
                        <Button
                          colorScheme="blue"
                          onClick={handleUpload}
                          isLoading={uploadLoading}
                          loadingText="Uploading"
                        >
                          Upload
                        </Button>
                        <Button
                          colorScheme="red"
                          onClick={() => {
                            setAvatar("");
                            setCloudinaryUrl("");
                            setUploaded(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    )
                  )}
                </VStack>
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
                {groupMembers&&
                  groupMembers.map(
                    (mem) =>
                      mem._id !== selectedChat.groupAdmin._id && (
                        <Flex
                          key={mem._id}
                          p={3}
                          justify="space-between"
                          align="center"
                          w="100%"
                          rounded="md"
                          bg={selectedUserBG}
                        >
                          <Flex align="center" gap={3}>
                            <Avatar
                              name={mem.username}
                              src={mem.profilePic}
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
                  searchResults&&
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

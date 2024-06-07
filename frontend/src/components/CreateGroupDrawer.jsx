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
  Link,
} from "@chakra-ui/react";
import useChatContext from "../hooks/useChatContext";
import { MdGroupAdd } from "react-icons/md";
import { useState } from "react";
import InputField from "./InputField";
import axios from "axios";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { useColorModeValue } from "@chakra-ui/react";

const CreateGroupDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, setChats, fetchAgain, setFetchAgain } = useChatContext();
  const [groupChatName, setGroupChatName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [cloudinaryUrl, setCloudinaryUrl] = useState("");
  const toast = useToast();
  const selectedUserBG = useColorModeValue("blue.50", "gray.600");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    };
    await axios
      .get(`/api/user?search=${search}`, config)
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
          toast({
            title: "Image Uploaded Successfully",
            status: "success",
          });
          setUploadLoading(false);
          setUploaded(true);
        })
        .catch((err) => {
          console.log(err);
          toast({
            title: err.message,
            status: "error",
          });
          setUploadLoading(false);
        });
    } else {
      toast({
        title: "Invalid File Format",
        status: "error",
      });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    };
    const data = {
      name: groupChatName,
      users: JSON.stringify(selectedUsers.map((u) => u._id)),
      groupChatProfilePic: cloudinaryUrl,
    };
    await axios
      .post("/api/chats/group", data, config)
      .then((res) => {
        setChats((prev) => [...prev, res.data]);
        toast({
          id: "toast",
          title: "Group Chat created successfully",
          status: "success",
        });
        setFetchAgain(!fetchAgain);
        onClose();
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
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <IconButton
        icon={<MdGroupAdd size="25px" />}
        colorScheme="blue"
        variant="outline"
        onClick={onOpen}
        display="flex"
        gap={3}
      />

      <Drawer isOpen={isOpen} onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>New Group Chat</DrawerHeader>
          <DrawerBody>
            <Grid h="100%" spacing={1} templateRows="auto 1fr">
              <Box>
                <Flex alignItems="flex-end" gap={3}>
                  <InputField
                    label="Select Group Profile Photo"
                    type="file"
                    placeholder="Select Group Profile Photo"
                    isRequired={false}
                    onChange={(e) => {
                      setAvatar(URL.createObjectURL(e.target.files[0]));
                      setCloudinaryUrl(e.target.files[0]);
                      setUploaded(false);
                    }}
                   display="none"
                  />
                  
                  {uploaded && <Link as={Button} href={cloudinaryUrl}>Preview</Link>}
                </Flex>

                {avatar && !uploaded && (
                  <Box>
                    Preview
                    <Avatar src={avatar} size="md" />
                    <Flex>
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
                      <Button
                        isLoading={uploadLoading}
                        loadingText="Uploading"
                        onClick={handleUpload}
                        colorScheme="blue"
                      >
                        Upload
                      </Button>
                    </Flex>
                  </Box>
                )}

                <InputField
                  label="Group Chat Name"
                  type="text"
                  placeholder="Group Chat Name"
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
                <Flex w="100%" align="flex-end" gap={3}>
                  <InputField
                    label="Search"
                    type="text"
                    placeholder="Search for users"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  <Button
                    colorScheme="blue"
                    isLoading={isLoading}
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </Flex>
              </Box>
              <VStack w="100%" h="100%" overflowY="auto" p={3} gap={3}>
                {searchResults.map((user) => (
                  <Flex
                    key={user._id}
                    p={3}
                    justify="space-between"
                    align="center"
                    w="100%"
                    rounded="md"
                    sx={{
                      bg: selectedUsers.includes(user) ? selectedUserBG : null,
                    }}
                  >
                    <Flex align="center" gap={3}>
                      <Avatar
                        name={user.username}
                        src={user.avatar}
                        size="sm"
                      />
                      <Text>{user.username}</Text>
                    </Flex>
                    {!selectedUsers.includes(user) ? (
                      <Button
                        colorScheme="blue"
                        size="sm"
                        onClick={() =>
                          setSelectedUsers([...selectedUsers, user])
                        }
                        variant="ghost"
                      >
                        <AddIcon />
                      </Button>
                    ) : (
                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() =>
                          setSelectedUsers(
                            selectedUsers.filter((u) => u !== user)
                          )
                        }
                        variant="ghost"
                      >
                        <CloseIcon />
                      </Button>
                    )}
                  </Flex>
                ))}
              </VStack>
            </Grid>
          </DrawerBody>

          <DrawerFooter as={Flex} gap={3}>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CreateGroupDrawer;

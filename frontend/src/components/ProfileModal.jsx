import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Flex,
  Avatar,
  Heading,
  Text,
  Grid,
  Box,
  VStack,
  HStack,
  Badge,
  useToast,
  Input,
} from "@chakra-ui/react";
import useChatContext from "../hooks/useChatContext";
import { useState } from "react";
import InputField from "./InputField";
import { CheckIcon } from "@chakra-ui/icons";
import axios from "axios";

const ProfileModal = ({
  buttonChildren = "Profile",
  style = {},
  userInfo,
  isGroupChat,
  groupChatName,
  groupMembers,
  groupAdmin,
  groupChatProfilePic,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, fetchAgain, setFetchAgain } = useChatContext();
  const [isEditable, setIsEditable] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [cloudinaryUrl, setCloudinaryUrl] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [username, setUsername] = useState(userInfo?.username);
  const toast = useToast();

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
              "/api/user/updateUser",
              { userId: user.id, profilePic: data.url },
              config
            )
            .then(() => {
              const updatedUser = { ...user, profilePic: data.url };
              localStorage.setItem("userDetails", JSON.stringify(updatedUser));
              setFetchAgain(!fetchAgain);
              setIsEditable(false);
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

  const updateUsername = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    };

    await axios
      .put("/api/user/updateUser", { userId: user.id, username }, config)
      .then(() => {
        const updatedUsername = { ...user, username };
        localStorage.setItem("userDetails", JSON.stringify(updatedUsername));
        setFetchAgain(!fetchAgain);
        setIsEditable(false);
        toast({
          title: "Username Updated Successfully",
          status: "success",
        });
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: err.message,
          status: "error",
        });
      });
  };

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen} {...style}>
        {buttonChildren}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={isGroupChat ? "xl" : "md"}
        h="50%"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HStack gap={10} justify="center">
              <Flex direction="column" align="center" gap={3}>
                {!isEditable ? (
                  <Avatar
                    name={!isGroupChat ? userInfo?.username : groupChatName}
                    src={
                      !isGroupChat ? userInfo?.profilePic : groupChatProfilePic
                    }
                    size="2xl"
                    boxSize="200px"
                    boxShadow="outline"
                  />
                ) : (
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
                        name={userInfo?.username}
                        src={!avatar ? userInfo?.profilePic : avatar}
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
                )}
                <VStack>
                  {!isEditable ? (
                    <Heading fontSize="2xl">
                      {!isGroupChat ? userInfo?.username : groupChatName}
                    </Heading>
                  ) : (
                    <HStack>
                      <InputField
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <Button
                        colorScheme="green"
                        isDisabled={username === user?.username}
                        onClick={updateUsername}
                      >
                        <CheckIcon />
                      </Button>
                    </HStack>
                  )}
                  {!isGroupChat && <Text>{userInfo?.email}</Text>}
                </VStack>
              </Flex>
              {isGroupChat && (
                <Grid templateRows="auto 1fr">
                  <Text
                    color="blue.500"
                    textAlign="center"
                    p={3}
                    borderBottom="2px"
                    borderColor="blue.100"
                  >
                    Group Members
                  </Text>
                  <VStack
                    h="100%"
                    pt={3}
                    overFlowY="auto"
                    sx={{
                      "::-webkit-scrollbar": {
                        display: "none",
                      },
                    }}
                  >
                    {groupMembers&&
                      groupMembers.map((user) => (
                        <ProfileModal
                          key={user._id}
                          userInfo={user}
                          buttonChildren={
                            <HStack w="100%">
                              <Avatar
                                name={user.username}
                                src={user.profilePic}
                                size="sm"
                              />
                              <Text>{user.username}</Text>
                              {user._id === groupAdmin && (
                                <Badge colorScheme="green" variant="solid">
                                  Admin
                                </Badge>
                              )}
                            </HStack>
                          }
                          style={{
                            variant: "ghost",
                            w: "100%",
                          }}
                        />
                      ))}
                  </VStack>
                </Grid>
              )}
            </HStack>
          </ModalBody>

          <ModalFooter as={Flex} gap={3}>
            {userInfo?._id === user?._id && (
              <Button
                onClick={() => {
                  setIsEditable(!isEditable);
                  setUsername(userInfo?.username);
                }}
              >
                {isEditable ? "Cancel" : "Edit"}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;

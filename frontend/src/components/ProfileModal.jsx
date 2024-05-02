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
} from "@chakra-ui/react";
import useChatContext from "../hooks/useChatContext";

const ProfileModal = ({
  buttonChildren = "Profile",
  style = {},
  userInfo,
  isGroupChat,
  groupChatName,
  groupMembers,
  groupAdmin,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useChatContext();

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
                <Avatar
                  name={!isGroupChat ? userInfo?.username : groupChatName}
                  src={!isGroupChat ? userInfo?.profilePic : null}
                  size="2xl"
                  boxSize="200px"
                />
                <VStack>
                  <Heading fontSize="2xl">
                    {!isGroupChat ? userInfo?.username : groupChatName}
                  </Heading>
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
                    {groupMembers &&
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
                                <Badge colorScheme="green" variant="solid">Admin</Badge>
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
              <Button variant="ghost">Edit</Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;

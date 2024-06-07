import useChatContext from "../../hooks/useChatContext";
import {
  Box,
  Text,
  Flex,
  Heading,
  VStack,
  Grid,
  Icon,
  IconButton,
  HStack,
  useToast,
  useColorModeValue,
  Avatar,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "../ProfileModal";
import { FaCircleInfo } from "react-icons/fa6";
import { getSenderFull, getSender } from "../../config/ChatLogics";
import InputField from "../InputField";
import { useState } from "react";
import { BiSolidMessageDetail } from "react-icons/bi";
import { IoSend } from "react-icons/io5";
import UpdateGroupDrawer from "../UpdateGroupDrawer";

const GroupChats = () => {
  const { user, selectedChat, setSelectedChat } = useChatContext();
  const [chatInput, setChatInput] = useState("");
  const chatBoxHeaderFooterBG = useColorModeValue("blue.100", "gray.800");
  const chatBoxHeaderFooterBorder = useColorModeValue("gray.300", "gray.500");
  const typingBadgeBG = useColorModeValue("blue.500", "gray.600");
  const inputBG = useColorModeValue("white", "gray.700");
  const toast = useToast();

  return (
    <Flex direction="column" h="100%">
      {selectedChat && (
        <Flex
          justify="space-between"
          pl={3}
          bgColor={chatBoxHeaderFooterBG}
          borderBottomWidth="1px"
        >
          <Flex align="center" gap={3}>
            <IconButton
              display={{ base: "block", md: "none" }}
              variant="ghost"
              icon={<ArrowBackIcon boxSize={8} />}
              onClick={() => setSelectedChat(null)}
            />
            <Avatar src={selectedChat?.groupChatProfilePic} size="sm" />
            <Heading fontSize="1.3rem" textColor="blue.500" py={4}>
              {selectedChat && selectedChat.chatName}
            </Heading>
            {/* {isTyping && user.id !== getSender(user, selectedChat.users) && (
              <Tag
                size="sm"
                height="fit-content"
                bgColor={typingBadgeBG}
                color="white"
              >
                Typing...
              </Tag>
            )} */}
          </Flex>
          <HStack gap={3}>
            {/* {
            console.log(
              "=== selectedChat,user SingleChatMessage.jsx [38] ===",
              selectedChat,
              user
            )} */}
            {selectedChat.groupAdmin._id === user?.id && (
              <UpdateGroupDrawer
                groupChatName={selectedChat.chatName}
                groupChatProfilePic={selectedChat.groupChatProfilePic}
                groupMembers={selectedChat.users}
                groupAdmin={selectedChat.groupAdmin._id}
              />
            )}

            <ProfileModal
              userInfo={
                selectedChat && getSenderFull(user, selectedChat?.users)
              }
              buttonChildren={<FaCircleInfo size="25px" />}
              style={{
                variant: "ghost",
              }}
              isGroupChat={selectedChat && selectedChat?.isGroupChat}
              groupChatName={selectedChat && selectedChat?.chatName}
              groupMembers={selectedChat && selectedChat?.users}
              groupAdmin={selectedChat && selectedChat?.groupAdmin?._id}
              groupChatProfilePic={
                selectedChat && selectedChat?.groupChatProfilePic
              }
            />
          </HStack>
        </Flex>
      )}
      {!selectedChat ? (
        <VStack flex={1} justify="center">
          <Icon as={BiSolidMessageDetail} fontSize="100px" color="blue.300" />
          <Text fontSize="2xl" color="blue.300">
            Select a chat to start messaging
          </Text>
        </VStack>
      ) : (
        <Box flex={1}></Box>
      )}
      {selectedChat && (
        <Flex
          p={3}
          align="center"
          gap={3}
          bgColor={chatBoxHeaderFooterBG}
          borderTopWidth="1px"
        >
          <Box bgColor={inputBG} rounded="md" w="100%">
            <InputField
              placeholder="Enter your chat here."
              value={chatInput}
              onChange={setChatInput}
              isRequired={false}
            />
          </Box>
          <IconButton as={IoSend} p={2} colorScheme="blue" />
        </Flex>
      )}
    </Flex>
  );
};

export default GroupChats;

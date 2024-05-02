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
} from "@chakra-ui/react";
import ProfileModal from "../ProfileModal";
import { FaCircleInfo } from "react-icons/fa6";
import { getSenderFull, getSender } from "../../config/ChatLogics";
import InputField from "../InputField";
import { useState } from "react";
import { BiSolidMessageDetail } from "react-icons/bi";
import { IoSend } from "react-icons/io5";


const SingleChatMessage = () => {
  const { user, selectedChat } = useChatContext();
  const [chatInput, setChatInput] = useState("");

  return (
    <Flex direction="column" h="100%">
      {selectedChat && (
        <Flex justify="space-between" p={3} bgColor="gray.50">
          <Heading fontSize="1.8rem" textColor="blue.500">
            {selectedChat && getSender(user, selectedChat.users)}
          </Heading>
          <HStack gap={3}>
            <ProfileModal
              userInfo={
                selectedChat && getSenderFull(user, selectedChat.users)
              }
              buttonChildren={<FaCircleInfo size="25px" />}
              style={{
                variant: "ghost",
              }}
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
        <Flex bg="gray.50" p={3} align="center" gap={3}>
          <InputField
            placeholder="Enter your chat here."
            value={chatInput}
            onChange={setChatInput}
            isRequired={false}
          />
          <IconButton as={IoSend} p={2} colorScheme="blue" />
        </Flex>
      )}
    </Flex>
  );
};

export default SingleChatMessage;

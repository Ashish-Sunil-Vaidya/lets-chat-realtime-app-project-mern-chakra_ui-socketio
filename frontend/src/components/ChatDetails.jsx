/* eslint-disable react/prop-types */

import { Box, Text, HStack, Avatar } from "@chakra-ui/react";
import { getSenderFull, getSender } from "../config/ChatLogics";

export function ChatDetails({
  setSelectedChat,
  chat,
  selectedChat,
  loggedInUser,
}) {
  return (
    <Box
      w="100%"
      key={chat._id}
      p={3}
      borderRadius="md"
      onClick={() => setSelectedChat(chat)}
      bg={selectedChat?._id === chat._id ? "blue.100" : "gray.50"} // color={selectedChat === chat._id ? "white" : "black"}
    >
      <HStack>
        <Avatar
          name={
            !chat.isGroupChat
              ? getSender(loggedInUser, chat.users)
              : chat.chatName
          }
          src={
            !chat.isGroupChat
              ? getSenderFull(loggedInUser, chat.users).profilePic
              : null
          }
        />
        <Box>
          <Text fontWeight="bold">
            {!chat.isGroupChat
              ? getSender(loggedInUser, chat.users)
              : chat.chatName}
          </Text>
          <Text
            fontSize="sm" // color={selectedChat === chat._id ? "white" : "gray.500"}
          >
            {chat.createdAt}
          </Text>
        </Box>
      </HStack>
      <Text>{chat.latestMessage}</Text>
    </Box>
  );
}
export default ChatDetails;

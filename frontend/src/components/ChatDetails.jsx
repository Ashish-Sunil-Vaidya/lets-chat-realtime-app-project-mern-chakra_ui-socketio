/* eslint-disable react/prop-types */

import { Box, Text, HStack, Avatar } from "@chakra-ui/react";
import { getSenderFull, getSender } from "../config/ChatLogics";
import { useColorModeValue } from "@chakra-ui/react";

export function ChatDetails({
  setSelectedChat,
  chat,
  selectedChat,
  loggedInUser,
}) {
  const chatDetailsBG = useColorModeValue(
    selectedChat?._id === chat._id ? "blue.500" : null,
    selectedChat?._id === chat._id ? "blue.900" : null
  );

  const fontColor = selectedChat?._id === chat._id ? "white" : "blue.500";

  return (
    <Box
      w="100%"
      key={chat._id}
      p={3}
      onClick={() => setSelectedChat(chat)}
      bg={{ base: "transperant", md: chatDetailsBG }} // color={selectedChat === chat._id ? "white" : "black"}
      color={fontColor}
      borderBottomWidth="1px"
      sx={{
        borderRadius: {
          base: "none",
          md: "md",
        },
      }}
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
              : chat.groupChatProfilePic
          }
          boxShadow="outline"
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
            {chat.latestMessage?.content}
          </Text>
        </Box>
      </HStack>
    </Box>
  );
}
export default ChatDetails;

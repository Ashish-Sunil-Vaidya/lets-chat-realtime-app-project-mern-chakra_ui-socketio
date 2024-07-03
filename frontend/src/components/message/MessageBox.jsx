import { Avatar, Box, HStack, Text, Tooltip } from "@chakra-ui/react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogics";
import { useColorModeValue } from "@chakra-ui/react";

const MessageBox = ({
  i,
  messages,
  message,
  userId,
  senderId,
  content,
  senderUsername,
  profilePic,
  isGroupChat,
}) => {
  // console.log(
  //   "=== senderId === userId MessageBox.jsx [10] ===",
  //   senderId === userId
  // );

  const light = senderId === userId ? "green.100" : "blue.100";
  const dark = senderId === userId ? "blue.800" : "gray.700";

  return (
    <HStack
      gap={2}
      alignSelf={senderId !== userId ? "flex-start" : "flex-end"}
      flexFlow={senderId !== userId ? "row" : "row-reverse"}
      px={10}
      my={3}
    >
      {isGroupChat && !isSameUser(messages, message, i, userId) && (
        <Tooltip label={senderUsername} hasArrow>
          <Avatar boxSize="30px" src={profilePic} name={senderUsername} />
        </Tooltip>
      )}

      <Box
        bgColor={useColorModeValue(light, dark)}
        p={3}
        borderRadius="md"
        maxW="70%"
        ml={isGroupChat && isSameUser(messages, message, i) ? "38px" : 0}
        mr={isGroupChat && isSameUser(messages, message, i) ? "38px" : 0}
        mt={isGroupChat && isSameUser(messages, message, i) ? 0 : 2}
      >
        <Text>{content}</Text>
      </Box>
    </HStack>
  );
};

export default MessageBox;

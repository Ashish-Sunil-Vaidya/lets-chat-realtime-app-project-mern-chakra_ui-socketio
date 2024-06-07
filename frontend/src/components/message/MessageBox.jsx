import { Avatar, Box, HStack, Text, Tooltip } from "@chakra-ui/react";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../../config/ChatLogics";
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
}) => {
  // console.log(
  //   "=== senderId === userId MessageBox.jsx [10] ===",
  //   senderId === userId
  // );

  const light = senderId === userId ? "gray.100" : "blue.100";
  const dark = senderId === userId ? "gray.800" : "blue.800";

  return (
    <HStack
      gap={1}
      alignSelf={senderId !== userId ? "flex-start" : "flex-end"}
      px={10}
      my={3}
    >
      {/* {isSameSender(messages, message, i, userId) ||
        (isLastMessage(messages, i, userId) && (
          <Tooltip label={senderUsername} hasArrow>
            <Avatar size="sm" src={profilePic} name={senderUsername} />
          </Tooltip>
        ))} */}
      <Box
        bgColor={useColorModeValue(light, dark)}
        p={3}
        borderRadius="md"
        maxW="70%"
        ml={isSameSenderMargin(messages, message, i, userId)}
        mt={isSameUser(messages, message, i) ? 0 : 2}
      >
        <Text>{content}</Text>
      </Box>
    </HStack>
  );
};

export default MessageBox;

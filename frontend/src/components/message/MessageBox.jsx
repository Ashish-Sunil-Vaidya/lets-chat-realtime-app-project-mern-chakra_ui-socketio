import { Box } from "@chakra-ui/react";
import SingleChatMessage from "./SingleChatMessage";
import GroupChatMessage from "./GroupChatMessage";
import useChatContext from "../../hooks/useChatContext";

const MessageBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useChatContext();
  return (
    <Box bgColor="blue.50" roundedTopLeft="3xl" overflow="hidden">
      {selectedChat && selectedChat.isGroupChat ? (
        <GroupChatMessage />
      ) : (
        <SingleChatMessage />
      )}
    </Box>
  );
};

export default MessageBox;

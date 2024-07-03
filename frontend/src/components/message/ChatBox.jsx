import { Box } from "@chakra-ui/react";
import SingleChats from "./SingleChats";
import GroupChats from "./GroupChats";
import useChatContext from "../../hooks/useChatContext";
import { useState } from "react";
import { useColorModeValue } from "@chakra-ui/react";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useChatContext();
  const chatBoxBG = useColorModeValue("white", "gray.900");

  return (
    <Box
      bgColor={chatBoxBG}
      overflow="hidden"
      h="100%"
    >
      {selectedChat && selectedChat.isGroupChat ? (
        <GroupChats />
      ) : (
        <SingleChats />
      )}
    </Box>
  );
};

export default ChatBox;

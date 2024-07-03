import { Box, useColorModeValue, Input } from "@chakra-ui/react";

import useChatContext from "../hooks/useChatContext";

const SearchChats = () => {
  const { search, setSearch } = useChatContext();
  

  return (
    
      <Input
        type="text"
        placeholder="Search for chats"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
 
  );
};

export default SearchChats;

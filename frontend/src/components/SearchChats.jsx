import { Box, useColorModeValue } from "@chakra-ui/react";
import InputField from "./InputField";

const SearchChats = () => {
 
  //   const chatBoxHeaderFooterBG = useColorModeValue("gray.100", "gray.700");
  return (
    <Box
     

      borderRadius="md"
      //   borderBottomRightRadius="xl"
      //   borderBottomColor={chatBoxHeaderFooterBG}
      //   display={{ base: "none", md: "flex" }}
    >
      <InputField
        type="text"
        placeholder="Search for chats"
        isRequired={false}
      />
    </Box>
  );
};

export default SearchChats;

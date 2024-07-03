import { createContext } from "react";
import { useColorModeValue } from "@chakra-ui/react";

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const chatBoxHeaderFooterBG = useColorModeValue("gray.50", "gray.700");
  const typingBadgeBG = useColorModeValue("blue.500", "blue.300");
  const inputBG = useColorModeValue("white", "gray.600");
  return (
    <ThemeContext.Provider
      value={{
        chatBoxHeaderFooterBG,
        typingBadgeBG,
        inputBG,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

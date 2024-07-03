import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";
import theme from "./theme";
import { ColorModeScript } from "@chakra-ui/react";
import ThemeProvider from "./context/ThemeProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider
      toastOptions={{
        defaultOptions: {
          duration: 2000,
          isClosable: true,
          position: "top",
        },
      }}
    >
      <Router>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Router>
    </ChakraProvider>
  </React.StrictMode>
);

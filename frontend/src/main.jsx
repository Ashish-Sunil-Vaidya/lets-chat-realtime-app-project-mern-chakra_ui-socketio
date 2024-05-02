import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
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
        <App />
      </Router>
    </ChakraProvider>
  </React.StrictMode>
);

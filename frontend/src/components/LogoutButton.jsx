import { Button, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useChatContext from "../hooks/useChatContext";

const LogoutButton = () => {
  const {setUser} = useChatContext()
  const navigate = useNavigate();
  const toast = useToast();
  const handleLogout = () => {
    localStorage.removeItem("userDetails");
    setUser(null);
    navigate("/");
    toast({
      title: "Logout successful",
      status: "success",
    });
  };
  return (
    <Button colorScheme="red" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;

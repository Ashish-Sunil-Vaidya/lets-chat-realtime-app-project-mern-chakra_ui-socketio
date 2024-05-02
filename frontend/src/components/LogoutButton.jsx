import { Button, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const handleLogout = () => {
    localStorage.removeItem("userDetails");
    navigate("/auth");
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

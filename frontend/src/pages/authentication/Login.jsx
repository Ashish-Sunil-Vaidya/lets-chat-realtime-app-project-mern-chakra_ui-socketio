import { Flex, Button } from "@chakra-ui/react";
import InputField from "../../components/InputField";
import { useState } from "react";
import useLogin from "../../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import useChatContext from "../../hooks/useChatContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useLogin();
  const navigate = useNavigate();
  const {setUser} = useChatContext();

  const handleLogin = async () => {
    const response = await login(email, password);
    if (response) {
      localStorage.setItem("userDetails", JSON.stringify(response));
      setUser(response);
      navigate("/chats");
    }
  };

  return (
    <Flex direction="column" h="100%" gap={3} justify="center">
      <InputField
        type="text"
        placeholder="exmaple@gmail.com"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        isRequired={true}
      />
      <InputField
        type="password"
        placeholder="********"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        isRequired={true}
      />
      <Button
        colorScheme="blue"
        isLoading={loading}
        loadingText="Logging in..."
        onClick={handleLogin}
      >
        Login
      </Button>
    </Flex>
  );
};

export default Login;

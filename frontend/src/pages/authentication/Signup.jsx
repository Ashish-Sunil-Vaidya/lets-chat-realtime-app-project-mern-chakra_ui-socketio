import {
  Flex,
  Button,
  useToast,
  HStack,
  VStack,
  Avatar,
  Input,
  Text,
  Box,
} from "@chakra-ui/react";
import InputField from "../../components/InputField";
import { useState } from "react";
import useSignup from "../../hooks/useSignup";
import { useNavigate } from "react-router-dom";
import useChatContext from "../../hooks/useChatContext";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [cloudinaryUrl, setCloudinaryUrl] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const { signup, loading } = useSignup();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSignup = async () => {
    const response = await signup(
      username,
      email,
      password,
      confirmPassword,
      cloudinaryUrl
    );
    console.log("=== response Signup.jsx [18] ===", response);
    if (response) {
      localStorage.setItem("userDetails", JSON.stringify(response));
      toast({
        title: `Welcome to LetsChat!, ${response.username}`,
        status: "success",
      });
      navigate("/chats");
    }
  };

  const handleUpload = () => {
    if (["image/jpeg", "image/png","image/webp"].includes(cloudinaryUrl.type)) {
      setUploadLoading(true);
      const data = new FormData();
      data.append("file", cloudinaryUrl);
      data.append("upload_preset", "letschat");
      data.append("cloud_name", "calmperson");
      fetch("https://api.cloudinary.com/v1_1/calmperson/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data.url);
          setCloudinaryUrl(data.url);
          toast({
            title: "Image Uploaded Successfully",
            status: "success",
          });
          setUploadLoading(false);
          setUploaded(true);
        })
        .catch((err) => {
          console.log(err);
          toast({
            title: err.message,
            status: "error",
          });
          setUploadLoading(false);
        });
    } else {
      toast({
        title: "Invalid File Format",
        status: "error",
      });
    }
  };

  return (
    <HStack gap={3}>
      <VStack>
        <Box position="relative" justify="center" h="100%">
          <Input
            type="file"
            position="absolute"
            opacity={0}
            w="100%"
            bgColor="red.100"
            h="100%"
            zIndex={999}
            onChange={(e) => {
              setAvatar(URL.createObjectURL(e.target.files[0]));
              setCloudinaryUrl(e.target.files[0]);
              setUploaded(false);
            }}
          />
          <Avatar
            boxSize="200px"
            name={username}
            src={avatar}
            size="xl"
            bg="blue.500"
          />
        </Box>
        {!avatar ? (
          <Text color="blue.200">
            Click anywhere around Avatar or Drag n Drop
          </Text>
        ) : (
          !uploaded && (
            <>
              <Button
                colorScheme="blue"
                onClick={handleUpload}
                isLoading={uploadLoading}
                loadingText="Uploading"
              >
                Upload
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  setAvatar("");
                  setCloudinaryUrl("");
                  setUploaded(false);
                }}
              >
                Cancel
              </Button>
            </>
          )
        )}
      </VStack>
      <Flex direction="column" h="100%" gap={3} justify="center" minW="300px">
        <InputField
          type="text"
          placeholder="John Doe"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          isRequired={true}
        />

        <InputField
          type="text"
          placeholder="example@gmail.com"
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
        <InputField
          type="password"
          placeholder="********"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          isRequired={true}
        />
        <Button
          colorScheme="blue"
          onClick={handleSignup}
          isLoading={loading}
          loadingText="Signing up..."
        >
          Signup
        </Button>
      </Flex>
    </HStack>
  );
};

export default Signup;

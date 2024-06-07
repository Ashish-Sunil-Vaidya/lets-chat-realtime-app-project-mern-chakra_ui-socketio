import useChatContext from "../../hooks/useChatContext";
import {
  Box,
  Text,
  Flex,
  Heading,
  VStack,
  Input,
  Icon,
  FormControl,
  IconButton,
  HStack,
  useToast,
  Grid,
  Spinner,
  Avatar,
  Badge,
  Tag,
} from "@chakra-ui/react";
import ProfileModal from "../ProfileModal";
import { FaCircleInfo } from "react-icons/fa6";
import { getSenderFull, getSender } from "../../config/ChatLogics";
// import InputField from "../InputField";
import { useState } from "react";
import { BiSolidMessageDetail } from "react-icons/bi";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import { useEffect } from "react";
import MessageBox from "./MessageBox";
import ScrollableFeed from "react-scrollable-feed";
import io from "socket.io-client";
import { useColorModeValue } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;
const SingleChats = () => {
  const { user, selectedChat,setSelectedChat } = useChatContext();
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);
  const chatBoxHeaderFooterBG = useColorModeValue("blue.100", "gray.800");
  const chatBoxHeaderFooterBorder = useColorModeValue("gray.300", "gray.500");
  const typingBadgeBG = useColorModeValue("blue.500", "gray.600");
  const inputBG = useColorModeValue("white", "gray.700");
  const toast = useToast();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    console.log("=== messages SingleChats.jsx [50] ===", messages);
  }, []);

  const typingHandler = (inStream) => {
    setMessageInput(inStream);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTyped = new Date().getTime();
    let typingInterval = 3000;

    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTyped;

      if (timeDiff >= typingInterval && typing) {
        setTyping(false);
        socket.emit("stop typing", selectedChat._id);
      }
    }, typingInterval);
  };

  const sendMessage = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    };
    setLoading(true);
    await axios
      .post(
        "/api/messages",
        {
          messageContent: messageInput,
          chatId: selectedChat?._id,
        },
        config
      )
      .then((result) => {
        setMessageInput("");
        // console.log("=== result SingleChatMessage.jsx [49] ===", result);
        socket.emit("new message", result.data);
        setMessages([...messages, result.data]);
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: err.response.data.message,
          status: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchMessages = async () => {
    setMessageLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    };
    await axios
      .get(`/api/messages/${selectedChat?._id}`, config)
      .then((result) => {
        setMessages(result.data);
        socket.emit("join chat", selectedChat._id);
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: err.response.data.message,
          status: "error",
        });
      })
      .finally(() => {
        setMessageLoading(false);
      });
  };
  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
      selectedChatCompare = selectedChat;
    }
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessage) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessage.chat._id
      ) {
        // send notification
      } else {
        setMessages([...messages, newMessage]);
      }
    });
  });

  return (
    <Flex direction="column" h="100%">
      {selectedChat && (
        <Flex
          justify="space-between"
          align="center"
          pl={3}
          bgColor={chatBoxHeaderFooterBG}
          borderBottomWidth="2px"
        >
          <Flex align="center" gap={3}>
            <IconButton
              display={{ base: "block", md: "none" }}
              variant="ghost"
              icon={<ArrowBackIcon boxSize={8} />}
              onClick={() => setSelectedChat(null)}
            />
            <Avatar src={getSenderFull(user,selectedChat.users)?.profilePic} size="sm" />
            <Heading fontSize="1.3rem" textColor="blue.500" py={4}>
              {selectedChat && getSender(user, selectedChat.users)}
            </Heading>
            {isTyping && user.id !== getSender(user, selectedChat.users) && (
              <Tag
                size="sm"
                height="fit-content"
                bgColor={typingBadgeBG}
                color="white"
              >
                Typing...
              </Tag>
            )}
          </Flex>
          <HStack gap={3}>
            <ProfileModal
              userInfo={selectedChat && getSenderFull(user, selectedChat.users)}
              buttonChildren={<FaCircleInfo size="25px" />}
              style={{
                variant: "ghost",
              }}
            />
          </HStack>
        </Flex>
      )}
      {!selectedChat ? (
        <VStack flex={1} justify="center">
          <Icon as={BiSolidMessageDetail} fontSize="100px" color="blue.300" />
          <Text fontSize="2xl" color="blue.300">
            Select a chat to start messaging
          </Text>
        </VStack>
      ) : messageLoading ? (
        <Grid flex={1} placeItems="center" fontSize="1.3rem">
          <HStack gap={5} color="blue.400">
            <Spinner boxSize="40px" />
            <Text>Fetching Messages</Text>
          </HStack>
        </Grid>
      ) : (
        <ScrollableFeed>
          {messages &&
            messages.map((message, index) => (
              <MessageBox
                key={message._id}
                i={index}
                messages={messages}
                message={message}
                userId={user.id}
                senderId={message.sender._id}
                content={message.content}
                senderUsername={message.sender.username}
                profilePic={message.sender.profilePic}
              />
            ))}
        </ScrollableFeed>
      )}
      {selectedChat && (
        <FormControl
          as={Flex}
          bgColor={chatBoxHeaderFooterBG}
          
          p={3}
          align="center"
          gap={3}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
              socket.emit("stop typing", selectedChat._id);
            }
          }}
        >
          <Input
            type="text"
            placeholder="Enter Message"
            onChange={(e) => typingHandler(e.target.value)}
            value={messageInput}
            bgColor={inputBG}
          />
          <IconButton
            icon={<IoSend />}
            p={2}
            colorScheme="blue"
            onClick={sendMessage}
          />
        </FormControl>
      )}
    </Flex>
  );
};

export default SingleChats;

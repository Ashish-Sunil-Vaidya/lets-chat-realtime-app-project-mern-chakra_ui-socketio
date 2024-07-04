import useChatContext from "../../hooks/useChatContext";
import {
  Box,
  Text,
  Flex,
  Heading,
  VStack,
  Tag,
  Icon,
  IconButton,
  HStack,
  useToast,
  FormControl,
  Input,
  Avatar,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "../ProfileModal";
import { FaCircleInfo } from "react-icons/fa6";
import { getSenderFull, getSender } from "../../config/ChatLogics";
import InputField from "../InputField";
import { useState } from "react";
import { BiSolidMessageDetail } from "react-icons/bi";
import { IoSend } from "react-icons/io5";
import UpdateGroupDrawer from "../UpdateGroupDrawer";
import ScrollableFeed from "react-scrollable-feed";
import useColorTheme from "../../hooks/useColorTheme";
import { useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import MessageBox from "./MessageBox";

const ENDPOINT = "https://lets-chat-a-minimalist-real-time-chat-app.onrender.com/";

let socket;
let selectedChatCompare;

const GroupChats = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typerName, setTyperName] = useState(null);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const toast = useToast();
  const { chatBoxHeaderFooterBG, inputBG, typingBadgeBG } = useColorTheme();

  const {
    selectedChat,
    setSelectedChat,
    user,
    fetchAgain,
    setFetchAgain,
    notifications,
    setNotifications,
  } = useChatContext();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/messages/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
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

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", (name) => {
      if (name) setTyperName(name);
      setIsTyping(true);
    });
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessage) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessage.chat._id
      ) {
        if (!notifications.includes(newMessage)) {
          setNotifications([newMessage, ...notifications]);
        }
      } else {
        setMessages([...messages, newMessage]);
      }
    });
  });

  const typingHandler = (data) => {
    setMessageInput(data);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", {
        selectedChat: selectedChat._id,
        typerName: user.username,
      });
    }

    let lastTyped = new Date().getTime();
    let typingInterval = 3000;

    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTyped;

      if (timeDiff >= typingInterval && typing) {
        setTyping(false);
        socket.emit("stop typing", selectedChat._id);
        setTyperName(null);
      }
    }, typingInterval);
  };

  return (
    <Flex direction="column" h="100%">
      {selectedChat && (
        <Flex
          justify="space-between"
          pl={3}
          bgColor={chatBoxHeaderFooterBG}
          borderBottomWidth="1px"
        >
          <Flex align="center" gap={3}>
            <IconButton
              display={{ base: "block", md: "none" }}
              variant="ghost"
              icon={<ArrowBackIcon boxSize={8} />}
              onClick={() => {
                setFetchAgain(!fetchAgain);
                setSelectedChat(null);
              }}
            />
            <Avatar src={selectedChat?.groupChatProfilePic} size="sm" />
            <Heading fontSize="1.3rem" textColor="blue.500" py={4}>
              {selectedChat && selectedChat.chatName}
            </Heading>
            {isTyping &&
              typerName &&
              typerName !== user.username &&
              user.id !== getSender(user, selectedChat.users) && (
                <Tag
                  size="sm"
                  height="fit-content"
                  bgColor={typingBadgeBG}
                  color="white"
                >
                  {typerName} is typing...
                </Tag>
              )}
          </Flex>
          <HStack gap={3}>
            {/* {
            console.log(
              "=== selectedChat,user SingleChatMessage.jsx [38] ===",
              selectedChat,
              user
            )} */}
            {selectedChat.groupAdmin._id === user?.id && (
              <UpdateGroupDrawer
                groupChatName={selectedChat.chatName}
                groupChatProfilePic={selectedChat.groupChatProfilePic}
                groupMembers={selectedChat.users}
                groupAdmin={selectedChat.groupAdmin._id}
              />
            )}

            <ProfileModal
              userInfo={
                selectedChat && getSenderFull(user, selectedChat?.users)
              }
              buttonChildren={<FaCircleInfo size="25px" />}
              style={{
                variant: "ghost",
              }}
              isGroupChat={selectedChat && selectedChat?.isGroupChat}
              groupChatName={selectedChat && selectedChat?.chatName}
              groupMembers={selectedChat && selectedChat?.users}
              groupAdmin={selectedChat && selectedChat?.groupAdmin?._id}
              groupChatProfilePic={
                selectedChat && selectedChat?.groupChatProfilePic
              }
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
      ) : (
        <ScrollableFeed>
          {console.log("=== messages GroupChats.jsx [260] ===", messages)}
          {messages&&
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
                isGroupChat={true}
              />
            ))}
        </ScrollableFeed>
      )}
      {selectedChat && (
        <FormControl
          as={Flex}
          bgColor={chatBoxHeaderFooterBG}
          borderTopWidth="1px"
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

export default GroupChats;

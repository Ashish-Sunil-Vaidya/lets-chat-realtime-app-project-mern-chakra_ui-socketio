import {
  Box,
  Grid,
  Flex,
  Avatar,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Heading,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import useChatContext from "../hooks/useChatContext";
import AddUsersDrawer from "../components/AddUsersDrawer";
import ProfileModal from "../components/ProfileModal";
import UserChats from "../components/UserChats";
import LogoutButton from "../components/LogoutButton";
import CreateGroupDrawer from "../components/CreateGroupDrawer";
import ChatBox from "../components/message/ChatBox";
import { useColorModeValue } from "@chakra-ui/react";
import SearchChats from "../components/SearchChats";
import NotificationButton from "../components/NotificationButton";
const ChatPage = () => {
  const { user, selectedChat } = useChatContext();

  const appHeaderBG = useColorModeValue("gray.100", "gray.700");
  const headingColor = useColorModeValue("blue.500", "blue.100");
  const headerBorder = useColorModeValue("gray.200", "gray.600");

  return (
    <Grid
      w="100%"
      h="100svh"
      justify="flex-end"
      align="flex-end"
      templateRows={{
        base: selectedChat ? "1fr" : "60px 1fr",
        md: "60px 1fr",
      }}
    >
      <Flex
        flex={1}
        w="100%"
        p={3}
        gap={6}
        align="center"
        justify="space-between"
        bgColor={appHeaderBG}
        borderBottom="1px solid"
        borderBottomColor={headerBorder}
        display={{
          base: selectedChat ? "none" : "flex",
          md: "flex",
        }}
      >
        <Flex gap={3}>
          <Heading size="md" color={headingColor}>
            Let's Chat!
          </Heading>
        </Flex>

        <Flex align="center" gap={3} flex={1} justifyContent="flex-end">
          <Box
            flex={{
              base: 1,
              md: "none",
            }}
            display={{
              base: "block",
              md: "none",
            }}
            bgColor={useColorModeValue("gray.50", "gray.800")}
            rounded="md"
          >
            <SearchChats />
          </Box>
          {/* <NotificationButton /> */}
          <Menu>
            <MenuButton as={Button} variant="ghost" colorScheme="blue" px={2}>
              <Flex align="center" gap={2}>
                <Avatar
                  name={user?.username}
                  src={user?.profilePic}
                  size="sm"
                  boxShadow="outline"
                />
              </Flex>
            </MenuButton>
            <MenuList p={2} display="grid" gap={2}>
              <ProfileModal userInfo={user} />
              <LogoutButton />
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      <Grid
        w="100%"
        overflow="hidden"
        templateColumns={{
          base: !selectedChat ? "1fr 0px" : "0px 1fr",
          md: "minmax(250px,auto) 1fr",
          xl: "minmax(350px,auto) 1fr",
        }}
        bgColor={useColorModeValue("gray.50", "gray.700")}
      >
        <UserChats />
        <ChatBox />
      </Grid>
    </Grid>
  );
};

export default ChatPage;

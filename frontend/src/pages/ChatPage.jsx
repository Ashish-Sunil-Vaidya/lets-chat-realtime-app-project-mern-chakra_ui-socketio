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
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import useChatContext from "../hooks/useChatContext";
import FindUsersDrawer from "../components/FindUsersDrawer";
import ProfileModal from "../components/ProfileModal";
import UserChats from "../components/UserChats";
import LogoutButton from "../components/LogoutButton";
import CreateGroupDrawer from "../components/CreateGroupDrawer";
import MessageBox from "../components/message/MessageBox";
import { useState } from "react";

const ChatPage = () => {
  const { user } = useChatContext();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <Flex
      w="100%"
      h="100svh"
      justify="flex-end"
      align="flex-end"
      direction="column"
    >
      <Flex flex={1} w="100%" p={3} align="center" justify="space-between">
        <Flex gap={3}>
          <FindUsersDrawer setFetchAgain={setFetchAgain}/>
          <CreateGroupDrawer setFetchAgain={setFetchAgain}/>
        </Flex>
        <Flex px={3}>
          <Flex align="center" gap={3}>
            <Menu>
              <MenuButton as={Button} variant="ghost" colorScheme="blue" px={2}>
                <Flex align="center" gap={2}>
                  <Avatar name={user?.username} src={user?.profilePic}  />
                  <ChevronDownIcon />
                </Flex>
              </MenuButton>
              <MenuList p={2} display="grid" gap={2}>
                <ProfileModal 
                  userInfo={user}
                />
                <LogoutButton />
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Flex>
      <Grid
        w="100%"
        h="calc(100svh - 50px)"
        overflow="hidden"
        templateColumns="minmax(350px,auto) 1fr"
      >
        <UserChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        <MessageBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Grid>
    </Flex>
  );
};

export default ChatPage;

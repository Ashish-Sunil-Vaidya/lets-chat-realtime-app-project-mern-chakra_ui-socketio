import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  IconButton,
  HStack,
  Avatar,
  VStack,
  Text,
  Box,
} from "@chakra-ui/react";

import { useState } from "react";
import { FaBell } from "react-icons/fa";
import useChatContext from "../hooks/useChatContext";
import NotificationBadge from "react-notification-badge";

const NotificationButton = () => {
  const { notifications } = useChatContext();
  return (
    <Menu>
      <MenuButton as={Box} color="blue.500" position={"relative"}>
        <IconButton
          icon={<FaBell />}
          variant="ghost"
          fontSize="20px"
          colorScheme="blue"
        />
        {notifications && (
          <Box position="absolute" top={0} right={-1}>
            <NotificationBadge count={notifications.length} />
          </Box>
        )}
      </MenuButton>
      <MenuList>
        {console.log("===  NotificationButton.jsx [21] ===", notifications)}
        {notifications          ? notifications.map((notification) => (
              <MenuItem key={notification._id}>
                {notification.chat.isGroupChat ? (
                  <HStack>
                    <Avatar src={notification.sender.profilePic} size="sm" />
                    <VStack>
                      <Text>{notification.chat.chatName}</Text>
                      <HStack gap={1}>
                        <Text fontWeight="bold">
                          {notification.sender.username}:
                        </Text>
                        <Text>{notification.content}</Text>
                      </HStack>
                    </VStack>
                  </HStack>
                ) : (
                  <HStack>
                    <Avatar
                      alignSelf="flex-start"
                      src={notification.sender.profilePic}
                      size="sm"
                    />

                    <Text fontWeight="bold">
                      {notification.sender.username}:
                    </Text>
                    <Text>{notification.content}</Text>
                  </HStack>
                )}
              </MenuItem>
            ))
          : "No new notifications"}
      </MenuList>
    </Menu>
  );
};

export default NotificationButton;

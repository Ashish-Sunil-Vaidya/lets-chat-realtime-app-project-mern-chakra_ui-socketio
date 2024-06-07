import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  IconButton,
  HStack,
} from "@chakra-ui/react";

import { FaBell } from "react-icons/fa";

const NotificationButton = () => {
  return (
    <Menu>
      <MenuButton as={IconButton} color="blue.500" icon={<FaBell size="20px"/>}></MenuButton>
      <MenuList>
        <MenuItem>Notification 1</MenuItem>
        <MenuItem>Notification 2</MenuItem>
        <MenuItem>Notification 3</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default NotificationButton;

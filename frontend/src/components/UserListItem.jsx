import { Box, Flex, Avatar, Text, Button } from "@chakra-ui/react";

const UserListItem = ({ username, email, avatarUrl, onClick }) => {
  return (
    <Flex
      as={Button}
      py={8}
      gap={2}
      width="100%"
      overflow="hidden"
      justify="flex-start"
      variant="ghost"
      onClick={onClick}
    >
      <Avatar name={username} src={avatarUrl}  />

      <Box>
        <Text textAlign="left">{username}</Text>
        <Flex fontSize=".8rem">
          <Text mr={1} fontWeight="bold">
            Email:
          </Text>
          <Text>{email}</Text>
        </Flex>
      </Box>
    </Flex>
  );
};

export default UserListItem;

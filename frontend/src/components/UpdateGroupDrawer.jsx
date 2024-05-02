import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerBody,
  DrawerCloseButton,
  Button,
  useDisclosure,
  Flex,
  Avatar,
  Heading,
  Text,
  Box,
  Grid,
  useToast,
  VStack,
  IconButton,
  Skeleton,
  Badge,
  Tag,
  TagCloseButton,
} from "@chakra-ui/react";
import useChatContext from "../hooks/useChatContext";
import { MdGroupAdd } from "react-icons/md";
import { useState } from "react";
import InputField from "./InputField";
import axios from "axios";
import { AddIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";

const UpdateGroupDrawer = ({ groupChatName, groupMembers, groupAdmin }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, setChats } = useChatContext();
  const [groupChatNameInput, setGroupChatName] = useState(groupChatName || "");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();

  const handleSearch = async () => {
    if (toast.isActive("search-toast")) {
      toast.close("search-toast");
    }
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user/?search=${search}`, config);
      setSearchResults(data);
    } catch (error) {
      console.error(error);
      toast({
        id: "search-toast",
        title: error.response.data.message,
        status: "error",
      });
    }
    setLoading(false);
  };

  return (
    <>
      <IconButton
        as={EditIcon}
        p={2}
        variant="ghost"
        colorScheme="blue"
        onClick={onOpen}
      />
      <Drawer isOpen={isOpen} onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit {}</DrawerHeader>
          <DrawerBody overflowY="auto">
            <Grid h="110svh" spacing={1} templateRows="auto 1fr">
              <VStack>
                <InputField
                  label="Group Chat Name"
                  type="text"
                  placeholder="Group Chat Name"
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
                <Flex w="100%" align="flex-end" gap={3}>
                  <InputField
                    label="Search"
                    type="text"
                    placeholder="Search for users"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                  />

                  <Button
                    colorScheme="blue"
                    isLoading={isLoading}
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </Flex>
                <Box w="100%">
                  <Text fontSize="1rem" fontWeight="bold">
                    Group Members
                  </Text>
                  <Flex gap={3} flexWrap="wrap" justify="center" p={3}>
                    {groupMembers &&
                      groupMembers.map((mem) => (
                        <Tag
                          key={mem._id}
                          colorScheme="blue"
                          variant="solid"
                          p={2}
                          rounded="999px"
                        >
                          {mem.username}
                          <TagCloseButton />
                        </Tag>
                      ))}
                  </Flex>
                </Box>
              </VStack>

              <VStack w="100%" h="100%" overflowY="auto" p={3} gap={3} border="2px" rounded="lg" borderColor="blue.100">
                {!isLoading &&
                  searchResults.map((user) => (
                    <Flex
                      key={user._id}
                      p={3}
                      justify="space-between"
                      align="center"
                      w="100%"
                      rounded="md"
                      sx={{
                        bg: selectedUsers.includes(user) ? "blue.50" : "white",
                      }}
                    >
                      <Flex align="center" gap={3}>
                        <Avatar
                          name={user.username}
                          src={user.avatar}
                          size="sm"
                        />
                        <Text>{user.username}</Text>
                      </Flex>
                      {!selectedUsers.includes(user) ? (
                        <Button
                          colorScheme="blue"
                          size="sm"
                          onClick={() =>
                            setSelectedUsers([...selectedUsers, user])
                          }
                          variant="ghost"
                        >
                          <AddIcon />
                        </Button>
                      ) : (
                        <Button
                          colorScheme="red"
                          size="sm"
                          onClick={() =>
                            setSelectedUsers(
                              selectedUsers.filter((u) => u !== user)
                            )
                          }
                          variant="ghost"
                        >
                          <CloseIcon />
                        </Button>
                      )}
                    </Flex>
                  ))}
                {isLoading && (
                  <Grid gap={3} h="100%" w="100%">
                    {[...Array(8)].map((_, i) => (
                      <Skeleton key={i} rounded="md" />
                    ))}
                  </Grid>
                )}
              </VStack>
            </Grid>
          </DrawerBody>

          <DrawerFooter as={Flex} gap={3}>
            <Button colorScheme="blue">Edit Group Details</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default UpdateGroupDrawer;

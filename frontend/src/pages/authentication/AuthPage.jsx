import {
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Tabs,
  Grid,
} from "@chakra-ui/react";

import { useColorModeValue } from "@chakra-ui/react";

import Login from "./Login";
import Signup from "./Signup";

const AuthPage = () => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  return (
    <Grid placeItems="center" h="100svh" w="100%">
      <Tabs
        display="flex"
        flexDirection="column"
        isFitted
        variant="soft-rounded"
        minW="400px"
        bgColor={bgColor}
        p={3}
        rounded="xl"
      >
        <TabList>
          <Tab>Login</Tab>
          <Tab>Signup</Tab>
        </TabList>
        <TabPanels flex={1}>
          <TabPanel h="100%">
            <Login />
          </TabPanel>
          <TabPanel h="100%">
            <Signup />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Grid>
  );
};

export default AuthPage;

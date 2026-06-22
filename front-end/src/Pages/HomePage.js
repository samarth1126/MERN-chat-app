import React, { useEffect } from 'react'
import {Container, Box, Text} from "@chakra-ui/react";
import { Tabs } from "@chakra-ui/react";
// import { useState } from "react";
import Login from '../components/Authentication/Login';
import SignUp from '../components/Authentication/SignUp';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const HomePage = () => {
  // const [value, setValue] = useState("first");

  const history=useHistory();
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("userInfo"));

    if(user)history.push("/chats");
  },[history]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        p={5}
        bg="rgba(20, 20, 30, 0.85)"
        w="100%"
        mt={10}
        mb={4}
        borderRadius="20px"
        border="1px solid rgba(255,255,255,0.1)"
        // backdropFilter="blur(15px)"
        boxShadow="0 8px 32px rgba(0, 212, 255, 0.25)"
      >
        <Text
          fontFamily="Work Sans"
          fontSize="4xl"
          fontWeight="bold"
          bgGradient="linear(to-r, cyan.400, blue.500)"
          bgClip="text"
          letterSpacing="2px"
          color={"grey"}
        >
          BOLO
        </Text>
      </Box>
      <Box
        bg="rgba(20,20,30,0.85)"
        w="100%"
        p={6}
        borderRadius="20px"
        border="1px solid rgba(255,255,255,0.1)"
        // backdropFilter="blur(15px)"
        boxShadow="0 8px 32px rgba(0,0,0,0.4)"
      >
        <Tabs.Root
          defaultValue="members"
          variant="plain"
          css={{
            "--tabs-indicator-bg": "colors.gray.subtle",
            "--tabs-indicator-shadow": "shadows.xs",
            "--tabs-trigger-radius": "radii.full",
          }}
        >
          <Tabs.List>
            <Tabs.Trigger value="members" width={"50%"}>Login</Tabs.Trigger>
            <Tabs.Trigger value="projects" width={"50%"}>SignUp</Tabs.Trigger>
            
            <Tabs.Indicator />
          </Tabs.List>
          <Tabs.Content value="members"><Login/></Tabs.Content>
          <Tabs.Content value="projects"><SignUp/></Tabs.Content>
          
        </Tabs.Root>
      </Box>
    </Container>
  );
}

export default HomePage

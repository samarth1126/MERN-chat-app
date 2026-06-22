// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";



const ChatPage = () => {
//const [chats, setChats]=useState([])

    // const fetchChats = async () => {
    //     const {data} = await axios.get('/api/chat');
    //     setChats(data)
    // };

    // useEffect(()=>{
    //     fetchChats();
    // }, [])

  const {user}=ChatState();




  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer/>}
      <Box
        display="flex"
        justifyContent={"space-between"}
        w="100%"
        h="91.5vh"
      >
        {user && <MyChats/>}
        {user && <ChatBox/>}
      </Box>
    </div>
  );
}

export default ChatPage

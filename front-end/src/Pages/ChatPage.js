import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";

const ChatPage = () => {
  const { user } = ChatState();

  return (
    <Box
      w="100%"
      minH="100vh"
      sx={{
        background:
          "linear-gradient(135deg, #0a0a0f 0%, #0f0f16 50%, #0a0a0f 100%)",
        position: "relative",
        overflow: "hidden",

        // Ambient background glows
        "&::before": {
          content: '""',
          position: "fixed",
          top: "-20%",
          left: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        },
        "&::after": {
          content: '""',
          position: "fixed",
          bottom: "-20%",
          right: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(109,40,217,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        },
      }}
    >
      {/* SideDrawer sits above the glow blobs */}
      {user && <SideDrawer />}

      {/* Main chat layout */}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p={{ base: 2, md: 3 }}
        gap={3}
        position="relative"
        zIndex={1}
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </Box>
  );
};

export default ChatPage;

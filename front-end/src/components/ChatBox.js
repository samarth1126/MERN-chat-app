import { Box } from "@chakra-ui/react";
import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      w={{ base: "100%", md: "68%" }}
      borderRadius="xl"
      position="relative"
      overflow="hidden"
      sx={{
        // Base dark surface
        background: "linear-gradient(145deg, #0f0f13 0%, #13131a 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: `
          0 0 0 1px rgba(255,255,255,0.04) inset,
          0 24px 64px rgba(0,0,0,0.6)
        `,

        // Subtle top-edge glow
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: "10%",
          right: "10%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)",
          zIndex: 1,
        },

        // Ambient background glow blob
        "&::after": {
          content: '""',
          position: "absolute",
          top: "-80px",
          right: "-60px",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        },

        // Slide-in animation when a chat is selected
        animation: selectedChat ? "slideInChat 0.25s ease-out" : "none",

        "@keyframes slideInChat": {
          from: {
            opacity: 0,
            transform: "translateX(12px)",
          },
          to: {
            opacity: 1,
            transform: "translateX(0)",
          },
        },

        // Scrollbar styling
        "& *::-webkit-scrollbar": {
          width: "4px",
        },
        "& *::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "& *::-webkit-scrollbar-thumb": {
          background: "rgba(139,92,246,0.3)",
          borderRadius: "999px",
        },
        "& *::-webkit-scrollbar-thumb:hover": {
          background: "rgba(139,92,246,0.5)",
        },
      }}
    >
      {/* Content sits above the pseudo-element layers */}
      <Box
        position="relative"
        zIndex={1}
        w="100%"
        h="100%"
        display="flex"
        flexDir="column"
      >
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Box>
    </Box>
  );
};

export default Chatbox;

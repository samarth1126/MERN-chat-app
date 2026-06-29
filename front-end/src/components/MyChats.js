import { Box, Stack, Text, Button } from "@chakra-ui/react";
// import { useToast } from "@chakra-ui/react";
import { toaster } from "../toaster";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { ChatState } from "../Context/ChatProvider";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  // const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      w={{ base: "100%", md: "31%" }}
      borderRadius="xl"
      position="relative"
      overflow="hidden"
      sx={{
        background: "linear-gradient(145deg, #0f0f13 0%, #13131a 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: `
          0 0 0 1px rgba(255,255,255,0.04) inset,
          0 24px 64px rgba(0,0,0,0.6)
        `,

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

        "&::after": {
          content: '""',
          position: "absolute",
          bottom: "-80px",
          left: "-60px",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        },
      }}
    >
      {/* Header */}
      <Box
        position="relative"
        zIndex={1}
        pb={3}
        px={3}
        pt={1}
        w="100%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Text
          fontSize={{ base: "22px", md: "20px", lg: "22px" }}
          fontFamily="'Work Sans', sans-serif"
          fontWeight="600"
          sx={{
            background: "linear-gradient(135deg, #ffffff 0%, #a78bfa 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          My Chats
        </Text>

        <GroupChatModal>
          <Button
            size="sm"
            fontSize={{ base: "13px", md: "11px", lg: "13px" }}
            sx={{
              background: "rgba(139,92,246,0.15)",
              border: "1px solid rgba(139,92,246,0.3)",
              color: "#a78bfa",
              borderRadius: "lg",
              px: 3,
              py: 1,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s ease",
              _hover: {
                background: "rgba(139,92,246,0.25)",
                border: "1px solid rgba(139,92,246,0.5)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(139,92,246,0.2)",
              },
              _active: {
                transform: "translateY(0px)",
              },
            }}
          >
            {/* Plus icon — no @chakra-ui/icons needed */}
            <Box
              as="span"
              fontSize="16px"
              lineHeight={1}
              fontWeight="300"
              mt="-1px"
            >
              +
            </Box>
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      {/* Chat list */}
      <Box
        position="relative"
        zIndex={1}
        display="flex"
        flexDir="column"
        p={3}
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack
            overflowY="scroll"
            gap={1}
            sx={{
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-track": { background: "transparent" },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(139,92,246,0.3)",
                borderRadius: "999px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "rgba(139,92,246,0.5)",
              },
            }}
          >
            {chats.map((chat) => {
              const isSelected = selectedChat === chat;
              return (
                <Box
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  px={3}
                  py={2}
                  borderRadius="lg"
                  sx={{
                    background: isSelected
                      ? "linear-gradient(135deg, rgba(139,92,246,0.25), rgba(109,40,217,0.15))"
                      : "rgba(255,255,255,0.03)",
                    border: isSelected
                      ? "1px solid rgba(139,92,246,0.4)"
                      : "1px solid rgba(255,255,255,0.05)",
                    transition: "all 0.18s ease",
                    position: "relative",
                    overflow: "hidden",

                    // Left accent bar for selected
                    "&::before": isSelected
                      ? {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: "20%",
                          bottom: "20%",
                          width: "3px",
                          borderRadius: "0 3px 3px 0",
                          background:
                            "linear-gradient(180deg, #a78bfa, #7c3aed)",
                        }
                      : {},

                    _hover: !isSelected
                      ? {
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.09)",
                          transform: "translateX(2px)",
                        }
                      : {},
                  }}
                >
                  <Text
                    fontWeight="500"
                    fontSize="sm"
                    color={isSelected ? "#e9d5ff" : "rgba(255,255,255,0.85)"}
                  >
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>

                  {chat.latestMessage && (
                    <Text
                      fontSize="xs"
                      mt="2px"
                      color={
                        isSelected
                          ? "rgba(196,181,253,0.7)"
                          : "rgba(255,255,255,0.35)"
                      }
                      noOfLines={1}
                    >
                      <Box
                        as="span"
                        fontWeight="600"
                        color={isSelected ? "#c4b5fd" : "rgba(255,255,255,0.5)"}
                      >
                        {chat.latestMessage.sender.name}:{" "}
                      </Box>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </Text>
                  )}
                </Box>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;

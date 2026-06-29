import { Box, Text } from "@chakra-ui/react";
// import { FormControl } from "@chakra-ui/react";
import { Field } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { IconButton, Spinner} from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "lottie-react"
import { toaster } from "../toaster";
import animationData from "../animations/typing.json";
import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
//   const toast = useToast();




  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config,
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          { content: newMessage, chatId: selectedChat },
          config,
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toaster.create({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          {/* ── Header ── */}
          <Box
            w="100%"
            px={3}
            py={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
              backdropFilter: "blur(8px)",
              animation: "fadeSlideDown 0.2s ease-out",
              "@keyframes fadeSlideDown": {
                from: { opacity: 0, transform: "translateY(-6px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            {/* Back button — mobile only */}
            <IconButton
              display={{ base: "flex", md: "none" }}
              aria-label="Go back"
              onClick={() => setSelectedChat("")}
              size="sm"
              sx={{
                background: "rgba(139,92,246,0.12)",
                border: "1px solid rgba(139,92,246,0.25)",
                color: "#a78bfa",
                borderRadius: "lg",
                _hover: {
                  background: "rgba(139,92,246,0.22)",
                  transform: "translateX(-2px)",
                },
                transition: "all 0.18s ease",
              }}
              icon={
                // Plain SVG arrow — no @chakra-ui/icons needed
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              }
            />

            {/* Chat name */}
            {messages &&
              (!selectedChat.isGroupChat ? (
                <Box display="flex" alignItems="center" gap={2} flex={1} px={2}>
                  <Text
                    fontWeight="600"
                    fontSize={{ base: "16px", md: "18px" }}
                    fontFamily="'Work Sans', sans-serif"
                    sx={{
                      background: "linear-gradient(135deg, #ffffff, #a78bfa)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {getSender(user, selectedChat.users)}
                  </Text>
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </Box>
              ) : (
                <Box display="flex" alignItems="center" gap={2} flex={1} px={2}>
                  <Text
                    fontWeight="600"
                    fontSize={{ base: "16px", md: "18px" }}
                    fontFamily="'Work Sans', sans-serif"
                    letterSpacing="0.05em"
                    sx={{
                      background: "linear-gradient(135deg, #ffffff, #a78bfa)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {selectedChat.chatName.toUpperCase()}
                  </Text>
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </Box>
              ))}
          </Box>

          {/* ── Messages area ── */}
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
            position="relative"
            sx={{
              background: `
                radial-gradient(ellipse at 80% 10%, rgba(139,92,246,0.05) 0%, transparent 50%),
                radial-gradient(ellipse at 10% 90%, rgba(109,40,217,0.04) 0%, transparent 50%)
              `,
            }}
          >
            {loading ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                h="100%"
                flexDir="column"
                gap={4}
              >
                <Spinner
                  size="xl"
                  w={12}
                  h={12}
                  sx={{
                    borderColor: "rgba(139,92,246,0.2)",
                    borderTopColor: "#a78bfa",
                  }}
                />
                <Text fontSize="sm" color="rgba(255,255,255,0.3)">
                  Loading messages...
                </Text>
              </Box>
            ) : (
              <Box
                className="messages"
                h="100%"
                overflowY="auto"
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
                <ScrollableChat messages={messages} />
              </Box>
            )}

            {/* ── Typing indicator ── */}
            {istyping && (
              <Box
                px={2}
                py={1}
                sx={{
                  animation: "fadeIn 0.2s ease-out",
                  "@keyframes fadeIn": {
                    from: { opacity: 0, transform: "translateY(4px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                <Lottie
                  animationData={animationData}
                  loop={true}
                  autoplay={true}
                  style={{ width: 60, margin: 0 }}
                />
              </Box>
            )}

            {/* ── Input bar ── */}
            <Field.Root onKeyDown={sendMessage} isRequired mt={2}>
              <Box
                display="flex"
                alignItems="center"
                gap={2}
                sx={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "xl",
                  px: 3,
                  py: "6px",
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  "&:focus-within": {
                    borderColor: "rgba(139,92,246,0.45)",
                    boxShadow: "0 0 0 3px rgba(139,92,246,0.1)",
                  },
                }}
              >
                <Input
                  variant="unstyled"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={typingHandler}
                  sx={{
                    color: "rgba(255,255,255,0.88)",
                    fontSize: "14px",
                    "::placeholder": {
                      color: "rgba(255,255,255,0.25)",
                    },
                  }}
                />

                {/* Send hint */}
                <Text
                  fontSize="11px"
                  color="rgba(255,255,255,0.18)"
                  whiteSpace="nowrap"
                  userSelect="none"
                >
                  ↵ send
                </Text>
              </Box>
            </Field.Root>
          </Box>
        </>
      ) : (
        /* ── Empty state ── */
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
          flexDir="column"
          gap={3}
          sx={{
            animation: "fadeIn 0.3s ease-out",
            "@keyframes fadeIn": {
              from: { opacity: 0 },
              to: { opacity: 1 },
            },
          }}
        >
          {/* Decorative icon */}
          <Box
            sx={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "rgba(139,92,246,0.1)",
              border: "1px solid rgba(139,92,246,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "pulse 3s ease-in-out infinite",
              "@keyframes pulse": {
                "0%, 100%": { boxShadow: "0 0 0 0 rgba(139,92,246,0.15)" },
                "50%": { boxShadow: "0 0 0 12px rgba(139,92,246,0)" },
              },
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#a78bfa"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </Box>

          <Text
            fontSize={{ base: "18px", md: "20px" }}
            fontFamily="'Work Sans', sans-serif"
            fontWeight="500"
            color="rgba(255,255,255,0.5)"
            textAlign="center"
          >
            Pick a conversation
          </Text>
          <Text
            fontSize="13px"
            color="rgba(255,255,255,0.22)"
            textAlign="center"
          >
            Select a chat from the left to start messaging
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;

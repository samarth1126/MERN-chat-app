import {
  Button,
  useDisclosure,
  Input,
  Box,
  Text,
  Menu,
  Drawer,
  Avatar,
  Spinner,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import ProfileModal from "./ProfileModal";
import { getSender } from "../../config/ChatLogics";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../Context/ChatProvider";
import { toaster } from "../../toaster";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();
  const { open, onOpen, onClose } = useDisclosure();
  const history = useHistory();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toaster.create({
        title: "Please enter something to search",
        type: "warning",
        duration: 5000,
      });
      return;
    }
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toaster.create({
        title: "Error Occurred!",
        description: "Failed to load search results",
        type: "error",
        duration: 5000,
      });
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toaster.create({
        title: "Error fetching the chat",
        description: error.message,
        type: "error",
        duration: 5000,
      });
      setLoadingChat(false);
    }
  };

  const inputStyles = {
    background: "rgba(255,255,255,0.10)",
    border: "1.5px solid rgba(255,255,255,0.20)",
    borderRadius: "xl",
    color: "#f0eeff",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    _placeholder: { color: "rgba(210,200,255,0.38)" },
    _hover: {
      border: "1.5px solid rgba(167,139,250,0.55)",
      background: "rgba(255,255,255,0.13)",
    },
    _focus: {
      border: "1.5px solid rgba(167,139,250,0.85)",
      boxShadow: "0 0 0 3px rgba(139,92,246,0.18)",
      background: "rgba(255,255,255,0.14)",
    },
  };

  const menuContentStyles = {
    background: "#1a1235",
    border: "1px solid rgba(139,92,246,0.25)",
    borderRadius: "xl",
    boxShadow: "0 16px 48px rgba(0,0,0,0.7)",
    p: 1,
    minW: "200px",
  };

  const menuItemStyles = {
    background: "transparent",
    borderRadius: "lg",
    fontSize: "13px",
    color: "rgba(220,210,255,0.75)",
    px: 3,
    py: 2,
    fontWeight: "500",
    transition: "all 0.15s ease",
    _hover: { background: "rgba(139,92,246,0.15)", color: "#f0eeff" },
  };

  return (
    <>
      {/* ── Navbar ── */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        px={4}
        py="10px"
        position="relative"
        sx={{
          background: "#16102e",
          borderBottom: "1px solid rgba(139,92,246,0.20)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: "20%",
            right: "20%",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)",
          },
        }}
      >
        {/* Search button */}
        <Button
          variant="ghost"
          onClick={onOpen}
          display="flex"
          alignItems="center"
          gap={2}
          sx={{
            background: "rgba(255,255,255,0.07)",
            border: "1.5px solid rgba(255,255,255,0.15)",
            borderRadius: "xl",
            color: "rgba(220,210,255,0.65)",
            fontSize: "13px",
            fontWeight: "600",
            px: 3,
            transition: "all 0.18s ease",
            _hover: {
              background: "rgba(255,255,255,0.12)",
              border: "1.5px solid rgba(139,92,246,0.45)",
              color: "#f0eeff",
            },
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <Text display={{ base: "none", md: "flex" }}>Search user</Text>
        </Button>

        {/* Brand */}
        <Text
          fontSize="xl"
          fontFamily="'Work Sans', sans-serif"
          fontWeight="700"
          letterSpacing="0.1em"
          color="#f0eeff"
        >
          BOLO
        </Text>

        {/* Right controls */}
        <Box display="flex" alignItems="center" gap={2}>
          {/* Notification bell */}
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button
                sx={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1.5px solid rgba(255,255,255,0.15)",
                  borderRadius: "xl",
                  color: "rgba(220,210,255,0.65)",
                  minW: "auto",
                  px: 2,
                  _hover: {
                    background: "rgba(255,255,255,0.12)",
                    border: "1.5px solid rgba(139,92,246,0.45)",
                    color: "#c4b5fd",
                  },
                }}
              >
                <Box position="relative" display="inline-flex">
                  {notification.length > 0 && (
                    <Box
                      position="absolute"
                      top="-6px"
                      right="-6px"
                      minW="16px"
                      h="16px"
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      px="3px"
                      sx={{
                        background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
                        fontSize: "10px",
                        fontWeight: "700",
                        color: "#fff",
                        lineHeight: 1,
                        zIndex: 1,
                      }}
                    >
                      {notification.length}
                    </Box>
                  )}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </Box>
              </Button>
            </Menu.Trigger>
            <Menu.Positioner>
              <Menu.Content sx={menuContentStyles}>
                {!notification.length ? (
                  <Box px={3} py={2}>
                    <Text
                      fontSize="13px"
                      color="rgba(196,181,253,0.5)"
                      fontWeight="500"
                    >
                      No new messages
                    </Text>
                  </Box>
                ) : (
                  notification.map((notif) => (
                    <Menu.Item
                      key={notif._id}
                      value={notif._id}
                      onClick={() => {
                        setSelectedChat(notif.chat);
                        setNotification(
                          notification.filter((n) => n !== notif),
                        );
                      }}
                      sx={menuItemStyles}
                    >
                      {notif.chat.isGroupChat
                        ? `New message in ${notif.chat.chatName}`
                        : `New message from ${getSender(user, notif.chat.users)}`}
                    </Menu.Item>
                  ))
                )}
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>

          {/* Profile menu */}
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button
                sx={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1.5px solid rgba(255,255,255,0.15)",
                  borderRadius: "xl",
                  px: 2,
                  _hover: {
                    background: "rgba(255,255,255,0.12)",
                    border: "1.5px solid rgba(139,92,246,0.45)",
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar.Root
                    size="sm"
                    sx={{
                      border: "2px solid rgba(139,92,246,0.5)",
                      boxShadow: "0 0 8px rgba(139,92,246,0.25)",
                    }}
                  >
                    <Avatar.Image src={user.pic} />
                    <Avatar.Fallback color="#f0eeff">
                      {user.name}
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(196,181,253,0.6)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </Box>
              </Button>
            </Menu.Trigger>
            <Menu.Positioner>
              <Menu.Content sx={menuContentStyles}>
                <ProfileModal user={user}>
                  <Menu.Item value="profile" sx={menuItemStyles}>
                    My profile
                  </Menu.Item>
                </ProfileModal>

                <Menu.Separator
                  sx={{ borderColor: "rgba(139,92,246,0.15)", my: 1 }}
                />

                <Menu.Item
                  value="logout"
                  onClick={logoutHandler}
                  sx={{
                    ...menuItemStyles,
                    color: "rgba(252,165,165,0.75)",
                    _hover: {
                      background: "rgba(239,68,68,0.10)",
                      color: "rgba(252,165,165,0.95)",
                    },
                  }}
                >
                  Logout
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>
        </Box>
      </Box>

      {/* ── Search Drawer ── */}
      <Drawer.Root
        placement="start"
        open={open}
        onOpenChange={(e) => !e.open && onClose()}
      >
        <Drawer.Backdrop
          sx={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
        />
        <Drawer.Positioner>
          <Drawer.Content
            sx={{
              background: "#1a1235",
              borderRight: "1px solid rgba(139,92,246,0.22)",
              boxShadow: "8px 0 48px rgba(0,0,0,0.7)",
            }}
          >
            <Drawer.Header
              sx={{ borderBottom: "1px solid rgba(139,92,246,0.15)", pb: 3 }}
            >
              <Drawer.Title>
                <Text
                  fontSize="16px"
                  fontFamily="'Work Sans', sans-serif"
                  fontWeight="700"
                  color="#f0eeff"
                >
                  Find users
                </Text>
              </Drawer.Title>
            </Drawer.Header>

            <Drawer.Body pt={4}>
              <Box display="flex" gap={2} mb={4}>
                <Input
                  placeholder="Search by name or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  sx={inputStyles}
                />
                <Button
                  onClick={handleSearch}
                  flexShrink={0}
                  sx={{
                    background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                    border: "1px solid rgba(167,139,250,0.4)",
                    color: "#f5f3ff",
                    borderRadius: "xl",
                    fontWeight: "700",
                    fontSize: "13px",
                    px: 4,
                    _hover: {
                      background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                      boxShadow: "0 4px 16px rgba(139,92,246,0.35)",
                      transform: "translateY(-1px)",
                    },
                    _active: { transform: "translateY(0)" },
                  }}
                >
                  Go
                </Button>
              </Box>

              {loading ? (
                <ChatLoading />
              ) : (
                <Box display="flex" flexDir="column" gap={1}>
                  {searchResult.map((u) => (
                    <UserListItem
                      key={u._id}
                      user={u}
                      handleFunction={() => accessChat(u._id)}
                    />
                  ))}
                </Box>
              )}

              {loadingChat && (
                <Box display="flex" justifyContent="center" mt={4}>
                  <Spinner
                    sx={{
                      borderColor: "rgba(139,92,246,0.2)",
                      borderTopColor: "#a78bfa",
                    }}
                  />
                </Box>
              )}
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </>
  );
}

export default SideDrawer;

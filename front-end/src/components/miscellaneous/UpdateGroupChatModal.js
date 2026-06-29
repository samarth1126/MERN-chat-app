import {
  Dialog,
  Button,
  useDisclosure,
  Field,
  Input,
  Box,
  IconButton,
  Spinner,
  Text,
  CloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import { toaster } from "../../toaster";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const { open, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      return;
    }
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
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

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        "/api/chat/rename",
        { chatId: selectedChat._id, chatName: groupChatName },
        config,
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      setGroupChatName("");
      toaster.create({
        title: "Group renamed!",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      toaster.create({
        title: "Error Occurred!",
        description: error.response.data.message,
        type: "error",
        duration: 5000,
      });
      setRenameLoading(false);
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toaster.create({
        title: "User already in group",
        type: "warning",
        duration: 5000,
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toaster.create({
        title: "Only admins can add members",
        type: "error",
        duration: 5000,
      });
      return;
    }
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        "/api/chat/groupadd",
        { chatId: selectedChat._id, userId: user1._id },
        config,
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toaster.create({
        title: "Error Occurred!",
        description: error.response.data.message,
        type: "error",
        duration: 5000,
      });
      setLoading(false);
    }
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toaster.create({
        title: "Only admins can remove members",
        type: "error",
        duration: 5000,
      });
      return;
    }
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        "/api/chat/groupremove",
        { chatId: selectedChat._id, userId: user1._id },
        config,
      );
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toaster.create({
        title: "Error Occurred!",
        description: error.response.data.message,
        type: "error",
        duration: 5000,
      });
      setLoading(false);
    }
  };

  const inputStyles = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "xl",
    color: "rgba(255,255,255,0.88)",
    fontSize: "14px",
    transition: "all 0.2s ease",
    _placeholder: { color: "rgba(255,255,255,0.22)" },
    _hover: { border: "1px solid rgba(139,92,246,0.35)" },
    _focus: {
      border: "1px solid rgba(139,92,246,0.55)",
      boxShadow: "0 0 0 3px rgba(139,92,246,0.1)",
      background: "rgba(255,255,255,0.06)",
    },
  };

  return (
    <>
      <IconButton
        display="flex"
        aria-label="Update group chat"
        onClick={onOpen}
        size="sm"
        icon={
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        }
        sx={{
          background: "rgba(139,92,246,0.12)",
          border: "1px solid rgba(139,92,246,0.25)",
          color: "#a78bfa",
          borderRadius: "lg",
          transition: "all 0.18s ease",
          _hover: {
            background: "rgba(139,92,246,0.22)",
            border: "1px solid rgba(139,92,246,0.45)",
            transform: "rotate(45deg)",
          },
        }}
      />

      <Dialog.Root
        open={open}
        onOpenChange={(e) => !e.open && onClose()}
        placement="center"
      >
        <Dialog.Backdrop
          sx={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
        />

        <Dialog.Positioner>
          <Dialog.Content
            sx={{
              background: "linear-gradient(145deg, #0f0f13, #13131a)",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: `
                0 0 0 1px rgba(255,255,255,0.04) inset,
                0 32px 80px rgba(0,0,0,0.7)
              `,
              borderRadius: "2xl",
              overflow: "hidden",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "15%",
                right: "15%",
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent)",
              },
            }}
          >
            <Dialog.Header
              display="flex"
              flexDir="column"
              alignItems="center"
              pt={6}
              pb={3}
              gap={1}
            >
              <Dialog.Title>
                <Text
                  fontSize="22px"
                  fontFamily="'Work Sans', sans-serif"
                  fontWeight="600"
                  sx={{
                    background: "linear-gradient(135deg, #ffffff, #a78bfa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {selectedChat.chatName}
                </Text>
              </Dialog.Title>
              <Text
                fontSize="13px"
                color="rgba(255,255,255,0.3)"
                fontWeight="400"
              >
                Manage group members and settings
              </Text>
            </Dialog.Header>

            <Dialog.CloseTrigger asChild position="absolute" top={3} right={3}>
              <CloseButton
                size="sm"
                sx={{
                  color: "rgba(255,255,255,0.4)",
                  borderRadius: "lg",
                  _hover: {
                    color: "rgba(255,255,255,0.8)",
                    background: "rgba(255,255,255,0.06)",
                  },
                }}
              />
            </Dialog.CloseTrigger>

            <Dialog.Body
              display="flex"
              flexDir="column"
              alignItems="center"
              gap={4}
              px={6}
            >
              {/* Current members */}
              {selectedChat.users.length > 0 && (
                <Box
                  w="100%"
                  display="flex"
                  flexWrap="wrap"
                  gap={2}
                  p={2}
                  borderRadius="xl"
                  sx={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  {selectedChat.users.map((u) => (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      admin={selectedChat.groupAdmin}
                      handleFunction={() => handleRemove(u)}
                    />
                  ))}
                </Box>
              )}

              {/* Rename group */}
              <Field.Root w="100%">
                <Text
                  fontSize="12px"
                  color="rgba(255,255,255,0.35)"
                  mb={2}
                  letterSpacing="0.05em"
                >
                  RENAME GROUP
                </Text>
                <Box display="flex" gap={2}>
                  <Input
                    placeholder="New group name"
                    value={groupChatName}
                    onChange={(e) => setGroupChatName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleRename()}
                    sx={inputStyles}
                  />
                  <Button
                    onClick={handleRename}
                    loading={renameloading}
                    flexShrink={0}
                    sx={{
                      background:
                        "linear-gradient(135deg, rgba(139,92,246,0.7), rgba(109,40,217,0.8))",
                      border: "1px solid rgba(139,92,246,0.35)",
                      color: "#ede9fe",
                      borderRadius: "xl",
                      fontWeight: "600",
                      fontSize: "13px",
                      px: 4,
                      _hover: {
                        background:
                          "linear-gradient(135deg, rgba(139,92,246,0.9), rgba(109,40,217,1))",
                        boxShadow: "0 4px 16px rgba(139,92,246,0.3)",
                        transform: "translateY(-1px)",
                      },
                      _active: { transform: "translateY(0)" },
                    }}
                  >
                    Update
                  </Button>
                </Box>
              </Field.Root>

              {/* Add members */}
              <Field.Root w="100%">
                <Text
                  fontSize="12px"
                  color="rgba(255,255,255,0.35)"
                  mb={2}
                  letterSpacing="0.05em"
                >
                  ADD MEMBERS
                </Text>
                <Input
                  placeholder="Search by name or email"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  sx={inputStyles}
                />
              </Field.Root>

              {/* Search results */}
              <Box w="100%">
                {loading ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    py={4}
                    gap={3}
                  >
                    <Spinner
                      size="sm"
                      sx={{
                        borderColor: "rgba(139,92,246,0.2)",
                        borderTopColor: "#a78bfa",
                      }}
                    />
                    <Text fontSize="13px" color="rgba(255,255,255,0.3)">
                      Searching...
                    </Text>
                  </Box>
                ) : (
                  <Box display="flex" flexDir="column" gap={1}>
                    {searchResult.slice(0, 4).map((u) => (
                      <UserListItem
                        key={u._id}
                        user={u}
                        handleFunction={() => handleAddUser(u)}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Dialog.Body>

            <Dialog.Footer
              pt={2}
              pb={5}
              px={6}
              sx={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              <Button
                onClick={() => handleRemove(user)}
                width="100%"
                sx={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  color: "rgba(239,68,68,0.8)",
                  borderRadius: "xl",
                  fontWeight: "600",
                  fontSize: "14px",
                  height: "44px",
                  transition: "all 0.2s ease",
                  _hover: {
                    background: "rgba(239,68,68,0.15)",
                    border: "1px solid rgba(239,68,68,0.45)",
                    color: "rgba(239,68,68,1)",
                    boxShadow: "0 4px 16px rgba(239,68,68,0.15)",
                    transform: "translateY(-1px)",
                  },
                  _active: { transform: "translateY(0)", boxShadow: "none" },
                }}
              >
                Leave group
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </>
  );
};

export default UpdateGroupChatModal;

import {
  Dialog,
  Button,
  useDisclosure,
  Field,
  Input,
  Box,
  Text,
  Spinner,
  CloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import { toaster } from "../../toaster";

const GroupChatModal = ({ children }) => {
  const { open, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toaster.create({
        title: "User already added",
        type: "warning",
        duration: 5000,
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

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

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      toaster.create({
        title: "Please fill all the fields",
        type: "warning",
        duration: 5000,
      });
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config,
      );
      setChats([data, ...chats]);
      onClose();
      toaster.create({
        title: "Group chat created!",
        type: "success",
        duration: 5000,
      });
    } catch (error) {
      toaster.create({
        title: "Failed to create the chat",
        description: error.response.data,
        type: "error",
        duration: 5000,
      });
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
      <span onClick={onOpen}>{children}</span>

      <Dialog.Root
        open={open}
        onOpenChange={(e) => !e.open && onClose()}
        placement="center"
      >
        {/* Overlay */}
        <Dialog.Backdrop
          sx={{
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(4px)",
          }}
        />

        <Dialog.Positioner>
          {/* Dialog content */}
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
            {/* Header */}
            <Dialog.Header
              display="flex"
              justifyContent="center"
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
                  Create Group Chat
                </Text>
              </Dialog.Title>
              <Text
                fontSize="13px"
                color="rgba(255,255,255,0.3)"
                fontWeight="400"
              >
                Add members and give your group a name
              </Text>
            </Dialog.Header>

            {/* Close button */}
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

            {/* Body */}
            <Dialog.Body
              display="flex"
              flexDir="column"
              alignItems="center"
              gap={3}
              px={6}
            >
              {/* Group name */}
              <Field.Root w="100%">
                <Input
                  placeholder="Group name"
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                  sx={inputStyles}
                />
              </Field.Root>

              {/* Search users */}
              <Field.Root w="100%">
                <Input
                  placeholder="Search users to add..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  sx={inputStyles}
                />
              </Field.Root>

              {/* Selected user badges */}
              {selectedUsers.length > 0 && (
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
                    animation: "fadeIn 0.15s ease-out",
                    "@keyframes fadeIn": {
                      from: { opacity: 0 },
                      to: { opacity: 1 },
                    },
                  }}
                >
                  {selectedUsers.map((u) => (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      handleFunction={() => handleDelete(u)}
                    />
                  ))}
                </Box>
              )}

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
                  <Box
                    display="flex"
                    flexDir="column"
                    gap={1}
                    sx={{
                      animation: searchResult.length
                        ? "fadeIn 0.15s ease-out"
                        : "none",
                      "@keyframes fadeIn": {
                        from: { opacity: 0, transform: "translateY(4px)" },
                        to: { opacity: 1, transform: "translateY(0)" },
                      },
                    }}
                  >
                    {searchResult.slice(0, 4).map((u) => (
                      <UserListItem
                        key={u._id}
                        user={u}
                        handleFunction={() => handleGroup(u)}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Dialog.Body>

            {/* Footer */}
            <Dialog.Footer
              pt={2}
              pb={5}
              px={6}
              sx={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              <Button
                onClick={handleSubmit}
                width="100%"
                sx={{
                  background:
                    "linear-gradient(135deg, rgba(139,92,246,0.8), rgba(109,40,217,0.9))",
                  border: "1px solid rgba(139,92,246,0.4)",
                  color: "#ede9fe",
                  borderRadius: "xl",
                  fontWeight: "600",
                  fontSize: "14px",
                  height: "44px",
                  transition: "all 0.2s ease",
                  _hover: {
                    background:
                      "linear-gradient(135deg, rgba(139,92,246,0.95), rgba(109,40,217,1))",
                    boxShadow: "0 4px 20px rgba(139,92,246,0.35)",
                    transform: "translateY(-1px)",
                  },
                  _active: { transform: "translateY(0px)", boxShadow: "none" },
                }}
              >
                Create group
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </>
  );
};

export default GroupChatModal;

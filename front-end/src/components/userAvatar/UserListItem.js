import { Box, Text, Avatar } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      w="100%"
      display="flex"
      alignItems="center"
      gap={3}
      px={3}
      py="10px"
      borderRadius="xl"
      sx={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.05)",
        transition: "all 0.15s ease",
        _hover: {
          background: "rgba(139,92,246,0.12)",
          border: "1px solid rgba(139,92,246,0.25)",
        },
      }}
    >
      <Avatar.Root
        size="sm"
        sx={{
          border: "2px solid rgba(139,92,246,0.3)",
          flexShrink: 0,
        }}
      >
        <Avatar.Image src={user.pic} />
        <Avatar.Fallback>{user.name}</Avatar.Fallback>
      </Avatar.Root>

      <Box>
        <Text fontSize="14px" fontWeight="500" color="rgba(255,255,255,0.85)">
          {user.name}
        </Text>
        <Text fontSize="12px" color="rgba(255,255,255,0.4)">
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;

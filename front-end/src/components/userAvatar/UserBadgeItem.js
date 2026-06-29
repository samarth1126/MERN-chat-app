import { Box, Text } from "@chakra-ui/react";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      fontSize="12px"
      cursor="pointer"
      onClick={handleFunction}
      display="inline-flex"
      alignItems="center"
      gap={1}
      sx={{
        background: "rgba(139,92,246,0.2)",
        border: "1px solid rgba(139,92,246,0.35)",
        color: "#c4b5fd",
        transition: "all 0.15s ease",
        _hover: {
          background: "rgba(139,92,246,0.3)",
          border: "1px solid rgba(139,92,246,0.5)",
        },
      }}
    >
      <Text fontSize="12px" fontWeight="500">
        {user.name}
        {admin?._id === user._id && (
          <Text as="span" fontSize="11px" opacity={0.7}>
            {" "}
            (Admin)
          </Text>
        )}
      </Text>

      {/* Close icon — no @chakra-ui/icons needed */}
      <svg
        width="8"
        height="8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </Box>
  );
};

export default UserBadgeItem;

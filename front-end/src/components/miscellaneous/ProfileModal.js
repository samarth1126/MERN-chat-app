
import {
  Dialog,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
  Box,
  CloseButton,
} from "@chakra-ui/react";
 
const ProfileModal = ({ user, children }) => {
  const { open, onOpen, onClose } = useDisclosure();
 
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display="flex"
          aria-label="View profile"
          onClick={onOpen}
          size="sm"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          }
          sx={{
            background: "rgba(139,92,246,0.12)",
            border: "1px solid rgba(139,92,246,0.25)",
            color: "#a78bfa",
            borderRadius: "lg",
            _hover: {
              background: "rgba(139,92,246,0.22)",
              border: "1px solid rgba(139,92,246,0.45)",
            },
          }}
        />
      )}
 
      <Dialog.Root size="md" open={open} onOpenChange={(e) => !e.open && onClose()} placement="center">
        <Dialog.Backdrop sx={{ background: "rgba(0,0,0,0.80)", backdropFilter: "blur(6px)" }} />
        <Dialog.Positioner>
          <Dialog.Content
            sx={{
              background: "#1a1235",
              border: "1px solid rgba(139,92,246,0.28)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05) inset",
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
                background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.7), transparent)",
              },
            }}
          >
            {/* Header */}
            <Dialog.Header display="flex" justifyContent="center" pt={6} pb={2}>
              <Dialog.Title>
                <Text
                  fontSize="22px"
                  fontFamily="'Work Sans', sans-serif"
                  fontWeight="700"
                  color="#f0eeff"
                >
                  {user.name}
                </Text>
              </Dialog.Title>
            </Dialog.Header>
 
            <Dialog.CloseTrigger asChild position="absolute" top={3} right={3}>
              <CloseButton
                size="sm"
                sx={{
                  color: "rgba(220,210,255,0.5)",
                  borderRadius: "lg",
                  _hover: { color: "#f0eeff", background: "rgba(255,255,255,0.08)" },
                }}
              />
            </Dialog.CloseTrigger>
 
            {/* Body */}
            <Dialog.Body display="flex" flexDir="column" alignItems="center" gap={5} pb={6}>
              {/* Avatar */}
              <Box position="relative">
                <Box
                  position="absolute"
                  inset="-6px"
                  borderRadius="full"
                  sx={{
                    background: "radial-gradient(circle, rgba(139,92,246,0.30) 0%, transparent 70%)",
                    filter: "blur(10px)",
                  }}
                />
                <Image
                  borderRadius="full"
                  boxSize="140px"
                  src={user.pic}
                  alt={user.name}
                  position="relative"
                  sx={{
                    border: "2px solid rgba(139,92,246,0.55)",
                    boxShadow: "0 0 0 4px rgba(139,92,246,0.12)",
                    objectFit: "cover",
                  }}
                />
              </Box>
 
              {/* Email row */}
              <Box
                w="100%"
                display="flex"
                alignItems="center"
                gap={3}
                px={4}
                py={3}
                borderRadius="xl"
                sx={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(139,92,246,0.18)",
                }}
              >
                <Box color="rgba(167,139,250,0.8)" flexShrink={0}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </Box>
                <Box>
                  <Text fontSize="11px" color="rgba(196,181,253,0.5)" letterSpacing="0.07em" fontWeight="600" textTransform="uppercase">
                    Email
                  </Text>
                  <Text fontSize="14px" color="#f0eeff" fontWeight="500" fontFamily="'Work Sans', sans-serif">
                    {user.email}
                  </Text>
                </Box>
              </Box>
            </Dialog.Body>
 
            {/* Footer */}
            <Dialog.Footer pt={2} pb={5} px={6} sx={{ borderTop: "1px solid rgba(139,92,246,0.12)" }}>
              <Button
                onClick={onClose}
                width="100%"
                sx={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1.5px solid rgba(255,255,255,0.18)",
                  color: "rgba(220,210,255,0.75)",
                  borderRadius: "xl",
                  fontWeight: "600",
                  fontSize: "14px",
                  height: "42px",
                  _hover: {
                    background: "rgba(255,255,255,0.12)",
                    border: "1.5px solid rgba(255,255,255,0.28)",
                    color: "#f0eeff",
                  },
                }}
              >
                Close
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </>
  );
};
 
export default ProfileModal;
 

import { useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";
import { Tabs } from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/SignUp";
import { useHistory } from "react-router-dom";
 
const HomePage = () => {
  const history = useHistory();
 
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) history.push("/chats");
  }, []);
 
  return (
    <Box
      minH="100vh"
      w="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      zIndex={1}
      py={8}
      px={4}
    >
      <Box w="100%" maxW="460px">
 
        {/* ── Brand header ── */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDir="column"
          gap={1}
          p={6}
          w="100%"
          mb={4}
          borderRadius="2xl"
          position="relative"
          overflow="hidden"
          sx={{
            background: "#16102e",
            border: "1px solid rgba(139,92,246,0.30)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "15%",
              right: "15%",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(139,92,246,0.8), transparent)",
            },
          }}
        >
          <Text
            fontFamily="'Work Sans', sans-serif"
            fontSize="2xl"
            fontWeight="700"
            letterSpacing="0.15em"
            sx={{
              background:
                "linear-gradient(135deg, #ffffff 0%, #c4b5fd 50%, #7c3aed 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            BOLO
          </Text>
          <Text
            fontSize="11.5px"
            letterSpacing="0.22em"
            fontFamily="'Work Sans', sans-serif"
            color="rgba(196,181,253,0.55)"
            fontWeight="500"
          >
            CONNECT · CHAT · COLLABORATE
          </Text>
        </Box>
 
        {/* ── Auth card ── */}
        <Box
          w="100%"
          borderRadius="2xl"
          overflow="hidden"
          sx={{
            background: "#1a1235",
            border: "1px solid rgba(139,92,246,0.25)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04) inset",
            animation: "fadeSlideUp 0.35s ease-out",
            "@keyframes fadeSlideUp": {
              from: { opacity: 0, transform: "translateY(18px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Tabs.Root defaultValue="login" variant="plain">
            <Tabs.List
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                borderBottom: "1px solid rgba(139,92,246,0.18)",
                p: "6px",
                gap: "4px",
                background: "rgba(0,0,0,0.30)",
              }}
            >
              {["login", "signup"].map((val, i) => (
                <Tabs.Trigger
                  key={val}
                  value={val}
                  sx={{
                    py: "10px",
                    borderRadius: "xl",
                    fontSize: "14px",
                    fontWeight: "600",
                    fontFamily: "'Work Sans', sans-serif",
                    color: "rgba(196,181,253,0.45)",
                    transition: "all 0.2s ease",
                    border: "1px solid transparent",
                    _selected: {
                      background: "rgba(255,255,255,0.10)",
                      border: "1px solid rgba(255,255,255,0.20)",
                      color: "#f0eeff",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.30)",
                    },
                    _hover: {
                      color: "rgba(220,210,255,0.75)",
                      background: "rgba(255,255,255,0.05)",
                    },
                  }}
                >
                  {i === 0 ? "Login" : "Sign Up"}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
 
            <Box p={6}>
              <Tabs.Content value="login">
                <Login />
              </Tabs.Content>
              <Tabs.Content value="signup">
                <SignUp />
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        </Box>
 
      </Box>
    </Box>
  );
};
 
export default HomePage;
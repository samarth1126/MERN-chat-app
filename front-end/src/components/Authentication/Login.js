import { useState } from "react";
import { Button, Field, Input, VStack, Box, Text } from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import { toaster } from "../../toaster";

const inputStyles = {
  background: "rgba(255,255,255,0.11)",
  border: "1.5px solid rgba(255,255,255,0.20)",
  borderRadius: "10px",
  color: "#f0eeff",
  fontSize: "13.5px",
  fontWeight: "500",
  height: "40px",
  transition: "all 0.2s ease",
  _placeholder: { color: "rgba(210,200,255,0.38)" },
  _hover: {
    border: "1.5px solid rgba(167,139,250,0.55)",
    background: "rgba(255,255,255,0.14)",
  },
  _focus: {
    border: "1.5px solid rgba(167,139,250,0.85)",
    boxShadow: "0 0 0 3px rgba(139,92,246,0.18)",
    background: "rgba(255,255,255,0.15)",
  },
};

const labelStyles = {
  fontSize: "11.5px",
  fontWeight: "700",
  color: "rgba(220,210,255,0.75)",
  mb: "6px",
  letterSpacing: "0.07em",
  textTransform: "uppercase",
};

const showBtnStyles = {
  background: "rgba(167,139,250,0.18)",
  border: "1px solid rgba(167,139,250,0.4)",
  color: "#c4b5fd",
  borderRadius: "7px",
  fontSize: "11px",
  fontWeight: "700",
  height: "26px",
  minW: "auto",
  px: "10px",
  _hover: {
    background: "rgba(167,139,250,0.30)",
    border: "1px solid rgba(167,139,250,0.65)",
    color: "#ede9fe",
  },
};

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const { setUser } = ChatState();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toaster.create({
        title: "Please fill all the fields",
        type: "warning",
        duration: 5000,
      });
      setLoading(false);
      return;
    }

    try {
      const config = { headers: { "Content-type": "application/json" } };
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config,
      );
      toaster.create({
        title: "Login successful",
        type: "success",
        duration: 5000,
      });
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
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

  return (
    <VStack gap="14px">
      {/* Email */}
      <Field.Root required width="100%">
        <Field.Label sx={labelStyles}>Email address</Field.Label>
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={inputStyles}
        />
      </Field.Root>

      {/* Password */}
      <Field.Root required width="100%">
        <Field.Label sx={labelStyles}>Password</Field.Label>
        <Box position="relative" width="100%">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ ...inputStyles, pr: "72px" }}
          />
          <Box
            position="absolute"
            right="8px"
            top="50%"
            transform="translateY(-50%)"
            zIndex={1}
          >
            <Button size="sm" onClick={() => setShow(!show)} sx={showBtnStyles}>
              {show ? "Hide" : "Show"}
            </Button>
          </Box>
        </Box>
      </Field.Root>

      {/* Login button */}
      <Button
        width="100%"
        mt={1}
        onClick={submitHandler}
        loading={loading}
        sx={{
          background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
          border: "1px solid rgba(167,139,250,0.5)",
          color: "#f5f3ff",
          borderRadius: "11px",
          fontWeight: "700",
          fontSize: "14.5px",
          height: "44px",
          letterSpacing: "0.03em",
          _hover: {
            background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
            boxShadow: "0 6px 24px rgba(139,92,246,0.40)",
            transform: "translateY(-1px)",
          },
          _active: { transform: "translateY(0px)", boxShadow: "none" },
        }}
      >
        Login
      </Button>

      {/* Divider */}
      <Box w="100%" display="flex" alignItems="center" gap={3}>
        <Box flex={1} h="1px" bg="rgba(255,255,255,0.13)" />
        <Text fontSize="12px" color="rgba(220,210,255,0.4)" fontWeight="500">
          or
        </Text>
        <Box flex={1} h="1px" bg="rgba(255,255,255,0.13)" />
      </Box>

      {/* Guest credentials */}
      <Button
        width="100%"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
        sx={{
          background: "rgba(255,255,255,0.07)",
          border: "1.5px solid rgba(255,255,255,0.18)",
          color: "rgba(220,210,255,0.75)",
          borderRadius: "11px",
          fontWeight: "600",
          fontSize: "13px",
          height: "40px",
          _hover: {
            background: "rgba(255,255,255,0.12)",
            border: "1.5px solid rgba(255,255,255,0.30)",
            color: "#f0eeff",
          },
        }}
      >
        Use guest credentials
      </Button>
    </VStack>
  );
};

export default Login;

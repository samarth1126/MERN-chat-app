
import React from "react";
import {
  Stack,
  Button,
  StackSeparator,
  FieldLabel,
  FieldRoot,
  InputGroup,
} from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { useState } from "react";
import { toaster } from "../../components/ui/toaster";
import axios from "axios";
import { useHistory } from 'react-router-dom/cjs/react-router-dom';

const Login = () => {
    const [show, setShow]=useState(false)
          
    const [email, setEmail] = useState("");
          
    const [password, setPassword] = useState("");
    const [loading,setLoading]=useState(false);
    const handleClick=()=> setShow(!show);
    const history=useHistory();
    
        //   const postDetails=(pics)=>{
    
        //   };
    
    const submitHandler=async()=>{
      setLoading(true);
      if(!email || !password){
        toaster.create({
          title:"Please Fill all the Feilds",
          status:"warning",
          duration:5000,
          isClosable:true,
          position:"bottom",
        });
      
      setLoading(false);
      return;
      }


      try{
        const config={
          headers:{
            "Content-type":"application/json",
          },
        };
        const {data}=await axios.post(
          "/api/user/login",
          {email,password},
          config
        );

         toaster.create({
          title:"Login Successfull",
          status:"success",
          duration:5000,
          isClosable:true,
          position:"bottom",
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
        history.push("/chats");

      }catch(error){
        toaster.create({
          title: "Error Occured!!",
          description: error.response?.data?.message || "Something went wrong",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      }
    };
      
        return (
          <Stack separator={<StackSeparator />} gap="5px">
            <FieldRoot id="email" required>
              <FieldLabel>Email</FieldLabel>
              <Input
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FieldRoot>

            <FieldRoot id="password" required>
              <FieldLabel>Password</FieldLabel>
              <InputGroup
                endElement={
                  <Button size="sm" h="1.5rem" onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                  </Button>
                }
              >
                <Input
                  type={show ? "text" : "password"}
                  placeholder="Enter Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm">
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement> */}
              </InputGroup>
            </FieldRoot>

            {/* <FieldRoot id="password" isRequired>
              <FieldLabel>Confirm Password</FieldLabel>
              <InputGroup
                endElement={
                  <Button size="sm" h="1.5rem" onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                  </Button>
                }
              >
                <Input
                  type={show ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmpassword}
                  onChange={(e) => setConfirmpassword(e.target.value)}
                />
              </InputGroup>
            </FieldRoot>
            <FieldRoot id="pic">
              <FieldLabel>Upload Your Picture</FieldLabel>
              <Input
                type="file"
                p={1.5}
                accept="image/*"
                value={pic}
                onChange={(e) => postDetails(e.target.files[0])}
              />
            </FieldRoot> */}
            <Button
              colorPalette={"blue"}
              width="100%"
              style={{ marginTop: 10 }}
              onClick={submitHandler}
              justifyContent={"center"}
              alignItems={"center"}
              isLoading={loading}
            >
              Login
            </Button>
            <Button
              colorPalette={"red"}
              width="100%"
              style={{ marginTop: 10 }}
              
              justifyContent={"center"}
              alignItems={"center"}
              onClick={()=>{
                setEmail("guest@example.com");
                setPassword("123456");
              }}
            >
              Create Guest Id
            </Button>
          </Stack>
        );
    }

export default Login

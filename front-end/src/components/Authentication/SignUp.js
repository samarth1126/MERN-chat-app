import React from 'react'
import { Stack,Button, StackSeparator,  FieldLabel, FieldRoot, InputGroup } from "@chakra-ui/react";
import { Input} from "@chakra-ui/react";
import { useState } from "react";
import { toaster } from "../../components/ui/toaster";
import axios from "axios";
import { useHistory } from 'react-router-dom/cjs/react-router-dom';


const SignUp = () => {
      const [show, setShow]=useState(false)
      const [name, setName]=useState("")
      const [email, setEmail] = useState("");
      const [confirmpassword, setConfirmpassword] = useState("");
      const [password, setPassword] = useState("");
      const [pic, setPic] = useState("");
      const handleClick=()=> setShow(!show);
      const [loading, setLoading]=useState(false);
      const history=useHistory();
      

      const postDetails=(pics)=>{
        setLoading(true)
        if(pics===undefined){
          toaster.create({
            title:"Please Enter your Picture",
            status:"warning",
            duration:5000,
            isClosable:true,
            position:"bottom",
          });

          setLoading(false);
          return;
        }
        if(pics.type==="image/jpeg" || pics.type==="image/png"){
          const data=new FormData();
          data.append("file",pics);
          data.append("upload_preset", "chat-app");
          data.append("cloud_name", "dooveqy0g");
          fetch("https://api.cloudinary.com/v1_1/dooveqy0g/image/upload",{
            method:"post",
            body:data,

          }).then((res)=>res.json())
          .then((data)=>{
            setPic(data.secure_url);
            setLoading(false)
          })
          .catch((err)=>{
            console.log(err);
            setLoading(false);
          })
        }else{
          toaster.create({
            title:"Please Enter your Picture",
            status:"warning",
            duration:5000,
            isClosable:true,
            position:"bottom",
          });

          
          setLoading(false);
          return;
        }
      };

      const submitHandler=async()=>{
        setLoading(true);
        if(!name || !email || !password || !confirmpassword){
          toaster.create({
            title: "Please Fill all the Feilds",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
          return;
        }
        if(password!==confirmpassword){
          toaster.create({
            title: "Passwords Do Not Match",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;
        }
        try{
          const config={
            headers:{
              "Content-type":"application/json",
            },
          };

          const {data}=await axios.post('/api/user',{name,email,password,pic}, config);
          toaster.create({
            title: "Registeration is Successfull",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });

          localStorage.setItem('userInfo', JSON.stringify(data))
          setLoading(false);

          history.push('/')
        }catch(error){
          toaster.create({
            title: "Error Occured!!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false)
        }
      };
  
    return (
      <Stack separator={<StackSeparator />} gap="5px">
        <FieldRoot id="first-name" required>
          <FieldLabel>Name</FieldLabel>
          <Input
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FieldRoot>

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

        <FieldRoot id="password" required>
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
            // value={pic}
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </FieldRoot>
        <Button
          colorPalette="blue"
          width="100%"
          style={{ marginTop: 10 }}
          onClick={submitHandler}
          justifyContent={"center"}
          alignItems={"center"}
          loading={loading}
        >
          SignUp
        </Button>
      </Stack>
    );
}

export default SignUp

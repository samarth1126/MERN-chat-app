import React from 'react'
import { Box, Button, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
// import { byPrefixAndName } from "@awesome.me/kit-KIT_CODE/icons";

const SideDrawer = () => {
  const [search,setSearch]=useState("")
  const [searchResult, setSearchResult]=useState([])
  const [loading,setLoading]=useState(false);
  const [loadingChat, setLoadingChat]=useState();

  return (
    <div>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        width={"100%"}
        p="5px 10px 5px 10px"
        borderWidth={"5px"}
      >
        <Button variant="ghost">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            style={{ color: "rgb(253, 253, 253)" }}
          />
          <Text display={{ base: "none", md: "flex" }} px="4">Search User</Text>
        </Button>
      </Box>
    </div>
  );
}

export default SideDrawer

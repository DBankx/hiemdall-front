import React from "react";
import  {Box, Center, HStack} from "@chakra-ui/react";
import {Link} from "react-router-dom";
import { AiOutlineFrown } from "react-icons/ai";

const NotFound = () => {
  return (
      <Center h="calc(100vh - 100px)">
        <Box>
          <HStack>
            <AiOutlineFrown />
            <p>Sorry we couldnt find what you're looking for</p>
          </HStack>
          <Center>
            <Link to="/" style={{color: "#237EA3"}}>Go home &#8594;</Link>
          </Center>
        </Box>
      </Center>
  )
}

export default NotFound;

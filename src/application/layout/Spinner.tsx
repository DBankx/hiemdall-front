import React from "react";
import {Center, Container, Spinner, Box} from "@chakra-ui/react";

const Loader = () => {
  return (
    <Box>
      <Container maxW="container.lg">
        <Center mt="2em">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
        </Center>
      </Container>
    </Box>
  )
}

export default Loader;

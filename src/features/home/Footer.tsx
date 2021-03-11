import React from "react";
import {Container} from "@chakra-ui/react";

const Footer = () => {
  return (
    <footer>
      <Container maxW="container.lg" centerContent>
      <p>Copyright &copy; hiemdall {new Date().getFullYear()}</p>
      </Container>
    </footer>
  )
}

export default Footer;

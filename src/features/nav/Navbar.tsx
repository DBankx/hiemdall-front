import React, {useContext} from "react";
import storeContext from "../../application/store/store";
import {observer} from "mobx-react-lite";
import {
  Box,
  HStack,
  Spacer,
  Container,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
  useMediaQuery
} from "@chakra-ui/react";
import {NavLink, Link} from "react-router-dom";
import {history} from "../../index";
import {ChevronDownIcon} from "@chakra-ui/icons";
import LoaderInline from "../../application/layout/Spinner";

const Navbar = () => {
  const {user, logout} = useContext(storeContext);
  const [isMobile] = useMediaQuery("(max-width: 500px)")
  if(!user) return <LoaderInline />;
  return (
    <header className="nav">
      <Container maxW="container.lg" height="50px">
    <nav className="navbar">
           <HStack>
             <Box>
               <NavLink to="/" className="auth__header">Hemidall Library</NavLink>
             </Box>
             <Spacer />
             <HStack spacing="30px">
               {!isMobile && <NavLink activeClassName="active__nav" to="/borrowed">My borrowed books</NavLink>}
              <Box>
                <Menu size="large" isLazy={true} >
                  <MenuButton as={Box} >
                    <HStack spacing="5px">
                      <Image src={user!.avatar} alt="user_avatar" borderRadius="full" boxSize="40px" />
                      <ChevronDownIcon boxSize={8} />
                    </HStack>
                  </MenuButton>
                  <MenuList style={{zIndex: 200}}  minWidth="180px" className="nav__auth__box">
                    <MenuItem onClick={() => history.push("/borrowed")}>My borrowed books</MenuItem>
                    <MenuItem onClick={() => logout()}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              </Box>
             </HStack>
           </HStack>
    </nav>
      </Container>
    </header>
  )
}

export default observer(Navbar);

import React, {useContext, useEffect} from "react";
import {observer} from "mobx-react-lite";
import {Box, Container, HStack, Image, SimpleGrid, Badge} from "@chakra-ui/react";
import storeContext from "../../application/store/store";
import Loader from "../../application/layout/Spinner";
import BookItem from "../book/BookItem";
import BookPage from "../book/BookPage";
import {StringParam, useQueryParam} from "use-query-params";

const BorrowedBooks = () => {
  const {user, loadingBooks, getBorrowedBooks, borrowedBooks} = useContext(storeContext);
  const [bookPane, setBook] = useQueryParam("bookPane", StringParam);

  useEffect(() => {
    getBorrowedBooks()
  }, [getBorrowedBooks])

  if(loadingBooks || borrowedBooks == null) return <Loader />

  return (
    <Box mt={5}>
      <Container maxW="container.lg">
      <HStack>
        <Image src={user?.avatar} alt="avatar" width="100px" height="100px" />
        <Box>
        <h2>{user?.email}</h2>
          <p style={{fontWeight: "bold"}} className="auth__label">You have currently borrowed {user?.borrowedBooks.length} book(s)</p>

        </Box>
      </HStack>
        <Box mt={5} mb={5}>
          <Box>
        <h3 style={{fontSize: "1.2em"}}>Borrowed Books</h3>
          {user!.borrowedBooks.length >= 2 && <Badge colorScheme="red">Max allowed books</Badge>}
        </Box>
          <Box mt={5}>
            <SimpleGrid spacing="1em" templateColumns={{xl: "0.8fr 1fr", lg: "0.8fr 1fr", sm: "1fr"}}>
              <Box>
                <Box>
                  <small style={{fontWeight: "bold"}}>{borrowedBooks.length} books borrowed</small>

                </Box>
                {borrowedBooks.map((book) => (
                  <Box mb={5} key={book._id}>
                    <BookItem book={book} />
                  </Box>
                ))}
              </Box>

              <Box>
                { bookPane && (
                  <BookPage />
                )}
              </Box>
            </SimpleGrid>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default observer(BorrowedBooks);

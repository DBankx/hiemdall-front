import React, {useContext, useEffect} from "react";
import {Box, Container, SimpleGrid, useMediaQuery} from "@chakra-ui/react";
import {observer} from "mobx-react-lite";
import Search from "./Search";
import storeContext from "../../application/store/store";
import Loader from "../../application/layout/Spinner";
import BookItem from "../book/BookItem";
import {useQueryParam, StringParam} from "use-query-params";
import BookPage from "../book/BookPage";

const HomePage = () => {
  const {loadingBooks, books, getAllBooks, book} = useContext(storeContext);
  const [bookPane, setBook] = useQueryParam("bookPane", StringParam);
  const [title, setTitle] = useQueryParam("title", StringParam);
  const [isMobile] = useMediaQuery("(max-width: 500px)")

  useEffect(() => {
    getAllBooks(title ? title : "");
  }, [getAllBooks, title])

  if(loadingBooks || books == null) return <Loader />;
  return (
    <Box>
      <Container maxW="container.lg">
        <Box mt={5} mb={5}>
          <Search />
        </Box>
        <Box>
          <SimpleGrid spacing="1em" templateColumns={{xl: "0.8fr 1fr", lg: "0.8fr 1fr", sm: "1fr"}}>
            <Box>
              <Box>
                {title && (
                  <Box mb={4}>
                    <h3 className="auth__header">Search results for "{title}"</h3>
                  </Box>
                )}
                <small style={{fontWeight: "bold"}}>{books.length} book(s) found</small>
              </Box>
              {books.length > 0 ? books.map((book) => (
                <Box mb={5} key={book._id}>
                  <BookItem book={book} />
                </Box>
              )) : (
                <h2 className="auth__header">There are no books currently available in the library</h2>
              )}
            </Box>

            <Box>
              { !isMobile && bookPane && (
                <BookPage />
              )}
            </Box>
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  )
}

export default observer(HomePage);

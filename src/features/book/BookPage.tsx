import React, {useContext, useEffect} from "react";
import {observer} from "mobx-react-lite";
import {Box, HStack, Image, Button, Badge, Spacer, Divider, Container} from "@chakra-ui/react";
import {StringParam, useQueryParam} from "use-query-params";
import storeContext from "../../application/store/store";
import LoaderInline from "../../application/layout/LoaderInline";
import {Link,  useLocation, useParams} from "react-router-dom";
import {StarIcon, CopyIcon, CheckIcon, NotAllowedIcon} from "@chakra-ui/icons";
import {BsBook, BsLink45Deg} from "react-icons/bs";

const BookPage = () => {
  const [bookPane, setBook] = useQueryParam("bookPane", StringParam);
  let bookId = "";
  const params = useParams<{id: string}>();
  const location = useLocation();
  if(location.pathname.startsWith("/book")){
    bookId = params.id;
  } else {
    bookId = bookPane!;
  }
  const {loadingBook, book, getBookById, user, loadingBookAction, borrowBook, returnBook} = useContext(storeContext);
  useEffect(() => {
    getBookById(bookId);
  }, [getBookById, bookId])
  if(book === null || loadingBook) return <LoaderInline />
  const iterator = [...Array(Math.floor(book.rating))];
  return (
    <Box className={location.pathname.startsWith("/book") ? "" : "book__item__box maxed"} p="0">
      <Container maxW={location.pathname.startsWith("/book") ? "container.lg" : ""} >
      <Box p="1.25em" pb="0">
        <Box mb={4}>
        {location.pathname.startsWith("/book") && <Link to="/" style={{color: "#237EA3"}}>&#8592; back</Link>}
        </Box>
      <HStack spacing="10px" alignItems="flex-start" >
        <Image src={book.images[0]} alt="book-photo" className="book__item__img" />
        <Box>
          <Link to={`/book/${book._id}`} className="book__item__link">{book.title}</Link>
          <HStack>
            <HStack spacing="4px">
              {iterator.map((value: undefined, index: number) => (
                <StarIcon boxSize={2} key={index} color="#237EA3" />
              ))}
            </HStack>
            <p style={{color: "#237EA3"}}>{book.rating}</p>
          </HStack>

          <p>By: <span style={{color: "#237EA3", fontWeight: "bold"}}>{book.author}</span></p>
          {book.isBorrowed ? <Badge colorScheme="green">Borrowed</Badge> : book.copies <= 1 ? <Badge colorScheme="red">Un available</Badge> : ""}
        </Box>
      </HStack>
      <Box mt={5}>
        <HStack spacing="20px" mt={3} mb={3}>
          {book.copies > 1 ? (
            <small><CheckIcon boxSize={3} color="#237EA3"/> Available</small>
          ) : (
            <small><NotAllowedIcon boxSize={3} color="#237EA3" /> Un-available</small>
          )
          }
          <HStack><CopyIcon color="#237EA3" boxSize="15px" /> <small>{book.copies} copies left</small></HStack>
          <HStack><BsBook size="12px" color="#237EA3" /><small>{book.pages} pages</small></HStack>
          <HStack><BsLink45Deg size="12px" color="#237EA3" /><small>{book.genre} genre</small></HStack>
        </HStack>
      </Box>

      <HStack mt={5}>
        {book.isBorrowed ? <Button disabled={loadingBookAction} onClick={() => returnBook(book._id)} isLoading={loadingBookAction} className="borrow__btn">Return copy</Button> : <Button isLoading={loadingBookAction} onClick={() => borrowBook(book._id)} disabled={book.isBorrowed || user!.borrowedBooks.length >= 2 || book.copies <= 1 || loadingBookAction} className="borrow__btn">
          Borrow a copy
        </Button>}
        <Spacer />
        <a href={book.productLink} target="_blank" rel="noreferrer noopener" className="product__link">Buy book here</a>
      </HStack>
      </Box>
      <Divider mt={3} mb={3} />
      <Box className="book__info" p="1.25em" pt="0">
        <h3 style={{fontWeight: 700, fontSize: "1.1em"}}>Book summary</h3>
        <Box>
          <p>{book.description}</p>
        </Box>
        <Box mt={6}>
          <small style={{fontWeight: "bold"}}>Published {book.publishedDate}</small>
        </Box>
      </Box>
      </Container>
    </Box>
  )
}

export default observer(BookPage);

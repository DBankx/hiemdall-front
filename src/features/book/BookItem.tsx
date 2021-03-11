import React from "react";
import {observer} from "mobx-react-lite";
import {Box, Badge, Image, HStack, useMediaQuery} from "@chakra-ui/react";
import {StarIcon, CheckIcon, NotAllowedIcon} from "@chakra-ui/icons";
import {IBook} from "../../infrastructure/models/book";
import {Link} from "react-router-dom";
import {BsBook, BsLink45Deg} from "react-icons/bs";
import {StringParam, useQueryParam} from "use-query-params";

interface IProps{
  book: IBook;
}

const BookItem = ({book}: IProps) => {
  const [isMobile] = useMediaQuery("(max-width: 500px)");
  const iterator = [...Array(Math.floor(book.rating))];
  const [bookPane, setBook] = useQueryParam("bookPane", StringParam);

  return (
    <Box onClick={() => setBook(book._id)} className="book__item__box">
      <Badge colorScheme="purple">New</Badge>
      <HStack spacing="10px" alignItems="flex-start">
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
        </Box>
      </HStack>
      <HStack spacing="20px" mt={3} mb={3}>
        {book.copies > 1 ? (
          <small><CheckIcon boxSize={3} color="#237EA3"/> Available</small>
        ) : (
          <small><NotAllowedIcon boxSize={3} color="#237EA3" /> Un-available</small>
        )
        }
        <HStack><BsBook size="12px" color="#237EA3" /><small>{book.pages} pages</small></HStack>
        <HStack><BsLink45Deg size="12px" color="#237EA3" /><small>{book.genre} genre</small></HStack>
      </HStack>
      <Box>
        <p className="truncate">{book.description}</p>
      </Box>
      <Box mt={4}>
        <small style={{fontWeight: "bold"}}>Published {book.publishedDate}</small>
      </Box>
    </Box>
  )
}

export default observer(BookItem);

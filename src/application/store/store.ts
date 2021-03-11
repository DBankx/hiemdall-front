import {runInAction, action, observable, makeAutoObservable, configure, computed, reaction} from "mobx";
import {IAuthFormValues, IUser} from "../../infrastructure/models/auth";
import {AuthRequest, BookRequest} from "../api/agent";
import {createContext} from "react";
import {IBook} from "../../infrastructure/models/book";
import {history} from "../../index";
import {toast} from "react-toastify";

// Ensure mobx always runs in action
configure({enforceActions: "always"});

class AppStore{
  constructor() {
    makeAutoObservable(this);
    reaction(() => this.token, (token) => {
      if(token){
        // set the token value in local storage as soon as the token changes
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    })
  }

  @observable user : IUser | null = null;
  @observable token: string | null = localStorage.getItem("token");
  @observable appLoaded = false;
  @observable books: IBook[] | null = null;
  @observable loadingBooks = false;
  @observable book: IBook | null = null;
  @observable loadingBook = false;
  @observable loadingBookAction = false;
  @observable borrowedBooks : IBook[] | null = null;

  // check if a user is logged in
  @computed get isLoggedIn(){
    return this.user !== null;
  }

  // login a user
  @action loginUser = async (values: IAuthFormValues) => {
    try{
      const user = await AuthRequest.login(values);
      runInAction(() => {
        this.user = user.data;
        localStorage.setItem("token", user.token);
        this.appLoaded = true;
      })
    }catch (error){
      toast.error("Invalid credentials");
      throw error;
    }
  }

  // signup
  @action signUp = async (values: IAuthFormValues) => {
    try{
      const user = await AuthRequest.signUp(values);
      runInAction(() => {
        this.appLoaded = true;
      })
    }catch (error){
      toast.error("Invalid credentials");
      throw error;
    }
  }

  // load the app
  @action loadApp = () => {
    this.appLoaded = true;
  }

  // get the currently logged in user
  @action getCurrentUser = async () => {
    try{
      const user = await AuthRequest.getCurrentUser();
      runInAction(() => {
        this.user = user.data;
        this.loadApp();
      })
    }catch (error) {
      toast.error("Error occured fetching profile");
     throw error;
    }
  }

  // get all books in library
  @action getAllBooks = async (title: string) => {
    this.loadingBooks = true;
    try{
      const bookData = await BookRequest.getAllBooks(title);
      runInAction(() => {
        this.books = bookData.data;
        this.loadingBooks = false;
      })
    }catch (e) {
      runInAction(() => this.loadingBooks = false);
      toast.error("Error occurred fetching books");
     throw e;
    }
  }

  // get a book by id
  @action getBookById = async (bookId: string) => {
    this.loadingBook = true;
    try{
      const bookData = await BookRequest.getBookById(bookId);
      runInAction(() => {
        this.book = bookData.data;
        this.book!.isBorrowed = this.user!.borrowedBooks.find(x => x === bookId) !== undefined;
        this.loadingBook = false;
      })
    }catch (error){
      runInAction(() => this.loadingBook = false);
      toast.error("Error occurred fetching books");
      throw error;
    }
  }

  // borrow a book
  @action borrowBook = async (bookId: string) => {
    this.loadingBookAction = true;
    try{
      await BookRequest.borrowBook(bookId);
      runInAction(() => {
        if(this.books !== null){
          const bookBeingBorrowed = this.books.find(x => x._id === bookId);
          if(bookBeingBorrowed){
            bookBeingBorrowed.isBorrowed = true;
            bookBeingBorrowed.copies = bookBeingBorrowed.copies - 1;
          }
        }
        if(this.book !== null){
          this.book.isBorrowed = true;
          this.book.copies = this.book.copies - 1;
          this.user!.borrowedBooks.push(this.book._id);
        }
        this.loadingBookAction = false;
        toast.success("Book borrowed successful");
      })
    }catch (error) {
      runInAction(() => this.loadingBookAction = false);
      toast.error("Error occurred borrowing book");
      throw error;
    }
  }

  // return a book
  @action returnBook = async (bookId: string) => {
    this.loadingBookAction = true;
    try{
      await BookRequest.returnBook(bookId);
      runInAction(() => {
        if(this.books !== null){
          const bookBeingReturned = this.books.find(x => x._id === bookId);
          if(bookBeingReturned){
            bookBeingReturned.isBorrowed = false;
            bookBeingReturned.copies = bookBeingReturned.copies + 1;
          }
        }
        if(this.book !== null){
          this.book.isBorrowed = false;
          this.book.copies = this.book.copies + 1;
        }

        if(this.borrowedBooks !== null){
          this.borrowedBooks = this.borrowedBooks.filter(x => x._id !== bookId);
        }

        this.user!.borrowedBooks = this.user!.borrowedBooks.filter(x => x !== bookId);
        this.loadingBookAction = false;
        toast.success("Book returned successfully")
      })
    }catch (error) {
      runInAction(() => this.loadingBookAction = false);
      toast.error("Error occurred returning book");
      throw error;
    }
  }

  // get users borrowed books
  @action getBorrowedBooks = async () => {
    this.loadingBooks = true;
    try{
      const bookData = await AuthRequest.getBorrowedBooks();
      runInAction(() => {
        this.borrowedBooks = bookData.data;
        this.loadingBooks = false;
      })
    }catch (e) {
      runInAction(() => this.loadingBooks = false);
      toast.error("Error occurred get your books");
      throw e;
    }
  }

  // logout user
  @action logout = async () => {
    this.user = null;
    localStorage.removeItem("token");
    history.push("/login");
  }
}

const storeContext = createContext(new AppStore());

export default storeContext;

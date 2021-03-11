import {IBook} from "./book";

export interface IAuthFormValues {
  email: string;
  password: string;
}

export interface IUser{
  _id: string;
  email: string;
  avatar: string;
  borrowedBooks: string[];
}

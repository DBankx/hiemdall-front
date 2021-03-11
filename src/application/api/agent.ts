import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import Cookies from "js-cookie";
import {IAuthFormValues, IUser} from "../../infrastructure/models/auth";
import {toast} from "react-toastify";
import {history} from "../../index";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

// set the token on every request
axios.interceptors.request.use((config: AxiosRequestConfig) => {
  const token =  localStorage.getItem("token");
  console.log(token);
  if(token){
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error))

//response interceptors for error handling
axios.interceptors.response.use(undefined, (error) => {
  //checks for network error by checking the message and if there is no response object
  if (error.message === 'Network Error' && !error.response) {
    toast.error('Network Error - Check your connection');
  }
  if(error.response.status === 401){
    window.localStorage.removeItem("token");
    history.push("/");
    toast.info("Authentication error! please log in again");
  }
  //redirect to notfound page for bad guids
  if (error.response.status === 404) {
    history.push('/notfound');
  }
  //redirect to notfound page for invalid id guid
  if (
    error.response.status === 400 &&
    error.response.config.method == 'get' &&
    error.response.data.errors.hasOwnProperty('id')
  ) {
    history.push('/notfound');
  }
  //send a toast notification if any response is a 500 status code
  if (error.response.status === 500) {
    toast.error('Server error - Try reloading the page');
  }
  throw error.response;
});


const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string, config?: AxiosRequestConfig) => axios.get(url, config).then(responseBody),
  post: (url: string, body?: any, config?: AxiosRequestConfig) => axios.post(url, body, config).then(responseBody),
  put: (url: string, body?: any, config?: AxiosRequestConfig) => axios.put(url, body, config).then(responseBody)
}

export const AuthRequest = {
  signUp: (values: IAuthFormValues)  => requests.post(`/signup`, values),
  login: (values: IAuthFormValues)  => requests.post(`/login`, values),
  logout: (): Promise<Record<string, unknown>> => requests.post(`/logout`),
  getCurrentUser: () => requests.get(`/user`),
  getBorrowedBooks: () => requests.get(`/users/books`)
}

export const BookRequest = {
  getAllBooks: (title: string) => requests.get(`/books`, {
    params:{title}
  }),
  getBookById: (bookId: string) => requests.get(`/books/${bookId}`),
  borrowBook: (bookId: string) => requests.put(`/books/borrow/${bookId}`),
  returnBook: (bookId: string) => requests.put(`/books/return/${bookId}`)
}

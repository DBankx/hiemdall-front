export interface IBook{
  _id: string;
  title: string;
  images: string[];
  copies: number;
  rating: number;
  publishedDate: string;
  productLink: string;
  description: string;
  pages: string;
  genre: string;
  author: string;
  isBorrowed: boolean;
}

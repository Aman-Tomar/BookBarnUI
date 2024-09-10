import { IBook } from "../book/book.models";
import { ICart } from "../cart/cart.models";

//add the interface of the book model
export interface ICartItems 
{
    cartItemId:number,
    bookId:number,
    quantity:number,
    
}
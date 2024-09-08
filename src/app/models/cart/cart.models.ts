import { ICartItems } from "../cartItems/cartItems.models";

export interface ICart{
    cartId:number,
    userId:number,
    cartItems:ICartItems[],
    isCartActive:boolean
}
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { ICart } from '../../models/cart/cart.models';
import { ICartItems } from '../../models/cartItems/cartItems.models';
import { RequestService } from '../request/request.service'; // Import the RequestService
import { IBook } from '../../models/book/book.models';

@Injectable({
  providedIn: 'root'
})
export class CartService {

    private cartApiUrl = 'https://bookbarn-cart-api-cegbg5gxf5aqhqbf.southeastasia-01.azurewebsites.net/api/cart/user'; // Replace with your CartService API URL
    private cartItemApiUrl = 'https://bookbarn-cart-api-cegbg5gxf5aqhqbf.southeastasia-01.azurewebsites.net/api/cartitem'; // Replace with your CartItem API URL

    constructor(private requestService: RequestService) {} // Inject the RequestService

    // Get cart by user ID
    getCartByUserId(): Observable<ICart> {
        return this.requestService.get<ICart>(`${this.cartApiUrl}`);
    }

    // Create a new cart
    createCart(cart: ICart): Observable<ICart> {
        return this.requestService.post<ICart>(this.cartApiUrl, cart);
    }

    addCartItem(book: IBook, userId: number): Observable<ICartItems> {
        return this.getCartByUserId().pipe(
          switchMap((cart: ICart) => {
            const existingItem = cart.cartItems.find(item => item.bookId === book.BookId);
      
            if (existingItem) {
              // If the book is already in the cart, increase the quantity
              existingItem.quantity += 1;
      
              // Update the existing cart item
              return this.updateCartItem(existingItem).pipe(
                map(() => existingItem) // Return the updated cart item
              );
            } else {
              // If the book is not in the cart, create a new cart item
              const newCartItem: Omit<ICartItems, 'cartItemId'> = {
                bookId: book.BookId,
                quantity: 1
              };
      
              return this.requestService.post<ICartItems>(this.cartItemApiUrl, newCartItem);
            }
          })
        );
    }
      

    // Remove cart item
    removeCartItem(cartItemId: number): Observable<void> {
        return this.requestService.delete<void>(`${this.cartItemApiUrl}/${cartItemId}`);
    }

    // Update cart item
    updateCartItem(cartItem: ICartItems): Observable<void> {
        console.log(cartItem)
        return this.requestService.put<void>(this.cartItemApiUrl, cartItem);
    }

    // Change cart status
    updateCartStatus(cart: ICart): Observable<void> {
        return this.requestService.put<void>(this.cartApiUrl, cart); // Assuming the cart update changes only the status
    }
}

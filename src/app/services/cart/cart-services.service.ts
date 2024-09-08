import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICart } from '../../models/cart/cart.models';
import { ICartItems } from '../../models/cartItems/cartItems.models';
import { RequestService } from '../request/request.service'; // Import the RequestService

@Injectable({
  providedIn: 'root'
})
export class CartService {

    private cartApiUrl = 'https://your-cart-api-url'; // Replace with your CartService API URL
    private cartItemApiUrl = 'https://your-cartItem-api-url'; // Replace with your CartItem API URL

    constructor(private requestService: RequestService) {} // Inject the RequestService

    // Get cart by user ID
    getCartByUserId(userId: number): Observable<ICart> {
        return this.requestService.get<ICart>(`${this.cartApiUrl}/user/${userId}`);
    }

    // Create a new cart
    createCart(cart: ICart): Observable<ICart> {
        return this.requestService.post<ICart>(this.cartApiUrl, cart);
    }

    // Add cart item
    addCartItem(cartItem: ICartItems): Observable<ICartItems> {
        return this.requestService.post<ICartItems>(this.cartItemApiUrl, cartItem);
    }

    // Remove cart item
    removeCartItem(cartItemId: number): Observable<void> {
        return this.requestService.delete<void>(`${this.cartItemApiUrl}/${cartItemId}`);
    }

    // Update cart item
    updateCartItem(cartItem: ICartItems): Observable<void> {
        return this.requestService.put<void>(this.cartItemApiUrl, cartItem);
    }

    // Change cart status
    updateCartStatus(cart: ICart): Observable<void> {
        return this.requestService.put<void>(this.cartApiUrl, cart); // Assuming the cart update changes only the status
    }
}

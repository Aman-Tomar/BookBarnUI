import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICart } from '../../models/cart/cart.models';
import { ICartItems } from '../../models/cartItems/cartItems.models';
// import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

    private cartApiUrl = ''; // Replace with your CartService API URL
    private cartItemApiUrl='add the cartItems url';
    private bookApiUrl='';

//   constructor(private http: HttpClient, private authService:AuthService ) {}//inject the auth aervice here

 
  getCartByUserId(userId:number):Observable<any>
  {
    const token=this.authService.getToken();
    return this.http.get<ICart>(`${this.cartApiUrl}/user/${userId}`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
  }

  //Create a new cart
  createCart(cart:ICart):Observable<ICart>
  {
    const token=this.authService.getToken();
    return this.http.post<ICart>(this.cartApiUrl,cart,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
  }

 
  // Add cart item
  addCartItem(cartItem: ICartItems): Observable<ICartItems> {
    const token=this.authService.getToken();
    return this.http.post<ICartItems>(this.cartItemApiUrl, cartItem,{
        headers:
        {
            Authorization:`Bearer ${token}`
        }
    });
  }

  // Remove cart item
  removeCartItem(cartItemId: number): Observable<void> {
    const token=this.authService.getToken();
    return this.http.delete<void>(`${this.cartItemApiUrl}/${cartItemId}`,{
        headers:
        {
            Authorization:`Bearer ${token}`
        }
    });
  }


  //update cartItem
  updateCartItem(cartItem:ICartItems):Observable<void>
  {
    const token=this.authService.getToken();
    return this.http.put<void>(this.cartItemApiUrl, cartItem,{
        headers:
        {
            Authorization:`Bearer ${token}`
        }
    })
  }

//   //Clearing the cart
//   clearCart(cartId: number): Observable<void> {
//     const token=this.authService.getToken();
//     return this.http.delete<void>(`${this.cartApiUrl}/${cartId}`,{
//         headers:
//         {
//             Authorization:`Bearer ${token}`
//         }

//     });
//   }


//Change it so that only the status of the cart is changed
//So update the cart






}


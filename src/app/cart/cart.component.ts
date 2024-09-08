import { Component, inject, OnInit } from '@angular/core';
import { ICart } from '../models/cart/cart.models';
import { ICartItems } from '../models/cartItems/cartItems.models';
import { CartService } from '../services/cart/cart-services.service';
import { NgFor, NgIf } from '@angular/common';
import { TokenService } from '../services/token/token.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgIf,NgFor],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit 
{
  cart:ICart|undefined;
  userId:number|null=null;
  cartItems:ICartItems[]=[];
  totalPrice:number|null=null;
private tokenService:TokenService=inject(TokenService);
private cartService:CartService=inject(CartService);

  ngOnInit(): void {
    this.userId=this.tokenService.getUserIdFromToken();
    if(this.userId)
    {
      this.loadCart();
    }
    else{
      console.error("User ID is not valid");
    }
    
  }

  loadCart(){
    if(this.userId)
    {
      this.cartService.getCartByUserId(this.userId).subscribe(
        {
          next:(cart)=>{this.cart=cart, this.cartItems=cart.cartItems,this.calculateTotalPrice()},
          error:(err:any)=>{console.error(err)}
        }
        
       
      )
    }
  }

  createNewCart() {
    const newCart: ICart = {
      cartId: 0,
      userId: this.userId!,
      cartItems: [],
      isCartActive: true,
      
    };
this.cartService.createCart(newCart).subscribe(
  {
    next:(cart:ICart)=>{this.cart=cart},
    error:(err:any)=>{console.error(err)}
  }
);
}

incrementItemQuantity(cartItemId:number) {
  const item = this.cart?.cartItems.find((item:ICartItems) => item.cartItemId === cartItemId);
  if (item) {
    item.quantity += 1;  // Increment the quantity
    this.cartService.updateCartItem(item).subscribe(
     {
      next:()=>this.calculateTotalPrice(),
      error:(err:any)=>console.error(err)
     }
    );
  } else {
    console.error(`Item with ID ${cartItemId} not found`);
  } 
}

decrementItemQuantity(cartItemId: number) {
  const item = this.cart?.cartItems.find((item: ICartItems) => item.cartItemId === cartItemId);

  if (item && item.quantity > 1) {
    item.quantity -= 1;  // Decrement the quantity

    this.cartService.updateCartItem(item).subscribe(
      {
        next:()=>{this.calculateTotalPrice()  // Recalculate the total price
        console.log(`Item ${item.cartItemId} quantity decremented successfully`)}
      ,
      error:(error) => {
        console.error(`Error decrementing item ${item.cartItemId}`, error);
      }
    }
    );
  } else {
    console.error(`Item with ID ${cartItemId} either not found or quantity is 1`);
  }
}

updateCartItem(cartItem: ICartItems) {
  this.cartService.updateCartItem(cartItem).subscribe(
     {

      next:()=>{this.calculateTotalPrice()
      console.log(`Item ${cartItem.cartItemId} updated successfully`)
    },
    error:(error) => console.error('Error updating cart item', error)
});
}

removeItem(cartItemId: number) {
  this.cartItems = this.cartItems.filter((item) => item.cartItemId !== cartItemId);
  this.cartService.removeCartItem(cartItemId).subscribe(
    {

      next:()=>{this.calculateTotalPrice()
     
    },
    error:(error) => console.error('Error updating cart item', error)
});
}

clearCart() {
  this.cartItems = [];
  this.cartService.removeCartItem(this.cart?.cartId ?? 0).subscribe(
    () => {
      this.totalPrice = 0; // Reset the total price when the cart is cleared
      console.log('Cart cleared successfully');
    },
    (error:any) => console.error('Error clearing cart', error)
  );
}

calculateTotalPrice() {
  if (this.cart) {
    this.totalPrice = this.cartItems.reduce((total, item) => {
      return total + (item.bookPrice * item.quantity); // Use book.price to calculate
    }, 0);
  }
}

}

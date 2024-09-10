import { Component, inject, OnInit } from '@angular/core';
import { ICart } from '../models/cart/cart.models';
import { ICartItems } from '../models/cartItems/cartItems.models';
import { CartService } from '../services/cart/cart-services.service';
import { NgFor, NgIf } from '@angular/common';
import { TokenService } from '../services/token/token.service';
import { FormsModule } from '@angular/forms';
import { BookService } from '../services/book/book.service';
import { IBook } from '../models/book/book.models';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgIf,NgFor,FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit 
{
  cart:ICart|undefined;
  userId:number|null=null;
  // cartItems:ICartItems[]=[];
  cartItems:Array<ICartItems &{bookDetails?:IBook}>=[];
  totalPrice:number|null=null;
  shippingAddress: string = '';  // New variable for shipping address
  selectedPaymentMethod: string = ''; 
private tokenService:TokenService=inject(TokenService);
private cartService:CartService=inject(CartService);
private bookService:BookService=inject(BookService);

  ngOnInit(): void {
   
    
      this.loadCart();
    
    // this.createDummyUser();
    
  }
  createDummyUser()
  {
    this.userId=0;
    const dummyCart:ICart={
      cartId:1,
      userId:this.userId,
      cartItems:[],
      isCartActive:true,
    }
    this.cart=dummyCart;
  }

  loadCart(){
    
      this.cartService.getCartByUserId().subscribe(
        {
          next:(cart)=>{this.cart=cart,
             this.cartItems=cart.cartItems,
             console.log("Cart loaded")
             console.log(cart)
             this.calculateTotalPrice()},
          error:(err:any)=>{console.error(err)}
        }
        
       
      )
    
  }

  loadBooksForCartItems(cartItems: ICartItems[]) {
    const bookRequests = cartItems.map(item =>
      this.bookService.getBookById(item.bookId) // Fetch book details
    );

    forkJoin(bookRequests).subscribe({
      next: (books: IBook[]) => {
        // Combine cart items with the corresponding book details
        this.cartItems = cartItems.map((item, index) => ({
          ...item,
          bookDetails: books[index]
        }));
        this.calculateTotalPrice();
      },
      error: (err: any) => { console.error('Error fetching book details', err); }
    });
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
  if (this.cart) {
    // Empty the cart items array
    this.cart.cartItems = [];

    // Call the updateCartStatus method to update the cart with empty cartItems
    this.cartService.updateCartStatus(this.cart).subscribe(
      {
        next: () => {
          this.totalPrice = 0; // Reset the total price when the cart is cleared
          console.log('Cart cleared successfully');
        },
        error: (error: any) => {
          console.error('Error clearing cart', error);
        }
      }
    );
  }
}

checkout()
{
  if (!this.shippingAddress || !this.selectedPaymentMethod) {
    console.error('Please provide a shipping address and select a payment method');
    return;
  }

  if(this.cart)
  {
    this.cart?.isCartActive!=false;
    // Call the updateCartStatus method to update the cart with empty cartItems
    this.cartService.updateCartStatus(this.cart).subscribe(
     {
       next: () => {
         this.totalPrice = 0;
         this.cartItems=[]; // Reset the total price when the cart is cleared
       
         console.log('Checkout successful, cart cleared.');

         // Further processing (e.g., redirect to a confirmation page)
         // You can store or send the shipping address and payment method here
         const orderDetails = {
           shippingAddress: this.shippingAddress,
           paymentMethod: this.selectedPaymentMethod,
           totalPrice: this.totalPrice
         };
 
         console.log('Order details:', orderDetails);
         // Optionally: Call an order service to create the order with these details
         // this.orderService.createOrder(orderDetails).subscribe();
       },
       error: (error: any) => {
         console.error('Error clearing cart', error);
       }
     }
   );
  }
 
}



calculateTotalPrice() {
  if (this.cart) {
    this.totalPrice = this.cartItems.reduce((total, item) => {
      return total + ((item.bookDetails?.Price || 0) * item.quantity); // Use book.price to calculate
    }, 0);
  }
}

}

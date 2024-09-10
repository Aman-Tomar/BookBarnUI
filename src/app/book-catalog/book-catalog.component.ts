import { Component, inject, OnInit } from '@angular/core';
import { IBook } from '../models/book/book.models';
import { NgFor } from '@angular/common';
import { BookService } from '../services/book/book.service';
import { CartService } from '../services/cart/cart-services.service';
import { TokenService } from '../services/token/token.service';
import { ICart } from '../models/cart/cart.models';

@Component({
  selector: 'app-book-catalog',
  standalone: true,
  imports: [NgFor],
  templateUrl: './book-catalog.component.html',
  styleUrl: './book-catalog.component.css'
})
export class BookCatalogComponent implements OnInit {
books:IBook[]=[];
userId:number|null=null;


private bookService:BookService=inject(BookService);
private cartService:CartService=inject(CartService);
private tokenService:TokenService=inject(TokenService);

ngOnInit(): void {
  this.userId=101
  console.log(this.userId)
  
    this.bookService.getBooks().subscribe(
      {
        next:(data)=>this.books=data,
        error:(err:any)=>console.error(err)
      }
    )
  
 
  
}
addToCart(book: IBook): void {
  if (this.userId) {
    this.cartService.getCartByUserId().subscribe({
      next: (cart: ICart) => {
        if (cart) {
          this.cartService.addCartItem(book,this.userId!).subscribe({
            next: (cartItem) => {
              // Optionally, you can update the cart items or reload the cart
              alert('Your book has been added to the cart');
            },
            error: (err: any) => console.error('Error adding book to cart', err)
          });
        } else {
          console.error('Cart not found for user');
        }
      },
      error: (err: any) => console.error('Error fetching cart', err)
    });
  } else {
    console.error('User ID is not valid');
  }
}

}

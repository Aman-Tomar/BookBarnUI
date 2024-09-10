import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBook } from '../../models/book/book.models';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http:HttpClient) { }
  apiUrl='http://localhost:3000/books';
  getBooks():Observable<IBook[]>
  {
    return this.http.get<IBook[]>(`${this.apiUrl}`)
  }

  getBookById(bookId:number):Observable<IBook>
  {
    return this.http.get<IBook>(`${this.apiUrl}/${bookId}`);
  }

}

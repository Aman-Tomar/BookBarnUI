import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Register } from '../../models/auth/register.models';
import { Login } from '../../models/auth/login.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = "https://{}/api/User"

  constructor(private http: HttpClient) { }

  register(registerData: Register) {
    return this.http.post(`${this.baseUrl}/Register`, registerData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  login(loginData: Login) {
    return this.http.post(`${this.baseUrl}/Login`, loginData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}

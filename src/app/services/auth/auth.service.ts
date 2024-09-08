import { inject, Injectable } from '@angular/core';
import { Register } from '../../models/auth/register.models';
import { Login } from '../../models/auth/login.models';
import { RequestService } from '../request/request.service';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private baseUrl = "https://bookbarn-userauth-api-gcedhuhsf6bxf7fp.southeastasia-01.azurewebsites.net/api/User"

  constructor(private requestService: RequestService, private tokenService: TokenService) {}
   
  register(registerData: Register) {
    return this.requestService.post<any>(`${this.baseUrl}/Register`, registerData);
  }

  login(loginData: Login) {
    return this.requestService.post<any>(`${this.baseUrl}/Login`, loginData);
  }
}

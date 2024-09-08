import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor() { }

  storageKey: string = 'token'

  setToken(token: string): void {
    localStorage.setItem(this.storageKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  deleteToken(): void {
    localStorage.removeItem(this.storageKey);
  }

  // Decode the JWT token to extract the user ID
  getUserIdFromToken(): number | null {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode payload from token
      return payload?.userId || null;  // Assume userId is in the payload
    }
    return null;
  }
}

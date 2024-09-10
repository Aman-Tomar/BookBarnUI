import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { Login } from '../models/auth/login.models';
import { TokenService } from '../services/token/token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private authService: AuthService,private tokenService: TokenService) {}
  
  get Email()
  {
    return this.loginForm.get("email");
  }
  
  get Password()
  {
    return this.loginForm.get("password");
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData: Login = {
        Email: this.loginForm.value.email!,
        Password: this.loginForm.value.password!
      }

      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.tokenService.setToken(response.token);
        },
        error: (err) => {
          // error
        }
      });
    }
    else {
      this.loginForm.markAllAsTouched();
    }
  }
}

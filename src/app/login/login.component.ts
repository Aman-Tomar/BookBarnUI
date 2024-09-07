import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { Login } from '../models/auth/login.models';

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

  constructor(private authService: AuthService) {}
  
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
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!
      }

      this.authService.login(loginData).subscribe({
        next: (response) => {
          // success
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

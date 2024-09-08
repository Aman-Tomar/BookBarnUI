import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Register } from '../models/auth/register.models';
import { AuthService } from '../services/auth/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]), 
    email: new FormControl('', [Validators.required, Validators.email]), 
    password: new FormControl('', [Validators.required]), 
    confirmPassword: new FormControl('', [Validators.required]), 
  });

  private authService: AuthService = inject(AuthService);

  get Name()
  {
    return this.registerForm.get("name");
  }

  get Email()
  {
    return this.registerForm.get("email");
  }

  get Password()
  {
    return this.registerForm.get("password");
  }
  
  get ConfirmPassword()
  {
    return this.registerForm.get("confirmPassword");
  }

  onSubmit() {
    if (this.registerForm.valid) {
      if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
        this.registerForm.setErrors({ passwordsMismatch: true })
      }
      else {
        const registerData: Register = {
          Username: this.registerForm.value.name!,
          Email: this.registerForm.value.email!,
          Password: this.registerForm.value.password!
        }

        this.authService.register(registerData).subscribe({
          next: (response) => {
            console.log(response);
            console.log(response.toString);
            // Success
          },
          error: (err) => {
            // Error
          }
        });
      }
    }
    else {
      this.registerForm.markAllAsTouched();
    }
  }
}

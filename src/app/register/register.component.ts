import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Register } from '../models/auth/register.models';
import { AuthService } from '../services/auth/auth.service';

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

  constructor(private authService: AuthService) {}

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
          name: this.registerForm.value.name!,
          email: this.registerForm.value.email!,
          password: this.registerForm.value.password!
        }

        this.authService.register(registerData).subscribe({
          next: (response) => {
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

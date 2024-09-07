import { Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

//Mention correct urls for routing of the pages
export const routes: Routes = [
    { path: '', component: HomeComponent, title: "BookBarn"},
    { path: 'cart', component: CartComponent, title: "Cart"},
    { path: 'register', component: RegisterComponent, title: "SignUp" },
    { path: 'login', component: LoginComponent, title: "Login" }
];

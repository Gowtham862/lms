import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { ApiService } from '../core/services/api.service';
 interface RegisterResponse {
  status: number;
  message: string;
  data: {
    user: string;
    token: string;
  };
}
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss'],

})
export class Signup {
 
  user = {
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false,
    role:"LEARNER"

  };
    message: string = '';
    showSuccess = false;
    loading = false;
      errorMessage = '';
   constructor(
    
    private authService: AuthService,
    private router: Router,
    private httpService:ApiService,
  ) {}
 
 
  passwordsMatch(): boolean {
    return this.user.password === this.user.confirmPassword;
  }
 
  // onSubmit() {
  //   console.log(this.user.firstname +"success")
  //     if (!this.user.firstname || !this.user.email || !this.user.password || !this.user.confirmPassword) {
  //     this.message = 'Please fill all fields';
  //     return;
  //   }
  //   console.log('SUBMIT CLICKED');
  //   if (this.passwordsMatch()) {
  //     this.showSuccess = true;
 
  //     setTimeout(() => {
  //       this.showSuccess = false;
  //     }, 3000);
 
  //      this.loading = true;
  //    const signupPayload = {
  //     firstname: this.user.firstname,
  //     lastname: this.user.lastname,
  //     email: this.user.email,
  //     phone: this.user.phone,
  //     password: this.user.password,
  //     role:this.user.role
  //   };
  //     this.loading=true;

  //    this.httpService.post('users/userdetails', signupPayload).subscribe({
  //     next: (res) => {
  //         this.message = 'Registration Successful! Redirecting to login...';
  //       console.log('Signup success', res);
  //       this.showSuccess = true;
  //       this.loading = false;

  //       setTimeout(() => {
  //         this.router.navigate(['/login']);
  //       }, 2000);
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       // this.errorMessage = 'Signup failed. Please try again.';
  //       this.loading = false;

  //          if (err.status === 409) {
  //         this.message = 'User with this email already exists';
  //       } else if (err.status === 400) {
  //         this.message = 'Invalid input. Please check your details';
  //       } else if (err.status === 0) {
  //         this.message = 'Unable to connect to server';
  //       } else if (err.error && err.error.message) {
  //         this.message = err.error.message;
  //       } else {
  //         this.message = 'Registration failed. Please try again';
  //       }
  //     }});
  //     // Later you can call backend API here
  //     console.log('Account Created:', this.user);
  //   }
  // }

  onSubmit() {

  console.log('SUBMIT CLICKED');

  // 🔴 Check required fields
  if (
    !this.user.firstname ||
    !this.user.email ||
    !this.user.password ||
    !this.user.confirmPassword
  ) {
    this.message = 'Please fill all fields';
    return;
  }

  // 🔴 Password match check
  if (!this.passwordsMatch()) {
    this.message = 'Passwords do not match';
    return;
  }

  // 🔴 NEW → Terms validation
  if (!this.user.terms) {
    this.message = 'Please accept Terms & Conditions';
    return;
  }

  // ✅ Proceed signup
  this.loading = true;

  const signupPayload = {
    firstname: this.user.firstname,
    lastname: this.user.lastname,
    email: this.user.email,
    phone: this.user.phone,
    password: this.user.password,
    role: this.user.role
  };

  this.httpService.post('users/userdetails', signupPayload)
    .subscribe({

      next: (res) => {

        this.message =
          'Registration Successful! Redirecting to login...';

        this.showSuccess = true;
        this.loading = false;

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },

      error: (err) => {

        this.loading = false;

        if (err.status === 409) {
          this.message = 'User with this email already exists';
        }   else if (err.status === 400) {

    if (err.error?.phone) {
      this.message = err.error.phone;
    } 
    else {
      this.message = 'Invalid input. Please check your details';
    }

  }  else if (err.status === 0) {
          this.message = 'Unable to connect to server';
        } else if (err.error?.message) {
          this.message = err.error.message;
        } else {
          this.message =
            'Registration failed. Please try again';
        }

      }

    });

}

}
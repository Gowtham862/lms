import { Login } from './../login';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ForgotpasswordService } from '../../core/services/forgotpassword/forgotpassword-service';
import { HttpClientModule } from '@angular/common/http';
interface LoginResponse {
  status: number;
  message: string;
  data: {
    email: string;
  };
}
@Component({
  selector: 'app-forgot-password',
  imports: [RouterLink,FormsModule,ReactiveFormsModule,CommonModule,RouterLink,HttpClientModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
showPassword = false;
message: string = '';
loading: boolean = false;
private emailupdate = 'useremail';
forgotemail={
  email:'',

}
 constructor(
    private forgotpasswordservice:ForgotpasswordService ,
    private router: Router
  ) {}
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  
  
  
  getemail_toupdatepassword():string| null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const user = localStorage.getItem(this.emailupdate);
      
      return localStorage.getItem(this.emailupdate);
    }
    return null;
  }
  
  onSubmit(){
    console.log('Email value:', this.forgotemail.email);

    if(!this.forgotemail.email)
    {
       this.message='email field canot be empty';
       return
    }
     const formData = new FormData();
      formData.append('mailId', this.forgotemail.email);
      console.log('Email value:', this.forgotemail.email);
     console.log(formData)
    this.loading=true;
     this.forgotpasswordservice.Forgotpassservice(this.forgotemail.email).subscribe({
      next:(res)=>{
        console.log("apihitting")
        this.loading = false;
        console.log(res)
        console.log("email",res.data);
     
        this.message = 'We have sent an email to reset your password.';
         if (res.data) {
              localStorage.setItem(this.emailupdate, res.data);
            }
            console.log(res.status)
            console.log(res.data)
        if(res.status===201)
        {
            // setTimeout(() => this.router.navigate(['/new-password']), 800);
        }
        
        
    },
    error:(err)=>{
      console.log(err)
      this.loading = false;
       if (err.status === 401) {
          this.message = 'Invalid username or password';
        } else if (err.status === 0) {
          this.message = 'Unable to connect to server';
        } else if (err.error && err.error.message) {
          this.message = err.error.message;
        } else {
          this.message = 'Login failed. Please try again';
        }
    }
  })

  
}
  }


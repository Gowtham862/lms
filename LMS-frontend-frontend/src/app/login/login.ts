import { AuthService } from './../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
interface User {
  id: string;
  token: string;
  useremail: string;
  role: string;
}
interface LoginResponse {
  status: number;
  message: string;

  data: {
    role: any;
    user: string;
    token: string;
  };
}

@Component({
  selector: 'app-login',
  standalone:true,
  imports: [RouterModule,FormsModule,CommonModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
    showPassword = false;
     loading: boolean = false;
  private userKey = 'currentUser';
  private tokenKey = 'authToken';
  private roleKey = 'role';
  private idKey = 'userId';
  private emailKey = 'useremail';
   message: string = '';
   role='';
login={
  email:'',
  password:''
}
   constructor(
    private authService: AuthService,
    private router: Router,
     private route:ActivatedRoute
  ) {}
    // ngOnInit():void{
    //   if(this.authService.isAuthenticated())
    //   {
    //     this.route.queryParams.subscribe((params:any)=>{
    //       const redirecturl=params['returnUrl']
    //       if(redirecturl)
    //       {
    //         this.router.navigate([redirecturl], { replaceUrl: true });
    //       }
    //     })
    //     const currenturl=this.router.url;
    //    if(currenturl=='/'||currenturl=='/login')
    //    {
    //      this.router.navigate(['/'], { replaceUrl: true });
    //    }
        
    //   }
    // }
onSubmit()
{
  console.log("sucess")
  if(!this.login.email||!this.login.password)
  {
    this.message="please fill in all fields"
    return;
  }


this.loading=true;
  this.authService.login(this.login.email,this.login.password).subscribe({
    next:(res)=>{
        this.loading = false;
         console.log("login successfully gowtham",res);
         console.log(res.data.role +"succes")
         console.log("kalai")
         if(res.data.role=='LEARNER')
         {
          this.router.navigate(['/landing-page'])
         }
         else if(res.data.role=='INSTRUCTOR'){
          this.router.navigate(['/dashboard-t'])
         }
         else if(res.data.role=='LMS_ADMIN'){
          this.router.navigate(['/dashboard-a'])
         }
          else if(res.data.role=='SUPERADMIN'){
          this.router.navigate(['/super-admin'])
         }
        //   else if(res.data.role=='FINANCE_ADMIN'){
        //   this.router.navigate(['/finance-dashboard'])
        //  }
          else if(res.data.role=='SALES_ADMIN'){
          this.router.navigate(['/salesAndMarketing'])
         }
          
        this.message = 'Login Successful';
        // setTimeout(() => this.router.navigate(['/dashboard-t']), 800);
        
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
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}

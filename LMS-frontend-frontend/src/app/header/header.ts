import { CommonModule } from '@angular/common';
import { Component,EventEmitter,Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { liveclass } from '../core/services/liveclass/liveclass';
import { AuthService } from '../core/services/auth.service';
export interface Course {
  courseid: string;
  trainerId: string;
  adminname:string;
  coursedesc:string;
  courseduration:string;
  coursename: string; 
  coursecategory: string;
  courselevel: string;
  certificateavalibility: string;
  noofmodule: string;
  rating: string;
  // metadata: Metadata[];
}
@Component({
  selector: 'app-header',
  standalone:true,
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

@Output() languageChange = new EventEmitter<'en' | 'ar'>();

activeLang: 'en' | 'ar' = 'en';   // default

changeLang(lang: 'en' | 'ar') {
  this.activeLang = lang;          // update UI
  this.languageChange.emit(lang);  // send to parent
}
course: Course[] = [];  
show:boolean=false;
show1:boolean=false;

constructor(private allcourse:liveclass ,private routers:Router,  private authService:AuthService,){}
ngOnInit(): void {
    this.getallcourses()
    console.log("hi")

    this.enrolledcourse()
  if(this.getuserid())
  {
    console.log("for login logout")
    this.show1=true;
  }
    console.log(this.getuserid() +"useridfetchedsucces")
  }
  mobileMenuOpen = false;
  getuserid():string{
    return localStorage.getItem('userId') ||'';
  }
   getUserName():string {
    return localStorage.getItem('currentUser') || 'User';
  }

    getallcourses(){
   this.allcourse.publishedcourses().subscribe({
    next: (res) => {
     console.log(res)

     console.log('Courses  >>>', res.data);
      this.course = res.data; 
    },

    error: (err) => {
      console.error(err);
      // alert('Trainer not found');
    }
  });
}
enrolledcourse()
  {
    console.log(this.getuserid() +"dharasan waste")
     this.allcourse.enrollecoursechec(this.getuserid()).subscribe({
      next: (res: any) => {
        console.log(res)
         console.log("payment course")
         console.log(res.data +"successfalsedharsan")
         if(res.data===true)
         {
          this.show=true;
         }

        // console.log(this.course)
      },
      error: (err: any) => {
        console.error(err);

      }
    });
  }


  // content
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMenu() {
    this.mobileMenuOpen = false;
    window.scrollTo(0, 0);
  }

  showAd = true;

  adText =
    'Big News: CAPM Course is Now Available in Arabic, Learn with Ease & Clarity.';

  timeLeft = '1 Day, 6 Hours, 49 Minutes, 27 Seconds';

  closeAd() {
    this.showAd = false;
  }

    logout() {
      this.show=false;
      this.show1=false;
    this.authService.logout();
    this.routers.navigate(['/landing-page']);
  }
}
 
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { liveclass } from '../core/services/liveclass/liveclass';
import { AuthService } from '../core/services/auth.service';
import { HttpClient } from '@angular/common/http';

export interface coursebybatch{
  batchid:string,
  batchno:string,
  coursename:string,
  coursedesc:string,
  courseid:string
}
@Component({
  selector: 'app-payment',
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class Payment {

// API
loading:boolean=false;
courseId!: string;
batchId!: string;

ngOnInit() {

  this.route.paramMap.subscribe(params => {
    this.courseId = params.get('courseId')!;
    this.batchId  = params.get('batchId')!;

    

    this.getCourseDetails();
    this.getBatchCourseDetails(); // optional
  });
 
}
 getBatchCourseDetails() {
  this.allcourse.findBatchbyid(this.batchId)
    .subscribe({
      next: (res: any) => {
        this.batchp=res.data;
        console.log('payment batch id:', res);
      },
      error: err => console.error(err)
    });


  const emails = this.getUserEmail();
  console.log(emails);

  const role = this.getUserRole();
  console.log(role);
}

  constructor(
    private route: ActivatedRoute,
    private allcourse: liveclass,
         private authService:AuthService,
      private API: HttpClient,
      private router:Router
  ) {}


getCourseDetails() {
    console.log("api is callinh")
    // console.log(this.id)
    console.log(this.courseId)
    this.allcourse.getCourseById(this.courseId).subscribe({
      next: (res: any) => {
        console.log(res)
         console.log("payment course")
        this.coursep = res.data; 
        this.loading = false;
        // console.log(this.course)
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
    getUserRole(): string {
    return this.authService.getrole() || 'USER';
  }
    getUserEmail(): string {
    return localStorage.getItem('useremail') || '';
  }
  getUserName():string {
    return localStorage.getItem('currentUser') || 'User';
  }
  getuserid():string{
    return localStorage.getItem('userId') ||'';
  }
  getuserphone():string{
    return localStorage.getItem('phonekey') ||'';

  }

  // dummy
  batchp={
    batchid:'',
    batchno:'',
    startdate:''
  }
  coursep={
      coursename:'',
      coursedesc:'',
    }
   order = {
    image: '/course.jpg',
      price: 49.80,
      tax: 10.00,
    currency: 'AED'
  };

  paymentMethod: 'card' | 'bank' | 'upi' = 'card';

  banks = [
  { id: 'hdfc', name: 'HDFC Bank' },
  { id: 'icici', name: 'ICICI Bank' },
  { id: 'sbi', name: 'State Bank of India' },
  { id: 'axis', name: 'Axis Bank' },
  { id: 'kotak', name: 'Kotak Mahindra Bank' },
  { id: 'iob',name:'Indian Overseas Bank'},
  { id: 'cb' ,name:'Canara Bank'},
  { id:'cub',name:'City Union Bank'}
];

// selected bank
selectedBank: string | null = null;

// UPI data
upiId: string = '';

  
  cardDetails = {
    name: '',
    number: '',
    expiry: '',
    cvv: '',
    save: false
  };

  get subtotal() {
    return this.order.price;
  }

  get total() {
    return this.subtotal + this.order.tax;
  }

  payNow() {
    // console.log('Order:', this.order);
    // console.log('Payment Method:', this.paymentMethod);
    // console.log('Card Details:', this.cardDetails);
      const purchasepayload={
    coursename:this.coursep.coursename,
    batchid:this.batchp.batchid,
    useremail:this.getUserEmail(),
    username:this.getUserName(),
    userid:this.getuserid(),
    courseid:this.courseId,
    batchno:this.batchp.batchno,
    batchstartdate:this.batchp.startdate,
    usercontact:this.getuserphone()     
  };
  console.log(this.coursep.coursename)
  console.log(this.coursep.coursedesc)
  console.log(this.batchp.batchid)
  console.log(this.batchp.batchno)
  console.log(this.batchp.startdate)
  console.log(this.courseId)
  console.log(this.getUserEmail())
  console.log(this.getUserName())
  console.log(this.getuserid())
  console.log(this.getuserphone())

  
    this.allcourse.savepurchase(purchasepayload).subscribe({
      next: (res: any) => {
         alert('purchased successfully' );      
         this.router.navigate(['/landing-page'])
      },
      error: (err) => {
        console.error('Error fetching courses', err);
      }
    });
  
  
  
  }


}

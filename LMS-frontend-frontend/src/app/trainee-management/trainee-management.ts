import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { liveclass } from '../core/services/liveclass/liveclass';


export interface TrainerCard {
  title: string;
  value: string | number;
  image: string;
  badgeText?: string;
  badgeType?: 'info' | 'success' | 'danger';
}

export interface Trainee {
  username: string;
  userid: string;
  coursename: string;
  enrollDate: string;
  batchstartdate: string;
  batchno: string;
  useremail: string;
  usercontact: string;
  status:string;
}
@Component({
  selector: 'app-trainee-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './trainee-management.html',
  styleUrl: './trainee-management.css',
})
export class TraineeManagement  implements OnInit{
  totalTrainees = 0;
totalActiveTrainees = 0;
totalCoursesOccupied = 0;
totalCertificatesIssued = 0;

trainees1: TrainerCard[] = [];
loadTraineeOverview() {
  this.getalldata.gettraineeoverview().subscribe({
    next: (res: any) => {
      const data = res?.data;
      if (!data) return;

      this.totalTrainees = data.totalTrainees ?? 0;
      this.totalActiveTrainees = data.totalPurchasingTrainees ?? 0;
this.totalCertificatesIssued=data.certi??0;
      this.updateCards();
    },
    error: err => console.error('Trainee overview API failed', err)
  });
}


  constructor(private getalldata:liveclass){}
  ngOnInit(): void {
    this.getalltraineedetails();
    this.loadTraineeOverview();
  }
    getalltraineedetails() {
  this.getalldata.getalluserpurchasedcourse().subscribe({
    next: (res: any) => {
      const list = res?.data || [];
      this.trainees = list;

      // 🔹 unique courses count
      const courseSet = new Set<string>();
      list.forEach((t: any) => {
        if (t.coursename) {
          courseSet.add(t.coursename);
        }
      });

      this.totalCoursesOccupied = courseSet.size;

      this.updateCards();
    },
    error: err => console.error('Trainee list API failed', err)
  });
}
updateCards() {
  this.cards = [
    {
      title: 'Total Onboarded Trainees',
      value: this.totalTrainees,
      image: 'a-course.png',
      badgeType: 'success',
    },
    {
      title: 'Total Active Trainees',
      value: this.totalActiveTrainees,
      image: 'a-course.png',
      badgeType: 'success',
    },
    {
      title: 'Total Courses Occupied',
      value: this.totalCoursesOccupied,
      image: 'a-cert.png',
      badgeType: 'info',
    },
    {
      title: 'Overall Certificates Issued',
      value: this.totalCertificatesIssued, // keep 0 or wire later
      image: 'a-atten.png',
    },
  ];
}

   
  cards: TrainerCard[] = [
    // {
    //   title: 'Total Onboarded Trainees',
    //   value: 250,
    //   image: 'a-course.png',
    //   badgeType: 'success',
    // },
    // {
    //   title: 'Total Active Trainees',
    //   value: 200,
    //   image: 'a-course.png',
    //   badgeType: 'success',
    // },
    // {
    //   title: 'Total Courses Occupied',
    //   value: 25,
    //   image: 'a-cert.png',
    //   badgeType: 'info',
    // },
   
    // {
    //   title: 'Overall Certificates Issued',
    //   value: 249,
    //   image: 'a-atten.png',
    // },
  ];

  searchText = '';

  pageSize = 10;
  currentPage = 1;

  trainees: Trainee[] = [
    // {
    //   traineeName: 'Dharshan',
    //   traineeId: '1234',
    //   enrolledCourse: 'CAPM® - Arabic Course',
    //   enrolledDate: '01-01-2026',
    //   batchStartDate: '11-01-2026',
    //   batchNo: 2,
    //   email: 'abc@gmail.com',
    //   contact: 9876543210,
    //   status: 'Active'
    // },
    // {
    //   traineeName: 'Dharshan',
    //   traineeId: '1234',
    //   enrolledCourse: 'CAPM® - Arabic Course',
    //   enrolledDate: '01-01-2026',
    //   batchStartDate: '11-01-2026',
    //   batchNo: 2,
    //   email: 'abc@gmail.com',
    //   contact: 9876543210,
    //   status: 'Deactivated'
    // },
    // {
    //   traineeName: 'Dharshan',
    //   traineeId: '1234',
    //   enrolledCourse: 'CAPM® - Arabic Course',
    //   enrolledDate: '01-01-2026',
    //   batchStartDate: '11-01-2026',
    //   batchNo: 2,
    //   email: 'abc@gmail.com',
    //   contact: 9876543210,
    //   status: 'Active'
    // },
    // {
    //   traineeName: 'Dharshan',
    //   traineeId: '1234',
    //   enrolledCourse: 'CAPM® - Arabic Course',
    //   enrolledDate: '01-01-2026',
    //   batchStartDate: '11-01-2026',
    //   batchNo: 2,
    //   email: 'abc@gmail.com',
    //   contact: 9876543210,
    //   status: 'Deactivated'
    // },
    // {
    //   traineeName: 'Dharshan',
    //   traineeId: '1234',
    //   enrolledCourse: 'CAPM® - Arabic Course',
    //   enrolledDate: '01-01-2026',
    //   batchStartDate: '11-01-2026',
    //   batchNo: 2,
    //   email: 'abc@gmail.com',
    //   contact: 9876543210,
    //   status: 'Active'
    // },
    // {
    //   traineeName: 'Dharshan',
    //   traineeId: '1234',
    //   enrolledCourse: 'CAPM® - Arabic Course',
    //   enrolledDate: '01-01-2026',
    //   batchStartDate: '11-01-2026',
    //   batchNo: 2,
    //   email: 'abc@gmail.com',
    //   contact: 9876543210,
    //   status: 'Active'
    // },
    // {
    //   traineeName: 'Dharshan',
    //   traineeId: '1234',
    //   enrolledCourse: 'CAPM® - Arabic Course',
    //   enrolledDate: '01-01-2026',
    //   batchStartDate: '11-01-2026',
    //   batchNo: 2,
    //   email: 'abc@gmail.com',
    //   contact: 9876543210,
    //   status: 'Deactivated'
    // },
    // {
    //   traineeName: 'Dharshan',
    //   traineeId: '1234',
    //   enrolledCourse: 'CAPM® - Arabic Course',
    //   enrolledDate: '01-01-2026',
    //   batchStartDate: '11-01-2026',
    //   batchNo: 2,
    //   email: 'abc@gmail.com',
    //   contact: 9876543210,
    //   status: 'Active'
    // },
    // {
    //   traineeName: 'Dharshan',
    //   traineeId: '1234',
    //   enrolledCourse: 'CAPM® - Arabic Course',
    //   enrolledDate: '01-01-2026',
    //   batchStartDate: '11-01-2026',
    //   batchNo: 2,
    //   email: 'abc@gmail.com',
    //   contact: 9876543210,
    //   status: 'Active'
    // },
    // {
    //   traineeName: 'Dharshan',
    //   traineeId: '1234',
    //   enrolledCourse: 'CAPM® - Arabic Course',
    //   enrolledDate: '01-01-2026',
    //   batchStartDate: '11-01-2026',
    //   batchNo: 2,
    //   email: 'abc@gmail.com',
    //   contact: 9876543210,
    //   status: 'Active'
    // },
    // {
    //   traineeName: 'Dharshan',
    //   traineeId: '1234',
    //   enrolledCourse: 'CAPM® - Arabic Course',
    //   enrolledDate: '01-01-2026',
    //   batchStartDate: '11-01-2026',
    //   batchNo: 2,
    //   email: 'abc@gmail.com',
    //   contact: 9876543210,
    //   status: 'Active'
    // },
  ];

  // get filteredTrainees(): Trainee[] {
  //   return this.trainees.filter(t =>
  //     t.username.toLowerCase().includes(this.searchText.toLowerCase()) ||
  //     t.userid.includes(this.searchText)
  //   );
  // }
get filteredTrainees(): Trainee[] {
  const search = this.searchText?.toLowerCase().trim();
  if (!search) return this.trainees;

  return this.trainees.filter(t =>
    Object.values(t).some(val =>
      String(val).toLowerCase().includes(search)
    )
  );
}
  // get paginatedTrainers(): Trainee[] {
  //   const start = (this.currentPage - 1) * this.pageSize;
  //   return this.filteredTrainees.slice(start, start + this.pageSize);
  // }

  // get totalPages(): number {
  //   return Math.ceil(this.filteredTrainees.length / this.pageSize);
  // }

  changePageSize(event: Event) {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.currentPage = 1;
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  // nextPage() {
  //   if (this.currentPage < this.totalPages) this.currentPage++;
  // }

  editTrainer(trainee: Trainee) {
    console.log('Edit trainee:', trainee);
    // router.navigate(['/edit-trainee', trainee.traineeId]);
  }

}

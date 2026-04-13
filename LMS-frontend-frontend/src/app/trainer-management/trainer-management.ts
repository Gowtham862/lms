import { environment } from './../../environments/environment';
import { CommonModule, formatCurrency } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TrainerService } from './trainer-service';
import { Router } from '@angular/router';
import { liveclass } from '../core/services/liveclass/liveclass';


export interface TrainerCard {
  title: string;
  value: string | number;
  image: string;
  badgeText?: string;
  badgeType?: 'info' | 'success' | 'danger';
}
// export interface Trainer {
//   adminid: string;
//   trainerid: string;
//   trainername: string;
//   personalemailid: string;
//   contactnumber: string;
//   dateofbirth: string;
//   address: string;
//   state: string;
//   city: string;
//   loginemail: string;
//   temporaraypassword: string;
//   areoferperience: string;
//   yearofexperience: string;
//   qualification: string;
//   languageknown: string;
//   attachresume: string;
//   assignedcourse: string;
//   assignedcourseid: string;
//   courselevel: string;
//   trainerstatus: string;
//   role: string;
//   abouttrainer: string;
// }
// export interface Trainer {
//   profile: string;
//   name: string;
//   trainerId: string;
//   course: string;
//   email: string;
//   onboardDate: string;
//   level: string;
//   status: 'Active' | 'Deactivated';
// }
export interface Trainer {
  file: string;               
  trainername: string;
  trainerid: string;
  assignedcourse: string;
  loginemail: string;
  dateofbirth: string;
   onboarddate: string;
  courselevel: string;
  trainerstatus: 'Active' | 'Deactivate' ;
}

@Component({
  selector: 'app-trainer-management',
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './trainer-management.html',
  styleUrl: './trainer-management.css',
})
export class TrainerManagement {
  baseUrl = environment.trainerimage;

  trainers: Trainer[] = [];

   constructor(private trainerService: TrainerService, private liveService: liveclass,
     private router: Router
     
   ) {}

   ngOnInit() {
    this.loadTrainers();
    this.loadTrainerStats();
  }

loadTrainerStats() {
  this.liveService.gettrainerdetails().subscribe({
    next: (res: any) => {
      const data = res?.data;
      if (!data) return;

      this.cards = [
        {
          title: 'Total Onboarded Trainers',
          value: data.totalTrainers ?? 0,
          image: 'a-course.png',
          badgeType: 'success',
        },
        {
          title: 'Total Active Trainers',
          value: data.activeTrainers ?? 0,
          image: 'a-course.png',
          badgeType: 'success',
        },
        {
          title: 'Total Courses Occupied',
          value: data.courseoccupied ?? 0,
          image: 'a-cert.png',
          badgeType: 'info',
        },
        {
          title: 'Total Sessions Completed',
          value: data.sessioncomplete ?? 0,
          image: 'a-atten.png',
        },
      ];
    },
    error: (err: any) => {
      console.error('Trainer stats API failed', err);
    }
  });
}

cards: TrainerCard[] = [
   
    // {
    //   title: 'Avg Trainer Ratings',
    //   value: '8.7/10',
    //   badgeText:'↓ 3% from December',
    //   badgeType:'danger',
    //   image: 'a-atten.png',
    // },
  //   {
  //     title: 'Total Sessions Completed',
  //     value: 147,
  //     image: 'a-atten.png',
  //   },
  ];

  searchText = '';

  pageSize = 10;
  currentPage = 1;


  get filteredTrainers(): Trainer[] {
    return this.trainers.filter(t =>
      t.trainername.toLowerCase().includes(this.searchText.toLowerCase()) ||
      t.trainerid.includes(this.searchText)
    );
  }

  getAllTrainers() {
    return this.trainerService.GetTrainers().subscribe((res:any)=>{
      console.log('Trainers fetched:', res);
      this.trainers = res;
    }
    );
  }

loadTrainers() {
  this.trainerService.GetTrainers().subscribe({
    next: (res: any) => {
      const backendTrainers = res.data || [];

      this.trainers = backendTrainers.map((t: any) => {
        // 🔹 pick first image from metadata
        const imageMeta = t.metadata?.find(
          (m: any) => m.mimeType?.startsWith('image/')
        );

        const imageUrl = imageMeta
          ? this.baseUrl + imageMeta.filePath.replace(/\\/g, '/')
          : 'assets/user.jpg'; // fallback image

        return {
          file: imageUrl,
          trainername: t.trainername,
          trainerid: String(t.trainerid),
          // assignedcourse: t.assignedcourse || 'NA',
          loginemail: t.loginemail,
          dateofbirth: t.dateofbirth,
          courselevel: t.courselevel,
          onboarddate: t.onboarddate 
  ? new Date(t.onboarddate).toLocaleDateString('en-GB')  
  : '-',
          trainerstatus:
  t.trainerstatus === 'Active'
    ? 'Active'
    : t.trainerstatus === 'On Hold'
    ? 'InActivate'
    : t.trainerstatus === 'Deactivated'
    ? 'Deactivated'
    : 'Unknown',
        };
      });
    },
    error: err => console.error(err)
  });
}


  get paginatedTrainers(): Trainer[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredTrainers.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredTrainers.length / this.pageSize);
  }

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

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

 editTrainer(trainer: Trainer) {
  // console.log('Edit trainer:', trainer);
  // this.router.navigate(['/edit-trainer', trainer.trainerid]);

  console.log('Edit trainer:', trainer);

  this.router.navigate(['/edit-trainer'], {
    state: { trainerId: trainer.trainerid }
  });
}


}

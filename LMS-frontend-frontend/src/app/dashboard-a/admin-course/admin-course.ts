import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild,} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Chart } from 'chart.js';
import { liveclass } from '../../core/services/liveclass/liveclass';


export interface DashboardCard {
  title: string;
  value: string | number;
  image: string;
}
  export interface TraineeAttendance {
  courseName: string;
  courseId: number;
  totalTrainers: number;
  totalBatches: number;
  totalSessions: number;
  totalTrainees: number;
  completionRate: number;
}

@Component({
  selector: 'app-admin-course',
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './admin-course.html',
  styleUrl: './admin-course.css',
})
export class AdminCourse {

constructor(private liveService: liveclass) {}
ngOnInit(): void {
  this.loadCourseCounts();
  this.loadCourseOverviewTable();
}
loadCourseCounts() {
  this.liveService.getcoursedetails().subscribe({
    next: (res: any) => {
      const data = res?.data;

      if (!data) return;

      this.cards = [
        {
          title: 'Total Courses',
          value: data.totalCourses ?? 0,
          image: 'a-course.png',
        },
        {
          title: 'Total Published Courses',
          value: data.publishedCourses ?? 0,
          image: 'a-course.png',
        },
        {
          title: 'Total Sessions Completed',
          value: data.sessioncount ?? 0, 
          image: 'a-atten.png',
        },
        {
          title: 'Overall Certificates Issued',
          value: data.totalcertificate ?? 0, 
          image: 'a-atten.png',
        },
      ];
    },
    error: err => {
      console.error('Course count API failed', err);
    }
  });
}
loadCourseOverviewTable() {
  this.liveService.getcourseoverview().subscribe({
    next: (res: any) => {
      const courses = res?.data || [];

      this.attendanceTable = courses.map((c: any) => {
        // 🔹 completionRate is optional – backend not sending it
        // using simple logic for now (can be replaced later)
        const completionRate =
          c.totalTrainees > 0
            ? Math.round((c.totalTrainees / c.totalTrainees) * 100)
            : 0;

        return {
          courseName: c.courseName,
          courseId: c.courseId,
          totalTrainers: c.totalTrainers,
          totalBatches: c.totalBatches,
          totalSessions: c.totalSessions,
          totalTrainees: c.totalTrainees,
          completionRate
        };
      });
    },
    error: err => {
      console.error('Course overview API failed', err);
    }
  });
}


cards: DashboardCard[] = [];

attendanceTable: TraineeAttendance[] = [];


courseStatus = {
  labels: ['Published', 'Unpublished', 'Archived'],
  values: [22, 6, 2],
  total: 30
};

// loadCourseStatusChart() {
//   new Chart(this.courseStatusChart.nativeElement, {
//     type: 'doughnut',
//     data: {
//       labels: this.courseStatus.labels,
//       datasets: [{
//         data: this.courseStatus.values,
//         backgroundColor: ['#052c6f', '#5c5f8a', '#9aa0c7'],
//         borderWidth: 0
//       }]
//     },
//     options: {
//       cutout: '70%',
//       plugins: {
//         legend: { display: false }
//       }
//     }
//   });
// }
// loadQuizPerformanceChart() {
//   new Chart(this.quizPerformanceChart.nativeElement, {
//     type: 'bar',
//     data: {
//       labels: this.quizPerformance.labels,
//       datasets: [{
//         label: 'Quiz & Assessment %',
//         data: this.quizPerformance.values,
//         backgroundColor: '#052c6f',
//         barThickness: 45
//       }]
//     },
//     options: {
//       plugins: {
//         legend: { position: 'bottom' }
//       },
//       scales: {
//         y: {
//           beginAtZero: true,
//           max: 100,
//           grid: { color: '#eef2f7' },
//           title: {
//             display: true,
//             text: 'Trainee Count'
//           }
//         },
//         x: {
//           grid: { display: false }
//         }
//       }
//     }
//   });
// }


// quizPerformance = {
//   labels: ['30-44%', '45-64%', '65-79%', '80-89%', '>90%'],
//   values: [20, 34, 88, 83, 11]
// };
// ngAfterViewInit() {
//   this.loadCourseStatusChart();
//   this.loadQuizPerformanceChart();
// }
// ================= PAGINATION LOGIC =================

// Pagination state
pageSize = 10;
currentPage = 1;

// Computed total pages
get totalPages(): number {
  return Math.ceil(this.attendanceTable.length / this.pageSize);
}

// Data to show in table (IMPORTANT)
get paginatedData() {
  const start = (this.currentPage - 1) * this.pageSize;
  const end = start + this.pageSize;
  return this.attendanceTable.slice(start, end);
}

// Change rows per page
changePageSize(event: Event) {
  const value = (event.target as HTMLSelectElement).value;
  this.pageSize = Number(value);
  this.currentPage = 1; // reset to first page
}

// Go to specific page
goToPage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
  }
}

// Prev / Next
prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
  }
}
}


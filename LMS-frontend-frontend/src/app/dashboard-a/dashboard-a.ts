import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { liveclass } from '../core/services/liveclass/liveclass';

Chart.register(...registerables);

export interface DashboardCard {
  title: string;
  value: string | number;
  image: string;
  badgeText?: string;
  badgeType?: 'info' | 'success' | 'danger';
}
  export interface TraineeAttendance {
  traineeName: string;
  studentId: string;
  courseName: string;
  batchNo: number;
  sessionsAttended: number;
  lastPresentDate: string;
  attendancePercent: number;
  status: 'Risk' | 'Average' | 'Good';
}


@Component({
  selector: 'app-dashboard-a',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './dashboard-a.html',
  styleUrls: ['./dashboard-a.css']
})

export class DashboardA {
  totalEnrolled = 0;
totalActive = 0;
completedCourses = 0;
certificatesIssued = 0;
completed=0;
certi=0;


  constructor(private liveService: liveclass) {}

  @ViewChild('traineeOverviewChart') traineeOverviewChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('attendanceChart') attendanceChart!: ElementRef<HTMLCanvasElement>;

  getAttendanceStatus(percent: number): 'Risk' | 'Average' | 'Good' {
  if (percent < 75) return 'Risk';
  if (percent < 80) return 'Average';
  return 'Good';
}
loadTraineeAttendance() {
  this.liveService.getCertificateIssuance().subscribe({
    next: (res: any) => {
      const batches = res?.batches || [];

      this.completedCourses = 0;
      this.certificatesIssued = 0;
      this.attendanceTable = [];

      batches.forEach((batch: any) => {
        if (batch.courseCompleted) {
          this.completedCourses++;
        }

        batch.students?.forEach((stu: any) => {
          if (stu.certificateEligible) {
            this.certificatesIssued++;
          }

          const percent = Math.round(stu.attendancePercentage || 0);

          this.attendanceTable.push({
            traineeName: stu.name,
            studentId: String(stu.studentId),
            courseName: batch.coursename,
            batchNo: Number(batch.batchNo),
            sessionsAttended: stu.attendedSessions,
            lastPresentDate: '-',
            attendancePercent: percent,
            status: this.getAttendanceStatus(percent),
          });
        });
      });

      this.updateCards(); // ✅ now works
    },
    error: err => console.error('Trainee attendance API failed', err)
  });
}

updateCards() {
  this.cards = [
    {
      title: 'Total Enrolled Trainees',
      value: this.totalEnrolled,
      image: 'a-course.png',
      badgeType: 'success',
    },
    {
      title: 'Total Active Trainees',
      value: this.totalActive,
      image: 'a-course.png',
      badgeType: 'success',
    },
    {
      title: 'Total Courses Completed',
      value: this.completed,
      image: 'a-cert.png',
      badgeType: 'info',
    },
    {
      title: 'Overall Certificates Issued',
      value: this.certi,
      image: 'a-atten.png',
    },
  ];
}


ngOnInit(): void {
  this.loadTraineeOverview();
  this.loadTraineeAttendance();
}

loadTraineeOverview() {
  this.liveService.gettraineeoverview().subscribe({
    next: (res: any) => {
      const data = res?.data;
      if (!data) return;

      this.totalEnrolled = data.totalTrainees ?? 0;
      this.totalActive = data.totalPurchasingTrainees ?? 0;
      this.completed=data.completedcourses??0;
      this.certi=data.certi??0;

      this.updateCards();
    },
    error: err => console.error('Trainee overview API failed', err)
  });
}


  cards: DashboardCard[] = [];

  // traineeOverview = {
  //   labels: ['Total Trainees', 'Active Trainees', 'Inactive Trainees'],
  //   values: [100, 75, 25]
  // };

  // attendance = {
  //   labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
  //   values: [75, 79, 63, 97, 82]
  // };

  // ngAfterViewInit() {
  //   this.loadTraineeOverviewChart();
  //   this.loadAttendanceChart();
  // }

  // loadTraineeOverviewChart() {
  //   new Chart(this.traineeOverviewChart.nativeElement, {   
  //     type: 'bar',
  //     data: {
  //       labels: this.traineeOverview.labels,
  //       datasets: [{
  //         data: this.traineeOverview.values,
  //         backgroundColor: ['#062a66', '#5c5f8a', '#8b8fc2'],
  //         borderRadius: 6,
  //         barThickness: 20
  //       }]
  //     },
  //     options: {
  //       indexAxis: 'y',
  //       plugins: { legend: { display: false } },
  //       scales: {
  //         x: { beginAtZero: true, max: 100, grid: { color: '#eef2f7' } },
  //         y: { grid: { display: false } }
  //       }
  //     }
  //   });
  // }

  // loadAttendanceChart() {
  //   new Chart(this.attendanceChart.nativeElement, {   
  //     type: 'line',
  //     data: {
  //       labels: this.attendance.labels,
  //       datasets: [{
  //         data: this.attendance.values,
  //         label: 'Trainee Attendance %',
  //         fill: true,
  //         backgroundColor: 'rgba(6,42,102,0.1)',
  //         borderColor: '#062a66',
  //         tension: 0.4,
  //         pointRadius: 5,
  //         pointBackgroundColor: '#062a66'
  //       }]
  //     },
  //     options: {
  //       plugins: { legend: { position: 'bottom' } },
  //       scales: {
  //         y: { beginAtZero: true, max: 125, grid: { color: '#eef2f7' } },
  //         x: { grid: { display: false } }
  //       }
  //     }
  //   });
  // }

attendanceTable: TraineeAttendance[] = [];
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

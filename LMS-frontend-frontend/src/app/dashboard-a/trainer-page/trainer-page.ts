import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { RouterLink } from "@angular/router";
import { liveclass } from '../../core/services/liveclass/liveclass';

Chart.register(...registerables);

export interface DashboardCard {
  title: string;
  value: string | number;
  image: string;
  badgeText?: string;
  badgeType?: 'info' | 'success' | 'danger';
}
export interface TrainerAttendance {
  trainerName: string;
  trainerId : string;
  totalCourses: number;
  totalBatches: number;
  sessionsAttended: number;
}

@Component({
  selector: 'app-trainer-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './trainer-page.html',
  styleUrl: './trainer-page.css',
})
export class TrainerPage implements AfterViewInit {

  constructor(private liveService: liveclass) {}
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
  this.loadTrainerAttendance();
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
          title: 'Total Session Completed',
          value: data.sessioncomplete ?? 0, 
          image: 'a-atten.png',
        },
      ];
    },
    error: err => {
      console.error('Trainer stats API failed', err);
    }
  });
}
attendanceTable: TrainerAttendance[] = [];

loadTrainerAttendance() {
  this.liveService.gettrainersummary().subscribe({
    next: (res: any[]) => {
      this.attendanceTable = res.map(trainer => {
        const sessionsAttended = trainer.totalSessions;
        const totalSessions = trainer.totalSessions || 1;

        const attendancePercent = Math.round(
          (sessionsAttended / totalSessions) * 100
        );

        return {
          trainerName: trainer.trainerName,
          trainerId: String(trainer.trainerId),
          totalCourses: trainer.totalCourses,
          totalBatches: trainer.totalBatches,
          sessionsAttended,
        };
      });
    },
    error: err => {
      console.error('Trainer summary API failed', err);
    }
  });
}


cards: DashboardCard[] = [];

  traineeOverview = {
    labels: ['Total Trainers', 'Active Trainers', 'Inactive Trainers'],
    values: [100, 75, 25]
  };

  attendance = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    values: [75, 79, 63, 97, 82]
  };

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
  //         label: 'Trainer Attendance %',
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
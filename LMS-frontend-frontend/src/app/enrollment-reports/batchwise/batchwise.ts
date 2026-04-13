import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
export interface DashboardCard {
  title: string;
  value: string | number;
  image: string;
}

export interface BatchEnrollment {
  courseName: string;
  batchName: string;
  trainerName: string;
  capacity: number;
  enrolled: number;
  available: number;
  status: 'Completed' | 'Active' | 'Upcoming';
  selected?: boolean;
}
@Component({
  selector: 'app-batchwise',
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './batchwise.html',
  styleUrl: './batchwise.css',
})
export class Batchwise {
cards: DashboardCard[] = [
    {
      title: 'Total Batches',
      value: 70,
      image: 'a-course.png',
    },
    {
      title: 'Total Seats Available',
      value: 280,
      image: 'a-course.png',
    },
    {
      title: 'Total Students Enrolled',
      value: 250,
      image: 'a-cert.png',
    },
    {
      title: 'Total Seats Vacant',
      value: '30',
      image: 'a-atten.png',
    },
  ];

  pageSize = 10;
  currentPage = 1;

  batches: BatchEnrollment[] = [
    {   
    courseName: 'CAPM® - Arabic Course',
    batchName: `Batch 1`,
    trainerName: 'Thariq A',
    capacity: 20,
    enrolled: 10,
    available: 10,
    status: 'Active',
    selected: false
  },
  {   
    courseName: 'CAPM® - Arabic Course',
    batchName: `Batch 1`,
    trainerName: 'Thariq A',
    capacity: 20,
    enrolled: 10,
    available: 10,
    status: 'Active',
    selected: false
  },
  {   
    courseName: 'CAPM® - Arabic Course',
    batchName: `Batch 1`,
    trainerName: 'Thariq A',
    capacity: 20,
    enrolled: 10,
    available: 10,
    status: 'Active',
    selected: false
  },
  {   
    courseName: 'CAPM® - Arabic Course',
    batchName: `Batch 1`,
    trainerName: 'Thariq A',
    capacity: 20,
    enrolled: 10,
    available: 10,
    status: 'Active',
    selected: false
  },
  {   
    courseName: 'CAPM® - Arabic Course',
    batchName: `Batch 1`,
    trainerName: 'Thariq A',
    capacity: 20,
    enrolled: 10,
    available: 10,
    status: 'Upcoming',
    selected: false
  },
  {   
    courseName: 'CAPM® - Arabic Course',
    batchName: `Batch 1`,
    trainerName: 'Thariq A',
    capacity: 20,
    enrolled: 10,
    available: 10,
    status: 'Active',
    selected: false
  },
  {   
    courseName: 'CAPM® - Arabic Course',
    batchName: `Batch 1`,
    trainerName: 'Thariq A',
    capacity: 20,
    enrolled: 10,
    available: 10,
    status: 'Completed',
    selected: false
  },
];

  get paginatedBatches() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.batches.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.batches.length / this.pageSize);
  }

  toggleAll(event: any) {
    this.paginatedBatches.forEach(b => b.selected = event.target.checked);
  }

  changePageSize(event: any) {
    this.pageSize = +event.target.value;
    this.currentPage = 1;
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  exportReport() {
    const selected = this.batches.filter(b => b.selected);
    console.log('Exporting Batch Data:', selected.length ? selected : this.batches);
  }
}

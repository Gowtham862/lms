import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
export interface DashboardCard {
  title: string;
  value: string | number;
  image: string;
}
export interface StudentEnrollment {
  studentName: string;
  courseName: string;
  enrollmentDate: string;
  registration: 'Pending' | 'Completed';
  payment: 'Pending' | 'Completed';
  batchStatus: 'Pending' | 'Assigned';
  pendingDuration: string;
  finalStatus: 'Pending' | 'Active';
}
@Component({
  selector: 'app-studentwise',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './studentwise.html',
  styleUrl: './studentwise.css',
})
export class Studentwise {
cards: DashboardCard[] = [
    {
      title: 'Total Students Enrolled',
      value: 100,
      image: 'a-course.png',
    },
    {
      title: 'Payment Pending',
      value: 20,
      image: 'a-course.png',
    },
    {
      title: 'Batch Allocation Pending',
      value: 20,
      image: 'a-cert.png',
    },
    {
      title: 'Total Students Active',
      value: 60,
      image: 'a-atten.png',
    },
  ];
   pageSize = 10;
  currentPage = 1;

  /* STUDENT DATA */
  students: StudentEnrollment[] = [
    {
      studentName: 'Yaqoob Y',
      courseName: 'CAPM® - Arabic Course',
      enrollmentDate: '19-01-2026',
      registration: 'Pending',
      payment: 'Pending',
      batchStatus: 'Pending',
      pendingDuration: '3 Days',
      finalStatus: 'Pending'
    },
    {
      studentName: 'Yaqoob Y',
      courseName: 'CAPM® - Arabic Course',
      enrollmentDate: '19-01-2026',
      registration: 'Pending',
      payment: 'Pending',
      batchStatus: 'Pending',
      pendingDuration: '1 Days',
      finalStatus: 'Pending'
    },
    {
      studentName: 'Yaqoob Y',
      courseName: 'CAPM® - Arabic Course',
      enrollmentDate: '19-01-2026',
      registration: 'Completed',
      payment: 'Pending',
      batchStatus: 'Pending',
      pendingDuration: '2 Days',
      finalStatus: 'Pending'
    },
    {
      studentName: 'Yaqoob Y',
      courseName: 'CAPM® - Arabic Course',
      enrollmentDate: '19-01-2026',
      registration: 'Completed',
      payment: 'Completed',
      batchStatus: 'Assigned',
      pendingDuration: 'NA',
      finalStatus: 'Active'
    },
    {
      studentName: 'Yaqoob Y',
      courseName: 'CAPM® - Arabic Course',
      enrollmentDate: '19-01-2026',
      registration: 'Completed',
      payment: 'Completed',
      batchStatus: 'Assigned',
      pendingDuration: 'NA',
      finalStatus: 'Active'
    }
  ];

  /* PAGINATED DATA */
  get paginatedStudents(): StudentEnrollment[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.students.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.students.length / this.pageSize);
  }

  /* PAGINATION CONTROLS */
  goToPage(page: number) {
    this.currentPage = page;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  changePageSize(event: any) {
    this.pageSize = +event.target.value;
    this.currentPage = 1;
  }

  exportReport() {
    console.log('Exporting Student Enrollment Report');
    console.table(this.students);
  }
}

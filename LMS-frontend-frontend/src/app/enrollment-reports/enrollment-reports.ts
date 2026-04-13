import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

export interface DashboardCard {
  title: string;
  value: string | number;
  image: string;
}

export interface CourseEnrollment {
  courseName: string;
  category: string;
  totalEnrollments: number;
  active: number;
  completed: number;
  cancelled: number;
  revenue: string;
  selected?: boolean;
}

@Component({
  selector: 'app-enrollment-reports',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './enrollment-reports.html',
  styleUrl: './enrollment-reports.css',
})
export class EnrollmentReports {

  /* DASHBOARD CARDS */
  cards: DashboardCard[] = [
    { title: 'Total Courses', value: 45, image: 'a-course.png' },
    { title: 'Total Students Enrolled', value: 500, image: 'a-course.png' },
    { title: 'Total Students Completed Courses', value: 450, image: 'a-cert.png' },
    { title: 'Total Revenue Generated', value: '25,50,000 AED', image: 'a-atten.png' },
  ];

  /* PAGINATION */
  pageSize = 10;
  currentPage = 1;

  /* ✅ INDIVIDUAL COURSE DATA (NO ARRAY.FILL / MAP) */
  courses: CourseEnrollment[] = [
    {
      courseName: 'CAPM® - Arabic Course',
      category: 'Arabic',
      totalEnrollments: 122,
      active: 100,
      completed: 112,
      cancelled: 10,
      revenue: '50,000 AED',
      selected: false
    },
    {
      courseName: 'PMP® - English Course',
      category: 'English',
      totalEnrollments: 95,
      active: 80,
      completed: 70,
      cancelled: 15,
      revenue: '75,000 AED',
      selected: false
    },
    {
      courseName: 'Prince2® - Arabic Course',
      category: 'Arabic',
      totalEnrollments: 60,
      active: 50,
      completed: 45,
      cancelled: 5,
      revenue: '30,000 AED',
      selected: false
    },
    {
      courseName: 'ITIL® - Online Course',
      category: 'Online',
      totalEnrollments: 140,
      active: 120,
      completed: 110,
      cancelled: 20,
      revenue: '90,000 AED',
      selected: false
    },
    {
      courseName: 'Scrum Master®',
      category: 'Agile',
      totalEnrollments: 80,
      active: 65,
      completed: 60,
      cancelled: 5,
      revenue: '40,000 AED',
      selected: false
    },

    // 👉 add more objects if needed
  ];

  /* PAGINATED DATA */
  get paginatedCourses(): CourseEnrollment[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.courses.slice(start, end);
  }

  /* TOTAL PAGES (DYNAMIC) */
  get totalPages(): number {
    return Math.ceil(this.courses.length / this.pageSize);
  }

  /* PAGE SIZE CHANGE */
  changePageSize(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.pageSize = Number(value);
    this.currentPage = 1;
  }

  /* GO TO PAGE */
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  /* NEXT PAGE */
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  /* PREVIOUS PAGE */
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  /* SELECT ALL (CURRENT PAGE ONLY – CORRECT BEHAVIOR) */
  toggleAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.paginatedCourses.forEach(course => {
      course.selected = checked;
    });
  }

  /* EXPORT */
  exportReport() {
    const selectedCourses = this.courses.filter(c => c.selected);
    console.log(
      'Exporting Courses:',
      selectedCourses.length ? selectedCourses : this.courses
    );
  }
}

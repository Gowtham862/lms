import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface DashboardCard {
  title: string;
  value: string | number;
  image: string;
}
export interface QuizEvaluation {
  quizName: string;
  courseName: string;
  moduleNo: number;
  batch: number;
  trainer: string;
  studentsAppeared: number;
  avgScore: number;
  passFail: string;
  status: 'Completed' | 'Ongoing';
}
@Component({
  selector: 'app-quiz-performance-dashboard',
  imports: [CommonModule,FormsModule],
  templateUrl: './quiz-performance-dashboard.html',
  styleUrl: './quiz-performance-dashboard.css',
})
export class QuizPerformanceDashboard {
cards: DashboardCard[] = [
    {
      title: 'Total Quizzes Conducted',
      value: 100,
      image: 'a-course.png',
    },
    {
      title: 'Avg Quiz Score',
      value: 80,
      image: 'a-course.png',
    },
    {
      title: 'Pass Percentage',
      value: '80%',
      image: 'a-cert.png',
    },
    {
      title: 'Fail Percentage',
      value: '20%',
      image: 'a-atten.png',
    },
    {
      title: 'Pending Evaluation',
      value: 11,
      image: 'a-atten.png',
    },
  ];
  searchText = '';
  pageSize = 10;
  currentPage = 1;

  quizList: QuizEvaluation[] = [
    {
      quizName: 'Module 1',
      courseName: 'CAPM® - Arabic Course',
      moduleNo: 1,
      batch: 2,
      trainer: 'Thariq A',
      studentsAppeared: 15,
      avgScore: 88,
      passFail: '10:5',
      status: 'Completed'
    },
    {
      quizName: 'Module 2',
      courseName: 'CAPM® - Arabic Course',
      moduleNo: 1,
      batch: 2,
      trainer: 'Thariq A',
      studentsAppeared: 18,
      avgScore: 80,
      passFail: '12:6',
      status: 'Ongoing'
    }
  ];

  // duplicate data for demo
  allQuizzes = Array(10).fill(null).flatMap(() => this.quizList);

  get filteredQuizzes() {
    return this.allQuizzes.filter(q =>
      q.quizName.toLowerCase().includes(this.searchText.toLowerCase()) ||
      q.courseName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  get paginatedQuizzes() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredQuizzes.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredQuizzes.length / this.pageSize);
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

  viewDetails(row: QuizEvaluation) {
    console.log('View quiz details:', row);
  }
  
  showQuizModal = false;
selectedQuiz: any = null;

studentSearch = '';


students = [
  {
    name: 'Yaqoob Y',
    dueDate: '05-01-2026',
    attendedDate: '02-01-2026',
    score: 85,
    result: 'Pass',
    status: 'Completed'
  },
  {
    name: 'Yaqoob Y',
    dueDate: '05-01-2026',
    attendedDate: '02-01-2026',
    score: 85,
    result: 'Pass',
    status: 'Completed'
  },
  {
    name: 'Yaqoob Y',
    dueDate: '05-01-2026',
    attendedDate: '02-01-2026',
    score: 85,
    result: 'Pass',
    status: 'Completed'
  },
  {
    name: 'Yaqoob Y',
    dueDate: '05-01-2026',
    attendedDate: '02-01-2026',
    score: 85,
    result: 'Pass',
    status: 'Completed'
  },
  {
    name: 'Yaqoob Y',
    dueDate: '05-01-2026',
    attendedDate: '02-01-2026',
    score: 85,
    result: 'Pass',
    status: 'Completed'
  },
  {
    name: 'Yaqoob Y',
    dueDate: '05-01-2026',
    attendedDate: '02-01-2026',
    score: 85,
    result: 'Pass',
    status: 'Completed'
  },
  {
    name: 'Yaqoob Y',
    dueDate: '05-01-2026',
    attendedDate: '02-01-2026',
    score: 40,
    result: 'Fail',
    status: 'Completed'
  },
  {
    name: 'Yaqoob Y',
    dueDate: '05-01-2026',
    attendedDate: '—',
    score: null,
    result: 'Fail',
    status: 'Due Date Missed'
  }
];

get filteredStudents() {
  return this.students.filter(s =>
    s.name.toLowerCase().includes(this.studentSearch.toLowerCase())
  );
}

viewDetail(row: any) {
  this.selectedQuiz = row;
  this.showQuizModal = true;
}

closeModal() {
  this.showQuizModal = false;
  this.studentSearch = '';
}

}

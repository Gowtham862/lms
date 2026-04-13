
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { quizservice } from '../core/services/quiz/quizservice';



@Component({
  selector: 'app-quiz',
  standalone:true,
  imports: [CommonModule,RouterModule],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz  {
  activeTab: 'course-1' | 'course-2'  = 'course-1';


moduleQuizOverview = [
  {
    moduleName: 'Module 1',
    createdBy: 'Leasie Watson',
    startDate: '26-12-2025',
    endDate: '28-12-2025',
    completedDate: '27-12-2025',
    score: 100
  },
  {
    moduleName: 'Module 2',
    createdBy: 'Leasie Watson',
    startDate: '26-12-2025',
    endDate: '28-12-2025',
    completedDate: '27-12-2025',
    score: 60
  },
  {
    moduleName: 'Module 3',
    createdBy: 'Leasie Watson',
    startDate: '26-12-2025',
    endDate: '28-12-2025',
    completedDate: '27-12-2025',
    score: 42
  }
  , {
    moduleName: 'Module 3',
    createdBy: 'Leasie Watson',
    startDate: '26-12-2025',
    endDate: '28-12-2025',
    completedDate: '27-12-2025',
    score: 42
  }
];

// Upcoming Quizzes
upcomingQuizzes = [
  {
    day: '28',
    month: 'Dec',
    title: 'CAPM® Certification > Module 4',
    timer: '01:23:17',
    questions: 20,
    duration: '1:00hrs',
    active: true
  },
  {
    day: '30',
    month: 'Dec',
    title: 'CAPM® Certification > Module 5',
    timer: '27:23:17',
    questions: 20,
    duration: '1:00hrs',
    active: false
  }
];


}

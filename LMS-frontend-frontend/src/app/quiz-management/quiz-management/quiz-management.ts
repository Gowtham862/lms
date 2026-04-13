import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CreateQuiz } from "./create-quiz/create-quiz";

@Component({
  selector: 'app-quiz-management',
  standalone:true,
  imports: [CommonModule, CreateQuiz],
  templateUrl: './quiz-management.html',
  styleUrl: './quiz-management.css',
})
export class QuizManagement {
activeCourse = 1;

  courses = [
    { id: 1, name: 'CAPM® Certification Training 1' },
    { id: 2, name: 'CAPM® Certification Training 2' }
  ];

  completedModules = [
    {
      title: 'CAPM® - Arabic Course - Module 1 Batch 1',
      date: '01-01-2026',
    },
    {
      title: 'CAPM® - Arabic Course - Module 1 Batch 2',
      date: '01-01-2026',
    },
    {
      title: 'CAPM® - Arabic Course - Module 1 Batch 3',
      date: '01-01-2026',
    }
  ];

  quizStats = [
    {
      batch: 'CAPM® - Arabic Course - Module 1 Batch 1',
      created: '01-01-2026',
      last: '04-01-2026',
      total: 12,
      completed: 6,
      pending: 6,
      percent: 50
    },
    {
      batch: 'CAPM® - Arabic Course - Module 1 Batch 2',
      created: '01-01-2026',
      last: '04-01-2026',
      total: 12,
      completed: 8,
      pending: 4,
      percent: 75
    },
    {
      batch: 'CAPM® - Arabic Course - Module 1 Batch 2',
      created: '01-01-2026',
      last: '04-01-2026',
      total: 12,
      completed: 8,
      pending: 2,
      percent: 90
    }
  ];
  showCreateQuiz = false;

openCreateQuiz() {
  this.showCreateQuiz = true;
}

closeCreateQuiz() {
  this.showCreateQuiz = false;
}

}

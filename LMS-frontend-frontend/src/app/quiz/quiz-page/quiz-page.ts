import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { quizservice } from '../../core/services/quiz/quizservice';

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}
 interface Quizdata {
 question:string;
answers: answers[];
descriptions:string;
}
 interface answers {
  text: string;
  correct: boolean;
 
}
@Component({
  selector: 'app-quiz-page',
  standalone:true,
  imports: [CommonModule,FormsModule, RouterModule],
  templateUrl: './quiz-page.html',
  styleUrl: './quiz-page.scss',
})
export class QuizPage implements OnInit {
  qui: Quizdata[] = [];
  loading = true;
  error = '';
    constructor(private quizser:quizservice){}
    ngOnInit(): void {

    this.quiz()
    
  }

  totalQuestions = 20;
  timeLeft = '00:59:42';

  
 quiz()
{
         this.quizser.getquiz().subscribe({
         next:(res:any)=>{
         this.qui = res.data;
         this.loading = false;
         console.log(res);
           },
          error:(err)=>{
         this.error = 'Failed to load quiz';
         this.loading = false;
     
    }
  })
  
}
 ///mock data use for testing
  data= [
    {
      id: '1',
      question: 'Which data type is used to store true or false values in Java?',
      answers: [
        { text: 'int', correct: false },
        { text: 'String', correct: false },
        { text: 'boolean', correct: true },
        { text: 'char', correct: false }
      ],
      descriptions: 'This question checks your understanding of basic Java data types used for conditional logic.'
    },
    {
      id: '2',
      question: 'Which HTTP method is commonly used to create a new resource in a REST API?',
      answers: [
        { text: 'GET', correct: false },
        { text: 'POST', correct: true },
        { text: 'PUT', correct: false },
        { text: 'DELETE', correct: false }
      ],
      descriptions: 'This question tests your knowledge of RESTful web services and HTTP methods.'
    },
    {
      id: '3',
      question: 'Which keyword is used to inherit a class in Java?',
      answers: [
        { text: 'implements', correct: false },
        { text: 'extends', correct: true },
        { text: 'inherits', correct: false },
        { text: 'super', correct: false }
      ],
      descriptions: 'This question checks your understanding of inheritance in Java.'
    },
    {
      id: '4',
      question: 'Which annotation is used to create a REST controller in Spring Boot?',
      answers: [
        { text: '@Controller', correct: false },
        { text: '@RestController', correct: true },
        { text: '@Service', correct: false },
        { text: '@Repository', correct: false }
      ],
      descriptions: 'This question tests your knowledge of Spring Boot REST annotations.'
    },
    {
      id: '5',
      question: 'Which collection does not allow duplicate values in Java?',
      answers: [
        { text: 'List', correct: false },
        { text: 'ArrayList', correct: false },
        { text: 'Set', correct: true },
        { text: 'Map', correct: false }
      ],
      descriptions: 'This question checks your understanding of Java collections.'
    },
     {
      id: '5',
      question: 'Which collection does not allow duplicate values in Java?',
      answers: [
        { text: 'List', correct: false },
        { text: 'ArrayList', correct: false },
        { text: 'Set', correct: true },
        { text: 'Map', correct: false }
      ],
      descriptions: 'This question checks your understanding of Java collections.'
    }
    ];
  

  currentIndex = 0;
  selectedAnswers: { [key: number]: string } = {};

  get currentQuestion() {
    return this.qui?.[this.currentIndex];
    //  return this.data.length > 0 ? this.qui[this.currentIndex] : null;
  }
  nextQuestion() {

    if (!this.selectedAnswers[this.currentIndex]) {
      //use toaster here
    alert('Please select an answer');
    return;
  }
  if (this.currentIndex < this.qui.length - 1) {
    this.currentIndex++;
    }
  }
  prevQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
  selectAnswer(answer: string) {
    this.selectedAnswers[this.currentIndex] = answer;
  }

  submitQuiz() {
    console.log('Selected Answers:', this.selectedAnswers);
  }
getQuestionStatus(index: number): string {
  if (index === this.currentIndex) {
    return 'current';
  }

  if (this.selectedAnswers[index]) {
    return 'answered';
  }

  if (index < this.currentIndex && !this.selectedAnswers[index]) {
    return 'not-answered';
  }

  return 'pending';
}
}

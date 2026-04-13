import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizPerformanceDashboard } from './quiz-performance-dashboard';

describe('QuizPerformanceDashboard', () => {
  let component: QuizPerformanceDashboard;
  let fixture: ComponentFixture<QuizPerformanceDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizPerformanceDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizPerformanceDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCompletion } from './course-completion';

describe('CourseCompletion', () => {
  let component: CourseCompletion;
  let fixture: ComponentFixture<CourseCompletion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseCompletion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseCompletion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

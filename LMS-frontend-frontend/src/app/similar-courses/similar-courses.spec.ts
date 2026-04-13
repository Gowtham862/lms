import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimilarCourses } from './similar-courses';

describe('SimilarCourses', () => {
  let component: SimilarCourses;
  let fixture: ComponentFixture<SimilarCourses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimilarCourses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimilarCourses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

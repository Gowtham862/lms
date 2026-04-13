import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCourse } from './admin-course';

describe('AdminCourse', () => {
  let component: AdminCourse;
  let fixture: ComponentFixture<AdminCourse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCourse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCourse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

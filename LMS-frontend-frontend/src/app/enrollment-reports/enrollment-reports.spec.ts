import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentReports } from './enrollment-reports';

describe('EnrollmentReports', () => {
  let component: EnrollmentReports;
  let fixture: ComponentFixture<EnrollmentReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

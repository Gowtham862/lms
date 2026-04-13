import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionAttendance } from './session-attendance';

describe('SessionAttendance', () => {
  let component: SessionAttendance;
  let fixture: ComponentFixture<SessionAttendance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionAttendance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionAttendance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraineeManagement } from './trainee-management';

describe('TraineeManagement', () => {
  let component: TraineeManagement;
  let fixture: ComponentFixture<TraineeManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraineeManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraineeManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrainer } from './add-trainer';

describe('AddTrainer', () => {
  let component: AddTrainer;
  let fixture: ComponentFixture<AddTrainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTrainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTrainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

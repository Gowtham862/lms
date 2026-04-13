import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTrainer } from './edit-trainer';

describe('EditTrainer', () => {
  let component: EditTrainer;
  let fixture: ComponentFixture<EditTrainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTrainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTrainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

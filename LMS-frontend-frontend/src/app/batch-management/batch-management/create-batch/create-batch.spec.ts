import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBatch } from './create-batch';

describe('CreateBatch', () => {
  let component: CreateBatch;
  let fixture: ComponentFixture<CreateBatch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBatch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBatch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

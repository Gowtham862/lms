import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchManagement } from './batch-management';

describe('BatchManagement', () => {
  let component: BatchManagement;
  let fixture: ComponentFixture<BatchManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

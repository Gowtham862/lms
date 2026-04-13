import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateBatch } from './activate-batch';

describe('ActivateBatch', () => {
  let component: ActivateBatch;
  let fixture: ComponentFixture<ActivateBatch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivateBatch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivateBatch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

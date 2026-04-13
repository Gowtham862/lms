import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Batchwise } from './batchwise';

describe('Batchwise', () => {
  let component: Batchwise;
  let fixture: ComponentFixture<Batchwise>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Batchwise]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Batchwise);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

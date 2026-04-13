import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Studentwise } from './studentwise';

describe('Studentwise', () => {
  let component: Studentwise;
  let fixture: ComponentFixture<Studentwise>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Studentwise]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Studentwise);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

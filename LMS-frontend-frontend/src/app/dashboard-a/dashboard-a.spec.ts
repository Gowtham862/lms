import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardA } from './dashboard-a';

describe('DashboardA', () => {
  let component: DashboardA;
  let fixture: ComponentFixture<DashboardA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardT } from './dashboard-t';

describe('DashboardT', () => {
  let component: DashboardT;
  let fixture: ComponentFixture<DashboardT>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardT]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardT);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

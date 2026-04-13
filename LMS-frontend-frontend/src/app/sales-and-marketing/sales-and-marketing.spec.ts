import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesAndMarketing } from './sales-and-marketing';

describe('SalesAndMarketing', () => {
  let component: SalesAndMarketing;
  let fixture: ComponentFixture<SalesAndMarketing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesAndMarketing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesAndMarketing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

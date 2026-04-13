import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModules } from './add-modules';

describe('AddModules', () => {
  let component: AddModules;
  let fixture: ComponentFixture<AddModules>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddModules]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddModules);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

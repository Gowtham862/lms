import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleCompletion } from './module-completion';

describe('ModuleCompletion', () => {
  let component: ModuleCompletion;
  let fixture: ComponentFixture<ModuleCompletion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleCompletion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleCompletion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

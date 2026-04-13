import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchesTimeline } from './batches-timeline';

describe('BatchesTimeline', () => {
  let component: BatchesTimeline;
  let fixture: ComponentFixture<BatchesTimeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchesTimeline]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchesTimeline);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


import { liveclass } from './liveclass';
import { TestBed } from '@angular/core/testing';



describe('Course', () => {
  let service: liveclass;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(liveclass);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

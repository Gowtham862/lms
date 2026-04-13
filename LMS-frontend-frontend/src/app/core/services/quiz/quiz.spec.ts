import { TestBed } from '@angular/core/testing';

import { quizservice } from './quizservice';

describe('Quiz', () => {
  let service: quizservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(quizservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

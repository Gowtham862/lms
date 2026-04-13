import { TestBed } from '@angular/core/testing';

import { CoursePageService } from './course-page-service';

describe('CoursePageService', () => {
  let service: CoursePageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoursePageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

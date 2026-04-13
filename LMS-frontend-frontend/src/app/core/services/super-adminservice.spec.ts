import { TestBed } from '@angular/core/testing';

import { SuperAdminservice } from './super-adminservice';

describe('SuperAdminservice', () => {
  let service: SuperAdminservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuperAdminservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

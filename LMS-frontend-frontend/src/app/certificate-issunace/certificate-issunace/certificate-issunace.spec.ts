import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateIssunace } from './certificate-issunace';

describe('CertificateIssunace', () => {
  let component: CertificateIssunace;
  let fixture: ComponentFixture<CertificateIssunace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificateIssunace]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificateIssunace);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

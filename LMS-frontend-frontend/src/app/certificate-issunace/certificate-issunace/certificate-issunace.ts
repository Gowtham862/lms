import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { liveclass } from '../../core/services/liveclass/liveclass';
import { HttpClient, HttpParams } from '@angular/common/http';
export interface DashboardCard {
  title: string;
  value: string | number;
  image: string;
}
 
@Component({
  selector: 'app-certificate-issunace',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './certificate-issunace.html',
  styleUrl: './certificate-issunace.scss',
})
export class CertificateIssunace implements OnInit{
rejectReason = '';
rejectRemarks = '';
   
     totalStudents: number = 0;
    //  rejectedcertficate='';
    records: any[] = [];
  cards: DashboardCard[] = [];
 
  certi=0;
   rejectedcertficate=0;
  constructor(private service: liveclass) {}
 
  ngOnInit(): void {
    this.loadCertificateIssuance();
    this.loadTraineeOverview()
  }
 
 loadCertificateIssuance() {
 
  this.service.getCertificateIssuance().subscribe({
    next: (res: any) => {
      console.log(res);
 
      const batches = res?.batches || [];
     
      this.records = batches.flatMap((batch: any) =>
        (batch.students || [])
          // .filter((student: any) => !student.alreadyCertified) // 
          .map((student: any) => ({
            userid: student.studentId,
            student: student.name,
            course: batch.coursename,
            courseid: Number(batch.courseId),
            batch: batch.batchNo,
            trainer: batch.trainername,
            attendance: student.attendancePercentage,
            eligible: student.certificateEligible,
         status: student.alreadyCertified
  ? 'Issued'
  : student.alreadyRejected
    ? 'Rejected'
    : student.attendancePercentage >= 60
      ? 'Action'
      : 'Pending'
          }))
      );
 
     
      this.totalStudents = batches.reduce(
        (acc: number, batch: any) =>
          acc +
          (batch.students?.filter((s: any) => !s.alreadyCertified).length || 0),
        0
      );
 
      this.updateCards();
    },
 
    error: (err) => {
      console.error('Certificate Issuance API error', err);
    }
  });
}
loadTraineeOverview() {
  this.service.gettraineeoverview().subscribe({
    next: (res: any) => {
      const data = res?.data;
      if (!data) return;
 
      this.certi=data.certi??0;
      this.rejectedcertficate=data.certificatereject??0;
      this.updateCards()
 
    },
    error: err => console.error('Trainee overview API failed', err)
  });
}
 
  // ===== TAB STATE =====
  activeTab: 'active' | 'completed' = 'active';
 
  setTab(tab: 'active' | 'completed') {
    this.activeTab = tab;
  }
 
  // ===== CARDS =====
  // cards: DashboardCard[] = [
  //   { title: 'Total Certificate Issued', value: 90, image: 'a-course.png' },
  //   // { title: 'Certificates Pending Approval', value: 22, image: 'a-course.png' },
  //   { title: 'Total Eligible Students Awaiting Review', value: this.totalStudents, image: 'a-atten.png' },
  //   // { title: 'Coursewise Completion Rate', value: 18, image: 'a-atten.png' },
  // ];
 
  attendanceClass(value: number) {
    if (value >= 80) return 'green';
    if (value >= 60) return 'orange';
    return 'red';
  }
 
  quizClass(value: number) {
    if (value >= 85) return 'green';
    if (value >= 70) return 'orange';
    return 'red';
  }
 
  // completion verification
   selectedCourse = 'CAPM® - Arabic Course - Beginner';
 
  courses = [
    'CAPM® - Arabic Course - Beginner',
    'CAPM® - English Course - Beginner',
  ];
 
  records1 = [
    {
      course: 'CAPM® - Arabic Course',
      batch: 1,
      trainer: 'Thariq A',
      total: 20,
      eligible: 20,
      attendance: 90,
      quiz: 88,
      completion: 100,
    },
    {
      course: 'CAPM® - Arabic Course',
      batch: 2,
      trainer: 'Thariq A',
      total: 20,
      eligible: 20,
      attendance: 90,
      quiz: 88,
      completion: 100,
    },
    {
      course: 'CAPM® - Arabic Course',
      batch: 3,
      trainer: 'Thariq A',
      total: 20,
      eligible: 20,
      attendance: 90,
      quiz: 88,
      completion: 100,
    },
    {
      course: 'CAPM® - Arabic Course',
      batch: 4,
      trainer: 'Thariq A',
      total: 20,
      eligible: 20,
      attendance: 90,
      quiz: 88,
      completion: 100,
    },
    {
      course: 'CAPM® - Arabic Course',
      batch: 5,
      trainer: 'Thariq A',
      total: 20,
      eligible: 20,
      attendance: 90,
      quiz: 88,
      completion: 100,
    },
  ];
 
  // records for view details
 
  showDetails = false;
  selectedRow: any;
 
  records2 = [
    {
      course: 'CAPM® - Arabic Course - Beginner',
      batch: 1,
      trainer: 'Thariq A',
      quiz: 88,
    }
  ];
 
  openDetails(row: any) {
    this.selectedRow = row;
    this.showDetails = true;
  }
 
  closeDetails() {
    this.showDetails = false;
    this.selectedRow = null;
  }
 
  // ===== ISSUE MODAL =====
showIssueModal = false;
showRejectModal = false;
// selectedRow: any = null;
 
openIssueModal(row: any) {
  this.selectedRow = row;
  this.showIssueModal = true;
}
 
openRejectModal(row: any) {
  this.selectedRow = row;
  this.showRejectModal = true;
}
closeIssueModal() {
  this.showIssueModal = false;
  this.selectedRow = null;
}
 
closeRejectModal() {
  this.showRejectModal = false;
  this.selectedRow = null;
    this.rejectReason = '';    
  this.rejectRemarks = '';
}
// issueCertificate(row: any) {
//   const payload = {
//     userId: row.userId,          
//     userName: row.student,
//     courseName: row.course
//   };
 
//   console.log('Issuing certificate with payload:', payload);
 
//   this.service.issueCertificate(payload).subscribe({
//     next: (res: any) => {
//       console.log('Certificate issued successfully', res);
 
//       //  update UI after success
//       row.status = 'Issued';
//     },
//     error: (err) => {
//       console.error('Issue certificate failed', err);
//     }
//   });
// }
  updateCards() {
    this.cards = [
     
      { title: 'Total Students', value: this.totalStudents, image: 'a-atten.png', },
       { title: 'Total Certificate Issued', value: this.certi, image: 'a-course.png', },
            { title: 'Total Certificate Rejected', value: this.rejectedcertficate, image: 'a-atten.png', },
 
    ];
  }
 
confirmIssueCertificate() {
  if (!this.selectedRow) {
    console.error('No row selected');
    return;
  }
 
  if (!this.selectedRow.courseid) {
    console.error('Course ID missing for certificate issue', this.selectedRow.courseid);
    alert('Course ID is missing. Cannot issue certificate.');
    return;
  }
 
  const payload = {
    userid: Number(this.selectedRow.userid),
    username: this.selectedRow.student,
    coursename: this.selectedRow.course,
    courseid: Number(this.selectedRow.courseid)
  };
 
  console.log('Issuing certificate payload:', payload);
 
  this.service.issueCertificate(payload).subscribe({
    next: (res: any) => {
      console.log('Certificate issued successfully', res);
 
      // update UI
      this.selectedRow.status = 'Issued';
 
      // close modal
      this.closeIssueModal();
    },
    error: (err) => {
      console.error('Issue certificate failed', err);
    }
  });
}
 
 
confirmRejectCertificate() {
  if (!this.selectedRow) {
    console.error('No row selected');
    return;
  }
 
  if (!this.selectedRow.courseid) {
    console.error('Course ID missing for certificate reject', this.selectedRow.courseid);
    alert('Course ID is missing. Cannot reject certificate.');
    return;
  }
 
  if (!this.rejectReason) {
    alert('Please select a reason');
    return;
  }
 
  const payload = {
    userid: Number(this.selectedRow.userid),
    username: this.selectedRow.student,
    coursename: this.selectedRow.course,
    courseid: Number(this.selectedRow.courseid)
  };
 
  console.log('Rejecting certificate payload:', payload);
 
  this.service.reject(payload).subscribe({  
    next: (res: any) => {
      console.log('Certificate rejected successfully', res);
 
 
      this.selectedRow.status = 'Rejected';
 
      // close modal
      this.closeRejectModal();
    },
    error: (err) => {
      console.error('Reject certificate failed', err);
    }
  });
}
 
 
}
 
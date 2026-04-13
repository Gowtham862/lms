import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { liveclass } from '../core/services/liveclass/liveclass';

interface Student {
  name: string;
  studentId: string;
  email: string;
  batch: string;
  enrollmentDate: string;
  attendance: number;
  status: 'Active' | 'Inactive';
}

interface AttendanceStudent {
  name: string;
  studentId: string;
  batch: string;
  sessionAttended: number;
  totalSessions: number;
  attendancePercent: number;
  attendanceStatus: 'Good' | 'Average' | 'Low';
  lastAttendedSession: string;
}
interface QuizStudent {
  name: string;
  studentId: string;
  quizName: string;
  attempts: number;
  completionDate: string;
  score: number | null;  
  result: 'Pass' | 'Fail' | 'NA';
  evaluationStatus: 'Evaluated' | 'Pending' | 'NA';
}

interface CourseCompletionStudent {
  name: string;
  studentId: string;
  courseCompletionStatus: 'Completed' | 'In Progress';
  eligibilityStatus: 'Eligible' | 'Not Eligible';
  reason: string | 'NA';
  certificateStatus: 'Approved' | 'Pending' | 'NA';
  certificateIssueDate: string | 'NA';
  trainerApproval: 'Approved' | 'Pending' | 'NA';
}

interface PurchasedStudent {
  studentId: number;
  name: string;
  attendedSessions: number;
  attendancePercentage: number;
  certificateEligible: boolean;
  courseId: number;
  batchId: number;
}

interface PurchasedBatch {
  courseId: number;
  batchId: number;
  batchNo: string;
  coursename: string;
  trainername: string;
  trainerid: number;
  courseCompleted: boolean;
  totalSessions: number;
  students: PurchasedStudent[];
}

interface PurchasedCourse {
  courseId: number;
  coursename: string;
  batches: PurchasedBatch[];
}

@Component({
  selector: 'app-student-management',
  imports: [FormsModule,CommonModule],
  templateUrl: './student-management.html',
  styleUrl: './student-management.css',
})
export class StudentManagement implements OnInit{

  constructor(private liveService: liveclass) {}
coursesMap: PurchasedCourse[] = [];

selectedCourseId!: number;
selectedBatchId!: number;

attendanceStudents: AttendanceStudent[] = [];
completionStudents: CourseCompletionStudent[] = [];
loadCoursesAndBatches() {
  const trainerId = String(this.getuserid());

  this.liveService.getindividualtrainer(trainerId).subscribe({
    next: (res: any) => {
      const batches: PurchasedBatch[] = res.batches || [];

      //  group by course
      const map = new Map<number, PurchasedCourse>();

      batches.forEach(batch => {
        if (!map.has(batch.courseId)) {
          map.set(batch.courseId, {
            courseId: batch.courseId,
            coursename: batch.coursename,
            batches: []
          });
        }
        map.get(batch.courseId)!.batches.push(batch);
      });

      this.coursesMap = Array.from(map.values());

      // default selection
      if (this.coursesMap.length) {
        this.selectedCourseId = this.coursesMap[0].courseId;
        this.selectedBatchId = this.coursesMap[0].batches[0].batchId;
      }

      this.mapAttendance();
      this.mapCompletion();
    },
    error: err => console.error(err)
  });
}
selectBatch(batchId: number) {
  this.selectedBatchId = batchId;
  this.mapAttendance();
  this.mapCompletion();
}
 activeTab: 'overview' | 'attendance'= 'attendance';
 activeTab1: 'course-1' | 'course-2' = 'course-1';
 activeTab2: 'batch-1' | 'batch-2' | 'batch-3' = 'batch-1';

   searchText = '';

   ngOnInit() {
  this.loadAttendanceFromApi();
  this.loadCoursesAndBatches();
}
loadAttendanceFromApi() {
  this.liveService.getCertificateIssuance().subscribe({
    next: (res: any) => {
      const batches = res.batches || [];

      this.attendanceStudents = [];

      batches.forEach((batch: any) => {
        const totalSessions = batch.totalSessions || 0;

        batch.students?.forEach((stu: any) => {
          const percent = Math.round(stu.attendancePercentage || 0);

          this.attendanceStudents.push({
            name: stu.name,
            studentId: String(stu.studentId),
            batch: `Batch ${batch.batchNo}`,
            sessionAttended: stu.attendedSessions,
            totalSessions,
            attendancePercent: percent,
            attendanceStatus: this.getAttendanceStatus(percent),
            lastAttendedSession: '-' // backend doesn’t send this
          });
        });
      });
    },
    error: err => {
      console.error('Attendance API error', err);
    }
  });
}
selectCourse(course: PurchasedCourse) {
  this.selectedCourseId = course.courseId;
  this.selectedBatchId = course.batches[0].batchId;

  this.mapAttendance();
  this.mapCompletion();
}
mapAttendance() {
  this.attendanceStudents = [];

  const course = this.coursesMap.find(
    c => c.courseId === this.selectedCourseId
  );
  const batch = course?.batches.find(
    b => b.batchId === this.selectedBatchId
  );

  if (!batch) return;

  batch.students.forEach(stu => {
    const percent = Math.min(100, Math.round(stu.attendancePercentage));

    this.attendanceStudents.push({
      name: stu.name,
      studentId: String(stu.studentId),
      batch: `Batch ${batch.batchNo}`,
      sessionAttended: stu.attendedSessions,
      totalSessions: batch.totalSessions,
      attendancePercent: percent,
      attendanceStatus: this.getAttendanceStatus(percent),
      lastAttendedSession: '-'
    });
  });
}
mapCompletion() {
  this.completionStudents = [];

  const course = this.coursesMap.find(
    c => c.courseId === this.selectedCourseId
  );
  const batch = course?.batches.find(
    b => b.batchId === this.selectedBatchId
  );

  if (!batch) return;

  batch.students.forEach(stu => {
    const eligible = stu.certificateEligible;

    this.completionStudents.push({
      name: stu.name,
      studentId: String(stu.studentId),
      courseCompletionStatus: batch.courseCompleted ? 'Completed' : 'In Progress',
      eligibilityStatus: eligible ? 'Eligible' : 'Not Eligible',
      reason: eligible ? 'NA' : 'Low Attendance',
      certificateStatus: eligible ? 'Pending' : 'NA',
      certificateIssueDate: 'NA',
      trainerApproval: eligible ? 'Pending' : 'NA'
    });
  });
}
get selectedBatches(): PurchasedBatch[] {
  const course = this.coursesMap.find(
    c => c.courseId === this.selectedCourseId
  );
  return course ? course.batches : [];
}
getAttendanceStatus(percent: number): 'Good' | 'Average' | 'Low' {
  if (percent < 50) return 'Low';
  if (percent < 75) return 'Average';
  return 'Good';
}
  // students: Student[] = [
  //   {
  //     name: 'Abishek M',
  //     studentId: '301245',
  //     email: 'abishek@gmail.com',
  //     batch: 'Batch 1',
  //     enrollmentDate: '26-12-2025',
  //     attendance: 40,
  //     status: 'Active'
  //   },
  //   {
  //     name: 'Abishek M',
  //     studentId: '301245',
  //     email: 'abishek@gmail.com',
  //     batch: 'Batch 1',
  //     enrollmentDate: '26-12-2025',
  //     attendance: 40,
  //     status: 'Active'
  //   },
  //  {
  //     name: 'Abishek M',
  //     studentId: '301245',
  //     email: 'abishek@gmail.com',
  //     batch: 'Batch 1',
  //     enrollmentDate: '26-12-2025',
  //     attendance: 40,
  //     status: 'Active'
  //   },
  //      {
  //     name: 'Abishek M',
  //     studentId: '301245',
  //     email: 'abishek@gmail.com',
  //     batch: 'Batch 1',
  //     enrollmentDate: '26-12-2025',
  //     attendance: 40,
  //     status: 'Active'
  //   },
  //      {
  //     name: 'Abishek M',
  //     studentId: '301245',
  //     email: 'abishek@gmail.com',
  //     batch: 'Batch 1',
  //     enrollmentDate: '26-12-2025',
  //     attendance: 40,
  //     status: 'Active'
  //   },
  //      {
  //     name: 'Abishek M',
  //     studentId: '301245',
  //     email: 'abishek@gmail.com',
  //     batch: 'Batch 1',
  //     enrollmentDate: '26-12-2025',
  //     attendance: 40,
  //     status: 'Active'
  //   },
  //      {
  //     name: 'Abishek M',
  //     studentId: '301245',
  //     email: 'abishek@gmail.com',
  //     batch: 'Batch 1',
  //     enrollmentDate: '26-12-2025',
  //     attendance: 40,
  //     status: 'Active'
  //   },
  //      {
  //     name: 'Abishek M',
  //     studentId: '301245',
  //     email: 'abishek@gmail.com',
  //     batch: 'Batch 1',
  //     enrollmentDate: '26-12-2025',
  //     attendance: 40,
  //     status: 'Active'
  //   },
  //      {
  //     name: 'Abishek M',
  //     studentId: '301245',
  //     email: 'abishek@gmail.com',
  //     batch: 'Batch 1',
  //     enrollmentDate: '26-12-2025',
  //     attendance: 40,
  //     status: 'Active'
  //   },
  //      {
  //     name: 'Abishek M',
  //     studentId: '301245',
  //     email: 'abishek@gmail.com',
  //     batch: 'Batch 1',
  //     enrollmentDate: '26-12-2025',
  //     attendance: 40,
  //     status: 'Active'
  //   },
  //      {
  //     name: 'Abishek M',
  //     studentId: '301245',
  //     email: 'abishek@gmail.com',
  //     batch: 'Batch 1',
  //     enrollmentDate: '26-12-2025',
  //     attendance: 40,
  //     status: 'Active'
  //   },
  // ];

  // student attendance
  // attendanceStudents: AttendanceStudent[] = [
  // {
  //   name: 'Abishek M',
  //   studentId: '301245',
  //   batch: 'Batch 1',
  //   sessionAttended: 18,
  //   totalSessions: 25,
  //   attendancePercent: 72,
  //   attendanceStatus: 'Average',
  //   lastAttendedSession: '05-01-2026'
  // },
  // {
  //   name: 'Abishek M',
  //   studentId: '301246',
  //   batch: 'Batch 1',
  //   sessionAttended: 10,
  //   totalSessions: 25,
  //   attendancePercent: 40,
  //   attendanceStatus: 'Low',
  //   lastAttendedSession: '02-01-2026'
  // },
  //   {
  //   name: 'Abishek M',
  //   studentId: '301245',
  //   batch: 'Batch 1',
  //   sessionAttended: 18,
  //   totalSessions: 25,
  //   attendancePercent: 90,
  //   attendanceStatus: 'Good',
  //   lastAttendedSession: '05-01-2026'
  // },
  //     {
  //   name: 'Abishek M',
  //   studentId: '301245',
  //   batch: 'Batch 1',
  //   sessionAttended: 18,
  //   totalSessions: 25,
  //   attendancePercent: 90,
  //   attendanceStatus: 'Good',
  //   lastAttendedSession: '05-01-2026'
  // },
  //     {
  //   name: 'Abishek M',
  //   studentId: '301245',
  //   batch: 'Batch 1',
  //   sessionAttended: 18,
  //   totalSessions: 25,
  //   attendancePercent: 90,
  //   attendanceStatus: 'Good',
  //   lastAttendedSession: '05-01-2026'
  // },
  //     {
  //   name: 'Abishek M',
  //   studentId: '301245',
  //   batch: 'Batch 1',
  //   sessionAttended: 18,
  //   totalSessions: 25,
  //   attendancePercent: 10,
  //   attendanceStatus: 'Low',
  //   lastAttendedSession: '05-01-2026'
  // },
  // ];
  //Quiz Attendance
// quizStudents: QuizStudent[] = [
//   {
//     name: 'Abishek M',
//     studentId: '301245',
//     quizName: 'Java Basics',
//     attempts: 0,
//     completionDate: '-',
//     score: null,
//     result: 'NA',
//     evaluationStatus: 'NA'
//   },
//   {
//     name: 'Abishek M',
//     studentId: '301246',
//     quizName: 'Spring Boot',
//     attempts: 1,
//     completionDate: '04-01-2026',
//     score: 33,
//     result: 'Fail',
//     evaluationStatus: 'NA'
//   },
//   {
//     name: 'Abishek M',
//     studentId: '301247',
//     quizName: 'Angular',
//     attempts: 2,
//     completionDate: '06-01-2026',
//     score: 60,
//     result: 'Pass',
//     evaluationStatus: 'Pending'
//   },
//   {
//     name: 'Abishek M',
//     studentId: '301248',
//     quizName: 'Spring Boot',
//     attempts: 1,
//     completionDate: '07-01-2026',
//     score: 75,
//     result: 'Pass',
//     evaluationStatus: 'Evaluated'
//   }
// ];

//certificate completion
// completionStudents1: CourseCompletionStudent[] = [
//   {
//     name: 'Abishek M',
//     studentId: '301245',
//     courseCompletionStatus: 'In Progress',
//     eligibilityStatus: 'Not Eligible',
//     reason: 'Low Attendance',
//     certificateStatus: 'NA',
//     certificateIssueDate: 'NA',
//     trainerApproval: 'NA'
//   },
//   {
//     name: 'Abishek M',
//     studentId: '301246',
//     courseCompletionStatus: 'Completed',
//     eligibilityStatus: 'Eligible',
//     reason: 'NA',
//     certificateStatus: 'Pending',
//     certificateIssueDate: 'NA',
//     trainerApproval: 'Pending'
//   },
//   {
//     name: 'Abishek M',
//     studentId: '301247',
//     courseCompletionStatus: 'Completed',
//     eligibilityStatus: 'Eligible',
//     reason: 'NA',
//     certificateStatus: 'Approved',
//     certificateIssueDate: '23-12-2025',
//     trainerApproval: 'Approved'
//   }
// ];

getuserid(): string {
  return localStorage.getItem('userId') || '';
}


  get filteredStudents() {
    return this.attendanceStudents.filter(s =>
      s.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      s.studentId.includes(this.searchText)
    );
  }
    get filteredStudents2() {
    return this.completionStudents.filter(s =>
      s.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      s.studentId.includes(this.searchText)
    );
  }
  getAttendanceClass(percent: number): string {
  if (percent < 50) {
    return 'low-attendance';
  } else if (percent < 75) {
    return 'medium-attendance';
  } else {
    return 'high-attendance';
  }
}
// Pagination variables
currentPage = 1;
rowsPerPage = 1;

// Total pages
get totalPages(): number {
  return Math.ceil(this.filteredStudents.length / this.rowsPerPage);
}

// Paginated data (IMPORTANT)
get paginatedStudents() {
  const start = (this.currentPage - 1) * this.rowsPerPage;
  return this.filteredStudents.slice(start, start + this.rowsPerPage);
}

// Page number array
get pages(): number[] {
  return Array(this.totalPages).fill(0).map((x, i) => i + 1);
}

goToPage(page: number) {
  this.currentPage = page;
}

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
  }
}

prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}

onRowsChange() {
  this.currentPage = 1;
}
}

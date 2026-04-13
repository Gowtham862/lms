import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { liveclass } from '../core/services/liveclass/liveclass';
  import { environment } from '../../environments/environment';
/* ===================== INTERFACES ===================== */

interface StudentAttendance {
  studentId: number;
  name: string;
  present: boolean;
}

interface BackendStudent {
  userid: number;
  username: string;
}

interface SessionView {
  countdown?: string;
  courseid: string;
  trainername: string;
  courseName: string;
  trainerid: string;
  moduleName: string;
  batchName: string;
  batchid: string;
   batchNo: number;  
  moduleId: string;
  sessionNo: number;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
   startDateTime: Date;
  endDateTime: Date;

  status: 'LIVE' | 'UPCOMING' | 'COMPLETED'; // timing only
  reportSubmitted: boolean;                  // button control
}

interface SessionCompletionData {
  courseid: string;
  trainername: string;
  trainerid: string;
  courseName: string;
  moduleno: string;
  moduleName: string;
  batchName: string;
  batchid: string;
  sessionTitle: string;
  batchNo: number;        

  sessionNo: number; 
  attendance: StudentAttendance[];
  attachments: File[];
}

/* ===================== COMPONENT ===================== */

@Component({
  selector: 'app-course-completion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-completion.html',
  styleUrl: './course-completion.scss',
})
export class CourseCompletion implements OnInit {
   private baseUrl = environment.imagebaseurl;

  constructor(
    private authService: AuthService,
    private assignedcourses: liveclass
  ) {}

  /* ===================== STATE ===================== */

  backendCourseData: any[] = [];
  activeSessions: SessionView[] = [];
private timer: any;
  completedCourses: any[] = [];
  completedCourses1: any[] = [];

  showCompletionModal = false;
  activeTab: 'active' | 'completed' = 'active';

selectedSession: any = '';

  /* ===================== INIT ===================== */

  ngOnInit(): void {
    this.loadTrainerSessions();
    this.loadIncompleteCourses();
    this.loadCompletedCourses();
   this.timer = setInterval(() => {
    this.buildSessions();
  }, 1000);
  }
  ngOnDestroy(): void {
  clearInterval(this.timer);
}

  getuserid(): string {
    return localStorage.getItem('userId') || '';
  }

  getUserName(): string {
    return localStorage.getItem('currentUser') || 'User';
  }

  /* ===================== LOCAL STORAGE (ADDED – SAFE) ===================== */

  private getSessionKey(courseid: any, batchid: any, moduleId: any, sessionNo: any): string {
    return `SESSION_COMPLETED_${courseid}_${batchid}_${moduleId}_${sessionNo}`;
  }

  private isSessionCompleted(courseid: any, batchid: any, moduleId: any, sessionNo: any): boolean {
    return localStorage.getItem(
      this.getSessionKey(courseid, batchid, moduleId, sessionNo)
    ) === 'true';
  }

  private markSessionCompleted(courseid: any, batchid: any, moduleId: any, sessionNo: any): void {
    localStorage.setItem(
      this.getSessionKey(courseid, batchid, moduleId, sessionNo),
      'true'
    );
  }

  /* ===================== ACTIVE SESSIONS ===================== */

  loadTrainerSessions() {
    this.assignedcourses
      .Assignedcoursetrainer(this.getuserid())
      .subscribe({
        next: (res: any) => {
          console.log(res +"succes");
          console.log('success:', JSON.stringify(res, null, 2));

          this.backendCourseData = res.data || [];
          this.buildSessions();
        },
        error: err => console.error(err)
      });
  }

  // buildSessions() {
  //   this.activeSessions = [];
  //   const now = new Date();

  //   this.backendCourseData.forEach(course => {
  //     course.Modules?.forEach((mod: any) => {
  //       mod.sessions?.forEach((ses: any) => {

  //         const start = new Date(`${ses.startDate}T${ses.startTime}`);
  //         const end = new Date(`${ses.endDate}T${ses.endTime}`);

  //         let timingStatus: 'LIVE' | 'UPCOMING' | 'COMPLETED' = 'UPCOMING';
  //         if (now >= start && now <= end) timingStatus = 'LIVE';
  //         else if (now > end) timingStatus = 'COMPLETED';

  //         const completed =
  //           ses.status === true ||
  //           this.isSessionCompleted(
  //             course.courseid,
  //             course.batchid,
  //             mod.moduleId,
  //             ses.sessionNo
  //           );

  //         this.activeSessions.push({
  //           courseid: course.courseid,
  //           trainername: this.getUserName(),
  //           trainerid: this.getuserid(),
  //           courseName: course.course_name,
  //           batchName: course.batchName,
  //           batchid: course.batchid,
  //           moduleId: mod.moduleId,
  //           moduleName: mod.moduleName,
  //           sessionNo: ses.sessionNo,
  //           startDate: ses.startDate,
  //           startTime: ses.startTime,
  //           endDate: ses.endDate,
  //           endTime: ses.endTime,

  //           status: timingStatus,
  //           reportSubmitted: completed
  //         });
  //       });
  //     });
  //   });
  // }
  formatCountdown(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    String(hours).padStart(2, '0') + ':' +
    String(minutes).padStart(2, '0') + ':' +
    String(seconds).padStart(2, '0')
  );
}
buildSessions() {
  this.activeSessions = [];
  const now = new Date();

  this.backendCourseData.forEach((course: any) => {
    course.modules?.forEach((mod: any) => {
      mod.sessions?.forEach((ses: any) => {

        const start = new Date(`${ses.startDate}T${ses.startTime}`);
        const end = new Date(`${ses.endDate}T${ses.endTime}`);

        let timingStatus: 'LIVE' | 'UPCOMING' | 'COMPLETED' = 'UPCOMING';

        if (now >= start && now <= end) {
          timingStatus = 'LIVE';
        } else if (now > end) {
          timingStatus = 'COMPLETED';
        }
  let countdown = '';

if (now < start) {
  const diff = start.getTime() - now.getTime();
  countdown = this.formatCountdown(diff);
}
        const completed = this.isSessionCompleted(
          course.courseId,
          course.batchId,
          mod.moduleId,
          ses.sessionNo
        );

        this.activeSessions.push({
          courseid: course.courseId,
          trainername: this.getUserName(),
          trainerid: this.getuserid(),
          courseName: course.courseName,
         batchNo: course.batchNo,  
          batchName: `Batch ${course.batchNo}`,
          batchid: course.batchId,

          moduleId: mod.moduleId,
          moduleName: mod.moduleName,

          sessionNo: ses.sessionNo,
           startDateTime: new Date(`${ses.startDate}T${ses.startTime}`),
           endDateTime: new Date(`${ses.endDate}T${ses.endTime}`),
          startDate: ses.startDate,
          startTime: ses.startTime,
          endDate: ses.endDate,
          endTime: ses.endTime,

          status: timingStatus,
          reportSubmitted: completed,
           countdown: countdown
        });
      });
    });
  });

  console.log('Active Sessions:', this.activeSessions);
}

  /* ===================== COURSE CARDS ===================== */

  loadIncompleteCourses() {
    this.assignedcourses
      .getcompleteCourse(this.getuserid())
      .subscribe({
        next: (res: any) => {
           const incompletedCourses = res?.completed || [];
          this.completedCourses1 = this.mapCourseCards(incompletedCourses);
          console.log('inCompleted courses:', this.completedCourses);
        },
        error: err => console.error(err)
      });
  }

  loadCompletedCourses() {
    this.assignedcourses
      .getcompleteCourse(this.getuserid())
      .subscribe({
        next: (res: any) => {
          // this.completedCourses1 = this.mapCourseCards(courses || []);
           const completedCourses = res?.incomplete || [];
        this.completedCourses = this.mapCourseCards(completedCourses);

         console.log('Completed courses:', this.completedCourses);
        },
        error: err => console.error(err)
      });
  }

// mapCourseCards(courses: any[]) {
//   return courses.map(course => {

//      const imageName =
//       Array.isArray(course.metadata) &&
//       course.metadata.length > 0 &&
//       course.metadata[0].fileName
//         ? course.metadata[0].fileName
//         : null;


//     let allSessions: any[] = [];

//     course.modules?.forEach((mod: any) => {
//       mod.sessions?.forEach((ses: any) => allSessions.push(ses));
//     });

//     const completed = allSessions.filter(
//       s =>
//         s.sessionenddate &&
//         new Date(s.sessionenddate) < new Date()
//     );

//     const progress =
//       allSessions.length > 0
//         ? Math.round((completed.length / allSessions.length) * 100)
//         : 0;

//     const startDates = allSessions
//       .filter(s => s.sessionstartdate)
//       .map(s => new Date(s.sessionstartdate).getTime());

//     const endDates = allSessions
//       .filter(s => s.sessionenddate)
//       .map(s => new Date(s.sessionenddate).getTime());

//     return {
//       title: course.courseName, 
//        batchNo: course.batchNo,
//       image: imageName
//   ? this.baseUrl + imageName
//   : '/assets/default-course.jpg',

//       timeline: 'Course Timeline',
//       // totalBatches: 1,
//       startDate: startDates.length
//         ? this.formatDate(new Date(Math.min(...startDates)))
//         : '-',
//       endDate: endDates.length
//         ? this.formatDate(new Date(Math.max(...endDates)))
//         : '-',
//       progress
//     };
//   });
// }


  /* ===================== COMPLETION MODAL ===================== */

  sessionData: SessionCompletionData = {
    courseid: '',
    trainername: '',
    trainerid: '',
    courseName: '',
      batchNo: 0,
        sessionNo: 0,   
    moduleno: '',
    moduleName: '',
    batchName: '',
    batchid: '',
    sessionTitle: '',
    attendance: [],
    attachments: []
  };

openCompletionModal(session: SessionView) {
  this.selectedSession = session;

  this.sessionData = {
    courseid: session.courseid,
    trainername: session.trainername,   // ✅ take from session
    trainerid: session.trainerid,       // ✅ take from session
    courseName: session.courseName,
    batchNo: session.batchNo,
     sessionNo: session.sessionNo, 

    moduleno: session.moduleId,
    moduleName: session.moduleName,

    batchName: session.batchName,
    batchid: session.batchid,

    sessionTitle: `Session ${session.sessionNo}`,

    attendance: [],
    attachments: []
  };

  this.showCompletionModal = true;

  this.assignedcourses
    .getregisteredbatchstudents(session.batchid)
    .subscribe({
      next: (res: any) => {
        const students = res.data as BackendStudent[];

        this.sessionData.attendance = students.map(stu => ({
          studentId: stu.userid,
          name: stu.username,
          present: true
        }));
      },
      error: err => console.error(err)
    });
}


  closeCompletionModal() {
    this.showCompletionModal = false;
  }



  onFileSelect(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.sessionData.attachments.push(...files);
  }

  removeFile(file: File) {
    this.sessionData.attachments =
      this.sessionData.attachments.filter(f => f !== file);
  }

  /* ===================== SUBMIT COMPLETION ===================== */

  submitCompletion() {
    const formData = new FormData();

    const reportPayload = {
      courseid: this.sessionData.courseid,
      coursename: this.sessionData.courseName,
      trainername: this.sessionData.trainername,
      trainerid: this.sessionData.trainerid,
      moduleno: this.sessionData.moduleno,
      modulename: this.sessionData.moduleName,
      batchno: this.sessionData.batchNo,
      batchid: this.sessionData.batchid,
      sessionno: this.sessionData.sessionNo,
      attendance: this.sessionData.attendance
    };

    formData.append(
      'report',
      new Blob([JSON.stringify(reportPayload)], { type: 'application/json' })
    );

    this.sessionData.attachments.forEach(file => {
      formData.append('file', file);
    });

    this.assignedcourses.uploadSessionReport(formData).subscribe({
      next: () => {
        // update UI
        this.selectedSession.reportSubmitted = true;
        // persist for refresh
        this.markSessionCompleted(
          this.selectedSession.courseid,
          this.selectedSession.batchid,
          this.selectedSession.moduleId,
          this.selectedSession.sessionNo
        );

        this.closeCompletionModal();
        this.buildSessions();
      },
      error: err => console.error(err)
    });
  }

  /* ===================== HELPERS ===================== */

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB');
  }

  selectedCompletedCourse: any = null;
showTrainingContent = false;

modules: any[] = [];
sessions: any[] = [];
selectedModule: any = '';
// selectedSession: any = '';
recording: any = null;
documents: any[] = [];



mapCourseCards(courses: any[]) {
  return courses.map(course => {

    const imageName =
      Array.isArray(course.metadata) &&
      course.metadata.length > 0 &&
      course.metadata[0].fileName
        ? course.metadata[0].fileName
        : null;

    let allSessions: any[] = [];

    course.modules?.forEach((mod: any) => {
      mod.sessions?.forEach((ses: any) => allSessions.push(ses));
    });

    const completed = allSessions.filter(
      s =>
        s.sessionenddate &&
        new Date(s.sessionenddate) < new Date()
    );

    const progress =
      allSessions.length > 0
        ? Math.round((completed.length / allSessions.length) * 100)
        : 0;

    const startDates = allSessions
      .filter(s => s.sessionstartdate)
      .map(s => new Date(s.sessionstartdate).getTime());

    const endDates = allSessions
      .filter(s => s.sessionenddate)
      .map(s => new Date(s.sessionenddate).getTime());

    return {
      courseId: course.courseId,   
      batchId: course.batchId,     
      title: course.courseName,
      batchNo: course.batchNo,
      image: imageName
        ? this.baseUrl + imageName
        : '/assets/default-course.jpg',

      timeline: 'Course Timeline',

      startDate: startDates.length
        ? this.formatDate(new Date(Math.min(...startDates)))
        : '-',

      endDate: endDates.length
        ? this.formatDate(new Date(Math.max(...endDates)))
        : '-',

      progress
    };
  });
}

loadModulesForTrainer(course: any) {

  if (!course?.courseId) {
    console.warn('No courseId found');
    return;
  }

  const courseId = course.courseId;
  const batchId = course.batchId;

  console.log('Loading modules →', courseId, batchId);

  this.assignedcourses
    .getModulesWithSessions(courseId)   
    .subscribe({

next: (res: any) => {

  console.log('Trainer Modules →', res);
  this.modules = res.data?.modules 
               || res.data 
               || [];

  console.log('Bound Modules →', this.modules);
},

      error: err => {
        console.error('Module load error', err);
      }
    });
}

onModuleChange() {

  const module = this.modules.find(
    m => m.moduleNo == this.selectedModule
  );

  this.sessions = module?.sessions || [];
  this.selectedSession = '';
}
onSessionChange() {

  if (!this.selectedSession) return;

  this.assignedcourses
    .getSessionRecording(this.selectedSession)
    .subscribe({

      next: (res: any) => {

        const data = res.data;

        if (data.recordingMetadata?.length) {

          const video = data.recordingMetadata[0];

          this.recording = {
            title: `Session ${data.sessionNo} Recording`,
            duration: video.durationMinutes + ' min',
            videoUrl:
              `${this.baseUrl}${video.fileName}`
          };

        } else {
          this.recording = null;
        }

        this.documents =
          (data.documentsMetadata || []).map((doc: any) => ({
           name: doc?.fileName ? doc.fileName.replace(/^(\d+_)+/, '') : '-',
           uploadedBy: data.uploadedby || 'Trainer',
            date: data.uploadeddate ? new Date(data.uploadeddate).toLocaleDateString('en-IN') : '-',
          size: doc.fileSizeKB ? this.formatFileSize(doc.fileSizeKB) : '-',
             fileUrl: `${this.baseUrl}${doc.fileName}` 
          }));
      }
    });
}
 formatFileSize(kb: number): string {
    if (kb >= 1024 * 1024) {
      return `${(kb / (1024 * 1024)).toFixed(2)} GB`;
    } else if (kb >= 1024) {
      return `${(kb / 1024).toFixed(2)} MB`;
    } else {
      return `${kb} KB`;
    }
  }
selectCompletedCourse(course: any) {

  console.log('Trainer Completed Course Click →', course);

  this.selectedCompletedCourse = course;
  this.showTrainingContent = true;
  this.selectedModule = '';
  this.selectedSession = '';
  this.modules = [];
  this.sessions = [];
  this.recording = null;
  this.documents = [];

  this.loadModulesForTrainer(course);
}

showVideoPlayer = false;
playVideo() {

  if (!this.recording?.videoUrl) {
    console.warn('No video URL found');
    return;
  }

  this.showVideoPlayer = true;
}
closeVideo() {
  this.showVideoPlayer = false;
}

downloadDocument(doc: any) {

  if (!doc?.fileUrl) {
    console.warn('No file URL found');
    return;
  }

  const link = document.createElement('a');
  link.href = doc.fileUrl;
  link.download = doc.name;   // forces download
  link.target = '_blank';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
}

 
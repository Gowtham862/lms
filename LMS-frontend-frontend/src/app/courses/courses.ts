import { course } from './../course-page/course-page';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveClass } from "./live-class/live-class";
import { liveclass } from '../core/services/liveclass/liveclass';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FormsModule } from '@angular/forms';

interface CourseReport {
  courseName: string;
  moduleName: string;
  batchStartDate: string;
  batchEndDate: string;
   trainerName: string;
  status: 'In Progress';
}
interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}
export interface Course {
  // courseId: number;
  // courseName: string;
  // courseCategory: string;
  // courseLevel: string;
  // rating: number;
  // courseduration: string;
  // trainername: string;
  // batchStartDate: string;
  // batchEndDate: string;
  // modules: any[];
  // metadata: any[];
  courseId: number;        
  courseName: string;      
  courseCategory: string;  
  courseLevel: string;    
  rating: number;
  courseDuration: string;  
  trainerName: string;     
  batchStartDate: string;
  batchEndDate: string;
  modules: any[];
  metadata: any[];
  progressPercentage: number; 
   recommendedCourseIds?: string[];
  price?: number;
  discount?: number;
}


export interface Module {
  moduleId: string;
  moduleName: string;
  moduleDescription: string;
  moduleDuration: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}
interface CompletedCourse {
  id: string;
  courseId: number;
   trainerId: string;
trainername: string;
  courseName: string;
  coursecategory: string;
  courselevel: string;
  certificateavalibility: string;
  rating: number;
  noofmodule: string;
  moduleCount: string;
  sessionCount: number;
  status: string;
  batchStartDate: string;
  batchEndDate: string;
  modules: {
    moduleId: string;
    moduleName: string;
    sessionCount: number;
  }[];
  metadata: Metadata[];
}


interface Metadata {
  fileName: string;
  mimeType: string;
  width: number;
  height: number;
  fileSizeKB: number;
}


@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, LiveClass,FormsModule],
  templateUrl: './courses.html',
  styleUrls: ['./courses.scss']
})
export class Courses implements OnInit {
  baseurl=environment.imagebaseurl
  courseId!:number;
  course: Course[] = [];
  completed:CompletedCourse[]=[];
  reports: CourseReport[] = [];
  modules: any[] = [];
  sessions: any[] = [];
  recording: any = null;
documents: any[] = [];
 
 
  selectedModule: any = '';
  selectedSession: any = '';
  loading = true;
  error = '';

  recommendedCoures:any[]=[];



  ngOnInit(): void {
this.course = history.state.courseData;

    console.log('Received Course:', this.course);
    // this.liveclass();
    // this.completedclass();
    this.loadCourseProgress();
     
  }

  constructor(private liveservice: liveclass,
    private router: Router,
    private api: ApiService,
    private authService: AuthService,private http: HttpClient,
    private download:liveclass) { }


  activeTab: 'active' | 'completed' | 'similar' = 'active';
  

  recommendedCourses: any[] = [];

private baseUrl = environment.imagebaseurl;
loadRecommendedCourses() {
  const userId = this.getuserid(); // fetch from localStorage
  if (!userId) {
    console.warn("⚠ No userId found in localStorage");
    return;
  }

  this.liveservice.getRecommendedCoursesByUserId(userId)
    .subscribe({
      next: (res: any) => {
        console.log('Recommended API:', res);
       this.recommendedCourses = res.data.recommendedCourses || [];

        
      },

      
      error: err => {
        console.error('Recommended error:', err);
      }
    });
}


openSimilarTab() {
  this.activeTab = 'similar';
  this.loadRecommendedCourses();
}

getRecommendedImage(course: any): string {

  if (course?.metadata?.length) {

    const imageMeta = course.metadata.find(
      (m: any) =>
        m.mimeType &&
        m.mimeType.startsWith('image')
    );

    if (imageMeta?.fileName) {

      const url =
        environment.imagebaseurl +
        imageMeta.fileName;

      console.log('Recommended Image URL →', url);

      return url;
    }
  }

  // fallback image
  return 'assets/course.jpg';
}


loadCourseProgress() {
  const userId = this.authService.getUserId();
  const role = localStorage.getItem('role');

  if (!userId || role !== 'LEARNER') return;

  this.liveservice.getCourseProgress(userId)
    .subscribe({
      next: (res: any) => {
        console.log('Raw res →', res);

        const activeCourses = res.incomplete || [];
        const completedCourses = res.completed || [];

        this.course = activeCourses.map((c: any) => ({
          courseId: c.courseId,
          courseName: c.courseName,
          trainerName: c.trainername,
          // trainerName: c.primaryTrainerName,
          courseCategory: c.coursecategory || '-',
          courseLevel: c.courselevel || '-',
          rating: c.rating || 0,
          courseDuration: c.coursedesc || '-',
          batchStartDate: c.batchStartDate,
          batchEndDate: c.batchEndDate,
          modules: c.modules || [],
          metadata: c.metadata || [],
          progressPercentage: c.progressPercentage || 0,
       price: Number(c.price) || 0,
    discount: Number(c.discount) || 0
        }));

        this.completed = completedCourses.map((c: any) => ({
          ...c,
          modules: (c.modules || []).map((mod: any) => ({
            ...mod,
            sessionCount: mod.sessions?.length || 0
          }))
        }));

        // 🔹 Auto-select first completed course
        if (this.completed.length > 0) {
          this.courseId = Number(this.completed[0].courseId);
          

       
          this.loadRecommendedCourses();
        }

        this.buildReportsFromCourses(this.course);
        this.loading = false;
      },
      error: (err) => {
        console.error('Progress API failed', err);
        this.loading = false;
      }
    });
}

 goToLandingPage() {
    
    this.router.navigate(['/landing-page']);
  }

  goToCourse(courseId: number) {
  console.log("Navigating to Course ID:", courseId);

  this.router.navigate(['/course', courseId]);
}

getCourseStartDate(course: any) {
  const sessions = course.modules?.flatMap((m: any) => m.sessions || []);
  if (!sessions.length) return '-';

  return sessions[0].sessionstartdate;
}

getCourseEndDate(course: any) {
  const sessions = course.modules?.flatMap((m: any) => m.sessions || []);
  if (!sessions.length) return '-';

  return sessions[sessions.length - 1].sessionenddate;
}


getModuleCount(course: any): number {
  return course.modules?.length || 0;
}

// getCourseStartDate(course: any): string {
//   const allSessions: any[] = course.modules
//     ? course.modules.flatMap((m: any) => m.sessions || [])
//     : [];

//   if (allSessions.length === 0) {
//     return '-';
//   }

//   const earliestDate = allSessions
//     .map((s: any) => new Date(s.startDate))
//     .sort((a: Date, b: Date) => a.getTime() - b.getTime())[0];

//   return earliestDate.toISOString().split('T')[0];
// }

// getCourseEndDate(course: any): string {
//   const allSessions: any[] = course.modules
//     ? course.modules.flatMap((m: any) => m.sessions || [])
//     : [];

//   if (allSessions.length === 0) {
//     return '-';
//   }

//   const latestDate = allSessions
//     .map((s: any) => new Date(s.endDate))
//     .sort((a: Date, b: Date) => b.getTime() - a.getTime())[0];

//   return latestDate.toISOString().split('T')[0];
// }
getCourseImage(course: any): string {
  if (course?.metadata?.length) {
    const imageMeta = course.metadata.find(
      (m: any) => m.mimeType && m.mimeType.startsWith('image')
    );

    if (imageMeta?.fileName) {
      const url = environment.imagebaseurl + imageMeta.fileName;
      console.log('IMAGE URL:', url); 
      return url;
    }
  }

  return 'assets/course.jpg'; 
}


buildReportsFromCourses(courses: any[]) {
  this.reports = [];

  courses.forEach(course => {

    this.reports.push({
      courseName: course.courseName,
      trainerName: course.trainerName, 
      moduleName: '', // optional if not needed
      batchStartDate: course.batchStartDate,
      batchEndDate: course.batchEndDate,
      status: 'In Progress'
    });

  });
}
// buildReportsFromCourses(courses: any[]) {
//   this.reports = [];

//   courses.forEach(course => {
//     course.modules?.forEach((mod: any) => {
//       mod.sessions?.forEach((ses: any) => {

//         this.reports.push({
//           courseName: course.courseName,
//           moduleName: mod.moduleName,
//           batchStartDate: course.batchStartDate,
//           batchEndDate: course.batchEndDate,
//           status: 'In Progress'
//         });

//       });
//     });
//   });
// }

  moduleReports = [
    {
      moduleName: 'COBIT5 Principles',
      trainer: 'Jacob Jones',
      trainerAvatar: '/arab-women.png',
      startDate: '07-12-2025',
      timeSpent: '02:02:12',
      quizScore: 60,
      status: 'Completed'
    },
    {
      moduleName: 'COBIT 5 Enablers',
      trainer: 'Jacob Jones',
      trainerAvatar: '/arab-women.png',
      startDate: '13-12-2025',
      timeSpent: '02:02:12',
      quizScore: 37,
      status: 'Completed'
    },
    {
      moduleName: 'Introduction to COBIT 5 Implementation',
      trainer: 'Jacob Jones',
      trainerAvatar: '/arab-women.png',
      startDate: '26-12-2025',
      timeSpent: '02:02:12',
      quizScore: 95,
      status: 'Completed'
    },
    {
      moduleName: 'Process Capability Assessment Model',
      trainer: 'Jacob Jones',
      trainerAvatar: '/arab-women.png',
      startDate: '02-01-2026',
      timeSpent: '02:02:12',
      quizScore: 95,
      status: 'Completed'
    }
  ];
  

getuserid():string{
    return localStorage.getItem('userId') ||'';
  }

  downloadFile(courseId: number) {
  const userId = this.getuserid();

  this.liveservice
    .downloadCertificateByUserAndCourse(userId, courseId).subscribe({
    next: (blob: Blob) => {
 
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate_${userId}.pdf`; // filename
      a.click();

    
      window.URL.revokeObjectURL(url);
    },
    error: (err) => {

      if (err.status === 409) {
    alert("No certificate found. Please wait for admin approval to get a certificate");
  } else {
    alert("Something went wrong while issuing certificate");
  }
     
      console.error('Certificate download failed', err);
    }
  });
}


//for the clicked download card
 
    // 🔹 Load modules from service
  loadModules() {
  this.liveservice.getModulesWithSessions(this.courseId)
 
      .subscribe({
        next: (res: any) => {
          this.modules = res.data.modules;
        },
        error: (err) => {
          console.error('Error:', err);
        }
      });
  }
 
  // 🔹 Module change → sessions bind
  onModuleChange() {
 
    const module = this.modules.find(
      m => m.moduleNo == this.selectedModule
    );
 
    if (module) {
      this.sessions = module.sessions;
    } else {
      this.sessions = [];
    }
 
    this.selectedSession = '';
  }
 
  onSessionChange() {
 
  if (!this.selectedSession) return;
 
  console.log('Session Selected →', this.selectedSession);
 
  this.liveservice
    .getSessionRecording(this.selectedSession)
    .subscribe({
 
      next: (res: any) => {
 
        console.log('Recording API →', res);
 
        const data = res.data;
 
    
        if (data.recordingMetadata?.length) {
          const video = data.recordingMetadata[0];
          this.recording = {
            title: `Session ${data.sessionNo} Recording`,
            duration: video.durationMinutes + ' min',
            author: 'Trainer',
            time: 'Recently',
            fileName: video.fileName,
             videoUrl:
               `${this.baseurl}${video.fileName}`
          };
 
        } else {
          this.recording = null;
        }
 
    
        this.documents = (data.documentsMetadata || [])
          .map((doc: any) => ({
 
            name: doc?.fileName ? doc.fileName.replace(/^(\d+_)+/, '') : '-',
              originalName: doc?.fileName || '',
            uploadedBy: data.uploadedby || 'Trainer',
            date: doc.createdISO
              ? new Date(doc.createdISO)
                  .toLocaleDateString()
              : '-',
            size: doc.fileSizeKB + ' KB'
 
          }));
 
      },
 
      error: (err: any) => {
        console.error('Recording API Error →', err);
      }
 
    });
}
 
showVideoPlayer = false;
 
playVideo() {
  this.showVideoPlayer = true;
}
 
closeVideo() {
  this.showVideoPlayer = false;
}
 
showTrainingContent = false;
 
selectCompletedCourse(course: any) {
  this.courseId = Number(course.courseId);

  console.log(
    'CourseId (number) →',
    this.courseId,
    typeof this.courseId
  );
  this.showTrainingContent = true;
  this.selectedModule = '';
  this.selectedSession = '';
  this.modules = [];
  this.sessions = [];
  this.recording = null;
  this.documents = [];

  this.loadModules();

  
  //  this.activeTab = 'similar';
}

//for download
downloadDocument(doc: any) {


  if (!doc || !doc.originalName) {
    console.error("Invalid document:", doc);
    return;
  }

  console.log("Original name from DB:", doc.originalName);

  const serverFileName = doc.originalName.trim(); // DO NOT MODIFY
  const displayFileName = doc.name?.trim() || serverFileName;

  const fileUrl = `${this.baseUrl}${serverFileName}`;

  console.log("Final URL:", fileUrl);

  this.http.get(fileUrl, { responseType: 'blob' })
    .subscribe({
      next: (blob) => {

        const blobUrl = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = displayFileName;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      },
      error: (err) => {
        console.error("Download failed:", err);
      }
    });
}
 
 
}
 
 

 
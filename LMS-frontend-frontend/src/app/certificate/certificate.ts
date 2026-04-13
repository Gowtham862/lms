import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { liveclass } from '../core/services/liveclass/liveclass';
import { Router } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
interface CompletedCourse {
  id: string;
   courseId: number; 
  coursename: string;
  coursecategory: string;
  courselevel: string;
  certificateavalibility: string;
  rating: number;
  noofmodule: string;
  moduleCount: string;
  sessionCount: number;
  status: string;
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
  selector: 'app-certificate',
  imports: [CommonModule],
  templateUrl: './certificate.html',
  styleUrl: './certificate.scss',
})
export class Certificate implements OnInit {

 loading = true;
  error = '';
completed: any[] = [];

  constructor(private liveservice: liveclass,
    private router: Router,
    private api: ApiService,
    private authService: AuthService,private http: HttpClient,
    private download:liveclass) { }
ngOnInit(): void {
  this.completedclass();
}
   completedclass() {
    
    const userId = this.authService.getUserId();
    const role = localStorage.getItem('role');


  if (!userId) return;

  this.api.get(`purchase/progress/${userId}`).subscribe({
    next: (res: any) => {
      this.completed = res.completed || [];
      console.log("Completed Courses:", this.completed);
    },
    error: err => console.error(err)
  });
   }
  getModuleCount(course: any): number {
    return course.modules?.length || 0;
  }
  
  getCourseStartDate(course: any): string {
    const allSessions: any[] = course.modules
      ? course.modules.flatMap((m: any) => m.sessions || [])
      : [];
  
    if (allSessions.length === 0) {
      return '-';
    }
  
    const earliestDate = allSessions
      .map((s: any) => new Date(s.startDate))
      .sort((a: Date, b: Date) => a.getTime() - b.getTime())[0];
  
    return earliestDate.toISOString().split('T')[0];
  }
  
  getCourseEndDate(course: any): string {
    const allSessions: any[] = course.modules
      ? course.modules.flatMap((m: any) => m.sessions || [])
      : [];
  
    if (allSessions.length === 0) {
      return '-';
    }
  
    const latestDate = allSessions
      .map((s: any) => new Date(s.endDate))
      .sort((a: Date, b: Date) => b.getTime() - a.getTime())[0];
  
    return latestDate.toISOString().split('T')[0];
  }
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
  

}

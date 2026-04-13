import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { liveclass } from '../../core/services/liveclass/liveclass';
import { ApiService } from '../../core/services/api.service';
import { course } from '../../course-page/course-page';
import { Course } from '../courses';
import { environment } from '../../../environments/environment';
interface LiveSessionView {
  title: string;
  image: string;
  date: string;
  time: string;
  live: boolean;
  joinUrl: string;
  startDateTime: Date;
  remainingTime: string;
}
@Component({
  selector: 'app-live-class',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './live-class.html',
  styleUrl: './live-class.scss',
})
export class LiveClass 
 {
  liveClasses: LiveSessionView[] = [];
    constructor(
    private liveservice: liveclass,
    private router: Router,
    private api:ApiService
  ) {}
  private baseurl=environment.imagebaseurl
ngOnInit() {
  this.loadLiveSessions();

  //  setInterval(() => {
  //   this.buildLiveSessions(this.originalCourses);
  // }, 60000);
}
originalCourses: any[] = [];

loadLiveSessions() {
  const userId = localStorage.getItem('userId');
  if (!userId) return;
 
  // Only fetch incomplete courses
  this.api.get(`purchase/progress/${userId}`).subscribe({
    next: (res: any) => {
      const incompleteCourses = res.incomplete || []; 
      this.buildLiveSessions(incompleteCourses);
//       this.originalCourses = res.incomplete || [];
// this.buildLiveSessions(this.originalCourses);

      console.log("LiveClass - API Response:", res.incomplete);
    },
    error: err => console.error(err)
  });
}

// buildLiveSessions(courses: any[]) {

//   console.log("Incomplete courses →", courses);

//   this.liveClasses = courses.map(course => ({
//     title: `${course.courseName} – ${course.modules?.length || 0} Modules`,
//     image: this.getCourseImage(course), // Course image
//     date: course.batchStartDate,
//     time:course.starttime = course.modules?.[0]?.sessions?.[0]?.starttime || '',                        // No session time
//     live: true,              
//     joinUrl: `https://meet.jit.si/${course.courseName}`
//   }));

//   console.log("Live classes:", this.liveClasses);
// }



buildLiveSessions(courses: any[]) {

  this.liveClasses = courses.flatMap(course =>
    course.modules?.flatMap((module: any) =>
      module.sessions?.map((session: any) => {

        // const [y,m,d] = session.sessionstartdate.split('-').map(Number);
        // const [sh,sm] = session.starttime.split(':').map(Number);
        // const [eh,em] = session.endtime.split(':').map(Number);

        // const startDateTime = new Date(y, m-1, d, sh, sm);
        // let endDateTime = new Date(y, m-1, d, eh, em);
const startDateTime = new Date(`${session.sessionstartdate}T${session.starttime}`);
let endDateTime = new Date(`${session.sessionstartdate}T${session.endtime}`);

        if (endDateTime <= startDateTime) {
          endDateTime = new Date(startDateTime.getTime() + 3600000);
        }

        const now = new Date();

        if (now > endDateTime) return null;

        const live = now >= startDateTime && now <= endDateTime;

        let remainingTime = '';
        if (!live) {
          const diff = startDateTime.getTime() - now.getTime();
          const hrs = Math.floor(diff/3600000);
          const mins = Math.floor((diff%3600000)/60000);
          const secs = Math.floor((diff%60000)/1000);
          remainingTime =
            `${hrs.toString().padStart(2,'0')}:` +
            `${mins.toString().padStart(2,'0')}:` +
            `${secs.toString().padStart(2,'0')}`;
        }

        return {
          title: `${course.courseName} – ${module.moduleName}`,
          image: this.getCourseImage(course),
          date: session.sessionstartdate,
          time: session.starttime,
          live,
          remainingTime,
          joinUrl: `https://meet.jit.si/${course.courseName}`,
          startDateTime
        };

      }) || []
    ) || []
  ).filter(Boolean);

}


// buildLiveSessions(courses: any[]) {

//   this.liveClasses = courses
//     .map(course => {

//       const firstSession =
//         course.modules?.flatMap((m: any) => m.sessions || [])[0];

//       if (!firstSession) return null;

//       const sessionDate = firstSession.sessionstartdate;
//       const startTime = firstSession.starttime;
//       const endTime = firstSession.endtime;

      
//       const [year, month, day] = sessionDate.split('-').map(Number);
//       const [sh, sm] = startTime.split(':').map(Number);
//       const [eh, em] = endTime.split(':').map(Number);

//       const startDateTime = new Date(year, month - 1, day, sh, sm);
//       const endDateTime = new Date(year, month - 1, day, eh, em);

//       const now = new Date();

//       // COMPLETED → hide
//       if (now > endDateTime) return null;

//       let live = false;
//       let remainingTime = '';

//       if (now >= startDateTime && now <= endDateTime) {
//         live = true;
//         remainingTime = 'Live Now';
//       } else {
//         const diff = startDateTime.getTime() - now.getTime();
//         // const hrs = Math.floor(diff / 3600000);
//         // const mins = Math.floor((diff % 3600000) / 60000);
//         // remainingTime = `${hrs}h ${mins}m remaining`;
//         const hrs = Math.floor(diff / 3600000);
// const mins = Math.floor((diff % 3600000) / 60000);
// const secs = Math.floor((diff % 60000) / 1000);

// remainingTime =
//   `${hrs.toString().padStart(2,'0')}:` +
//   `${mins.toString().padStart(2,'0')}:` +
//   `${secs.toString().padStart(2,'0')}`;

//       }

//       return {
//         title: `${course.courseName} – ${course.modules?.length || 0} Modules`,
//         image: this.getCourseImage(course),
//         date: sessionDate,
//         time: startTime,
//         live,
//         remainingTime,
//         joinUrl: `https://meet.jit.si/${course.courseName}`,
//         startDateTime
//       };
//     })
//    .filter((session): session is LiveSessionView => session !== null);

// }







getCourseImage(course: any): string {
  if (course?.metadata?.length) {
    const img = course.metadata.find(
      (m: any) => m.mimeType?.startsWith('image')
    );
    if (img?.fileName) {
      return `${this.baseurl}${img.fileName}`;;
    }
  }
  return '/course.jpg';
}
joinSession(cls: LiveSessionView) {
  if (!cls.joinUrl) return;
  window.open(cls.joinUrl, '_blank');
}
   
 

}
 
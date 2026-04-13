import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { MyCourses } from "./my-courses/my-courses";
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';
import { RouterLink } from "@angular/router";
import { liveclass } from '../core/services/liveclass/liveclass';
 
@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, MyCourses, RouterLink],
  templateUrl: './dash.html',
  styleUrls: ['./dash.scss']
})
export class Dash implements OnInit {
 
  stats = {
    activeCourses: 0,
    upcomingSessions: 0,
    progress: 0,
    completedCourses: 0
  };
 
  liveSessionTimer = '';
  // private timerId!: number;
  private timerInterval: any;
 
  constructor(
    private api: ApiService,
    private authService: AuthService,
    private liveService: liveclass
  ) {}
 
  ngOnInit() {
    // this.startClock();
    this.loadDashboardStats();
     this.loadUpcomingSessionsCount();
  }
 
 
 
  /* ================= CLOCK ================= */
  // startClock() {
  //   this.timerId = window.setInterval(() => {
  //     this.liveSessionTimer = new Date().toLocaleTimeString();
  //   }, 1000);
  // }
 
  /* ================= DASHBOARD DATA ================= */
  loadDashboardStats() {
    const userId = this.authService.getUserId();
    const role = localStorage.getItem('role');
 
    if (!userId || role !== 'LEARNER') return;
 
    /* ACTIVE COURSES */
    this.api.get(`purchase/incompletecourses/${userId}`).subscribe({
      next: (res: any) => {
        const activeCourses = res.data || [];
        this.stats.activeCourses = activeCourses.length;
 
        this.stats.upcomingSessions =
          this.countUpcomingSessions(activeCourses);
 
        this.calculateProgress();
      }
    });
 
    /* COMPLETED COURSES */
    this.api.get(`purchase/completedcourses/${userId}`).subscribe({
      next: (res: any) => {
        const completedCourses = res.data || [];
        this.stats.completedCourses = completedCourses.length;
 
        this.calculateProgress();
      }
    });
  }
 
  /* ================= SESSION COUNT ================= */
  countUpcomingSessions(courses: any[]): number {
    const now = new Date();
    let count = 0;
 
    courses.forEach(course => {
      course.modules?.forEach((mod: any) => {
        mod.sessions?.forEach((ses: any) => {
          const start = new Date(`${ses.startDate}T${ses.startTime}`);
          if (start > now) {
            count++;
          }
        });
      });
    });
 
    return count;
  }
  loadUpcomingSessionsCount() {
  const userId = localStorage.getItem('userId');
  if (!userId) return;
 
  this.liveService.getCourseProgress(userId).subscribe({
    next: (res: any) => {
      const incompleteCourses = res.incomplete || [];
      const completedCourses = res.completed || [];
 
     
      const allCourses = [...incompleteCourses, ...completedCourses];
      this.stats.progress = allCourses.length > 0
        ? Math.round(
            allCourses.reduce((sum: number, course: any) =>
              sum + (course.progressPercentage || 0), 0) / allCourses.length
          )
        : 0;
      console.log('Progress:', this.stats.progress + '%');
 
      const allSessions = incompleteCourses.flatMap((course: any) =>
        course.modules?.flatMap((module: any) =>
          module.sessions?.map((session: any) => {
            const start = new Date(`${session.sessionstartdate}T${session.starttime}:00`);
            const end = new Date(`${session.sessionenddate}T${session.endtime}:00`);
            return {
              ...session,
              startDate: start,
              endDate: end,
              courseName: course.courseName,
              batchNo: course.batchNo,
              moduleName: module.moduleName
            };
          }) || []
        ) || []
      );
 
      const now = new Date();
 
     
      const upcomingSessions = allSessions.filter((s: any) =>
        s.endDate > s.startDate && now < s.endDate
      );
 
      this.stats.upcomingSessions = upcomingSessions.length;
      console.log("Upcoming Sessions Count:", this.stats.upcomingSessions);
      console.log("Upcoming Sessions:", upcomingSessions);
 
      if (upcomingSessions.length > 0) {
     
        const nextSession = [...upcomingSessions].sort(
          (a: any, b: any) => a.startDate.getTime() - b.startDate.getTime()
        )[0];
        console.log("Next Session:", nextSession.courseName, '|', nextSession.moduleName, '| Session:', nextSession.sessionNo);
        this.startSessionTimer(nextSession);
      } else {
        this.liveSessionTimer = '';
        if (this.timerInterval) clearInterval(this.timerInterval);
      }
    },
    error: err => console.error(err)
  });
}
 
startSessionTimer(session: any) {
  if (this.timerInterval) clearInterval(this.timerInterval);
 
  this.timerInterval = setInterval(() => {
    const now = new Date();
    const start = session.startDate;
    const end = session.endDate;
 
    let diff = 0;
 
    if (now < start) {
 
      diff = start.getTime() - now.getTime();
    } else if (now >= start && now <= end) {
     
      diff = end.getTime() - now.getTime();
    } else {
 
      this.liveSessionTimer = '';
      clearInterval(this.timerInterval);
      this.loadUpcomingSessionsCount(); // 🔄 Auto pick next session
      return;
    }
 
    const hours   = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
 
    this.liveSessionTimer = `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
 
  }, 1000);
}
 
pad(n: number): string {
  return n.toString().padStart(2, '0');
}
 
 
 
ngOnDestroy() {
  if (this.timerInterval) clearInterval(this.timerInterval);
}
  /* ================= PROGRESS ================= */
  calculateProgress() {
    const total =
      this.stats.activeCourses + this.stats.completedCourses;
 
   
  }
}
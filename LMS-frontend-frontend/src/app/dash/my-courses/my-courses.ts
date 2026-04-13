import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { liveclass } from '../../core/services/liveclass/liveclass';
import { RouterLink } from "@angular/router";
import { environment } from '../../../environments/environment';

interface MyCourseView {
  title: string;
  image: string;
  progress: number;
}

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './my-courses.html',
  styleUrls: ['./my-courses.scss']
})
export class MyCourses implements OnInit {
  private baseUrl = environment.imagebaseurl;

  activeTab: 'all' | 'ongoing' | 'completed' = 'all';
  courses: MyCourseView[] = [];

  // Stats & timer (used by session logic)
  stats = { upcomingSessions: 0 };
  liveSessionTimer = '';
  timerInterval: any;

  // Attendance Gauge
  attendancePercent = 0;
  dashArray = 251;
  dashOffset = 251;
  needleAngle = -90;

  constructor(
    private api: ApiService,
    private authService: AuthService,
    private liveService: liveclass
  ) {}

  ngOnInit(): void {
    this.loadMyCourses();
    this.loadTraineeAttendance();
  }

  // ================= COURSES =================
  loadMyCourses() {
    const userId = this.authService.getUserId();
    const role = localStorage.getItem('role');

    if (!userId || role !== 'LEARNER') return;

    this.courses = [];

    this.api.get(`purchase/progress/${userId}`).subscribe({
      next: (res: any) => {
        const incompleteCourses = res.incomplete || [];
        const completedCourses = res.completed || [];

        const active = incompleteCourses.map((c: any) =>
          this.mapCourseToView(c, c.progressPercentage ?? 0)
        );

        const completed = completedCourses.map((c: any) =>
          this.mapCourseToView(c, c.progressPercentage ?? 100)
        );

        this.courses = [...active, ...completed];

        // Session timer logic (incomplete courses only)
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

        if (upcomingSessions.length > 0) {
          const nextSession = [...upcomingSessions].sort(
            (a: any, b: any) => a.startDate.getTime() - b.startDate.getTime()
          )[0];
          this.startSessionTimer(nextSession);
        } else {
          this.liveSessionTimer = '';
          if (this.timerInterval) clearInterval(this.timerInterval);
        }
      },
      error: err => console.error(err)
    });
  }

  private mapCourseToView(course: any, progress: number): MyCourseView {
    return {
      title: course.courseName,
      image: course.metadata?.length
        ? `${this.baseUrl}${course.metadata[0].fileName}`
        : 'assets/course.jpg',
      progress: Math.round(progress)
    };
  }

  filteredCourses() {
    if (this.activeTab === 'ongoing') {
      return this.courses.filter(c => c.progress < 100);
    }
    if (this.activeTab === 'completed') {
      return this.courses.filter(c => c.progress === 100);
    }
    return this.courses;
  }

  actionLabel(progress: number) {
    return progress === 100 ? 'View Course' : 'Continue Course';
  }

  private startSessionTimer(session: any) {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      const now = new Date();
      const diff = session.startDate.getTime() - now.getTime();

      if (diff <= 0) {
        this.liveSessionTimer = 'Live Now';
        clearInterval(this.timerInterval);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      this.liveSessionTimer = `${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
  }

  // ================= ATTENDANCE GAUGE =================
  loadTraineeAttendance() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.liveService.gettraineeattendance(userId).subscribe({
      next: (res: any) => {
        this.attendancePercent = res.overallAttendancePercentage || 0;
        this.dashOffset = this.dashArray - (this.attendancePercent / 100) * this.dashArray;
        this.needleAngle = -90 + (this.attendancePercent / 100) * 180;
      },
      error: err => console.error('Attendance error', err)
    });
  }
}
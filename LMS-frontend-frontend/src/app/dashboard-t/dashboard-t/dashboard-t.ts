import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { BatchesTimeline } from "./batches-timeline/batches-timeline";
import { AuthService } from '../../core/services/auth.service';
import { liveclass } from '../../core/services/liveclass/liveclass';



@Component({
  selector: 'app-dashboard-t',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    
],
  templateUrl: './dashboard-t.html',
  styleUrl: './dashboard-t.scss',
})


export class DashboardT implements OnInit{

    constructor(private service:AuthService,private assignedcourses:liveclass  ){}

    liveClasses: any[] = [];


//       ngOnInit() {
 
//   this.getAssignedcoursefortrainers()
// }

  getuserid():string{
    return localStorage.getItem('userId') ||'';
  }
getAssignedcoursefortrainers() {
  console.log("Fetching assigned courses...");

  this.assignedcourses
    .Assignedcoursetrainer(this.getuserid())
    .subscribe({
      next: (res: any) => {
        const batches = res?.data || [];
        const now = new Date();

        this.liveClasses = [];

        batches.forEach((batch: any) => {
          const courseName = batch.courseName;

          (batch.modules || []).forEach((module: any) => {
            const moduleName = module.moduleName;

            (module.sessions || []).forEach((session: any) => {
              // Create start/end dates safely
              const start = new Date(`${session.startDate}T${session.startTime}`);
              const end = new Date(`${session.endDate}T${session.endTime}`);

              // Determine status
              let status: 'live' | 'upcoming' | 'completed';
              if (now >= start && now <= end) {
                status = 'live';
              } else if (now < start) {
                status = 'upcoming';
              } else {
                status = 'completed';
              }

              // Push the structured object
              this.liveClasses.push({
                 title: `${courseName} Batch ${batch.batchNo} Module ${module.moduleId} ${moduleName}   Session ${session.sessionNo}`,
                date: session.startDate,
                time: session.startTime,
                duration: this.calculateDuration(start, end), // "3 hrs 30 mins"
                students: batch.studentCapacity || 0,
                status: status,
                countdown: status === 'upcoming' ? this.calculateCountdown(start) : null,
                startDateTime: start, // optional: useful for HTML pipes
                endDateTime: end      // optional: useful for reference
              });
            });
          });
        });

        console.log("Live Classes:", this.liveClasses); // debug
      },
      error: err => console.error(err)
    });
}

// Calculates duration in "X hrs Y mins"
calculateDuration(start: Date, end: Date): string {
  const diffMs = end.getTime() - start.getTime();
  if (diffMs <= 0) return '0 hrs 0 mins';

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours} hrs ${minutes} mins`;
}

// Countdown for upcoming classes in "HH:MM:SS"
calculateCountdown(start: Date): string {
  const diff = start.getTime() - new Date().getTime();
  if (diff <= 0) return '00:00:00';

  const hrs = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  return `${this.pad(hrs)}:${this.pad(mins)}:${this.pad(secs)}`;
}

// Pads single digits
pad(num: number): string {
  return num < 10 ? '0' + num : num.toString();
}


  /* STATS */
  stats = [
    { title: 'Total Batches', value: 0, progress: 0 },
    { title: 'Active Batches', value: 0, progress: 0 },
    { title: 'Completed Batches', value: 0, progress: 0 },
    // { title: 'Total Modules Completed', value: 34, progress: 80 }
  ];

  /* LIVE CLASSES */
  // liveClasses = [
  //   {
  //     title: 'CAPM® - Arabic Course - Module 1.1',
  //     date: '02-01-2026',
  //     time: '09:30 am',
  //     duration: '3 hrs',
  //     students: 12,
  //     status: 'live'
  //   },
  //   {
  //     title: 'CAPM® - Arabic Course - Module 1.2',
  //     date: '02-01-2026',
  //     time: '01:30 pm',
  //     duration: '3 hrs',
  //     students: 12,
  //     status: 'upcoming',
  //     countdown: '05:32:23'
  //   }
  // ];

  /* CALENDAR */
currentYear = 2026;
currentMonthIndex = 0; // January
currentMonthName = 'January';

weekDays = ['Su','Mo','Tu','We','Th','Fr','Sa'];

calendarDates: {
  date: number | null;
  type: 'live' | 'quiz' | 'assessment' | 'none';
}[] = [];


// Trainer events
trainerEvents: Record<number, 'live' | 'quiz' | 'assessment'> = {
  2: 'live',
  5: 'quiz',
  12: 'live',
  18: 'assessment',
  25: 'live'
};

ngOnInit() {
  this.generateCalendar();
  this.getAssignedcoursefortrainers();
  this.loadBatchCounts(); 
  setInterval(() => {
  this.liveClasses.forEach(cls => {
    if (cls.status === 'upcoming') {
      cls.countdown = this.calculateCountdown(cls.startDateTime);
    }
  });
}, 1000);
}

generateCalendar() {
  this.calendarDates = [];

  const firstDay = new Date(
    this.currentYear,
    this.currentMonthIndex,
    1
  ).getDay(); // 0=Sun, 1=Mon...

  const daysInMonth = new Date(
    this.currentYear,
    this.currentMonthIndex + 1,
    0
  ).getDate();

  // 🔹 Empty cells BEFORE first date
  for (let i = 0; i < firstDay; i++) {
    this.calendarDates.push({ date: null, type: 'none' });
  }

  // 🔹 Actual days
  for (let day = 1; day <= daysInMonth; day++) {
    this.calendarDates.push({
      date: day,
      type: this.trainerEvents[day] || 'none'
    });
  }

  // Month label
  this.currentMonthName = new Date(
    this.currentYear,
    this.currentMonthIndex
  ).toLocaleString('default', { month: 'long' });
}


prevMonth() {
  if (this.currentMonthIndex === 0) {
    this.currentMonthIndex = 11;
    this.currentYear--;
  } else {
    this.currentMonthIndex--;
  }
  this.generateCalendar();
}

nextMonth() {
  if (this.currentMonthIndex === 11) {
    this.currentMonthIndex = 0;
    this.currentYear++;
  } else {
    this.currentMonthIndex++;
  }
  this.generateCalendar();
}

loadBatchCounts() {
  this.assignedcourses
    .getBatchCounts(this.getuserid())
    .subscribe({
      next: (res: any) => {
        const active = res?.activeBatches ?? 0;
        const total = res?.totalBatches ?? 0;
        const completed=res?.completed??0;

        // Total Batches
        this.stats[0].value = total;
        this.stats[0].progress = total > 0 ? 100 : 0;

        // Active Batches
        this.stats[1].value = active;
        this.stats[1].progress = total > 0
          ? Math.round((active / total) * 100)
          : 0;

            this.stats[2].value = completed;
   

      },
      error: err => console.error(err)
    });
}


}

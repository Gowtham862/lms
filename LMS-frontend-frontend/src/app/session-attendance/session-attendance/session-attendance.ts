import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface DashboardCard {
  title: string;
  value: string | number;
  image: string;
}

export interface DashboardCard2 {
  title: string;
  value: string | number;
  image: string;
}


@Component({
  selector: 'app-session-attendance',
  imports: [CommonModule,FormsModule],
  templateUrl: './session-attendance.html',
  styleUrl: './session-attendance.css',
})
export class SessionAttendance {
       activeTab: 'overview' | 'completion' | 'progress' = 'overview';

 
  setTab(tab: 'overview' | 'completion' | 'progress') {
    this.activeTab = tab;
  }

    cards: DashboardCard[] = [
      { title: 'Total Scheduled Sessions', value: 90, image: 'a-course.png' },
      { title: 'Total Completed Sessions', value: 22, image: 'a-course.png' },
      { title: 'Total Session Duration', value: 47, image: 'a-atten.png' },
      { title: 'Avg Session Completion Rate', value: 18, image: 'a-atten.png' },
    ];

        cards1: DashboardCard[] = [
      { title: 'Total Student Assigned', value: 90, image: 'a-course.png' },
      { title: 'Student Assigned', value: 22, image: 'a-course.png' },
      { title: 'Student Absent', value: 47, image: 'a-atten.png' },
      { title: 'Avg Attendance Per Session', value: 18, image: 'a-atten.png' },
    ];

    // session tabel

      sessions = [
    {
      course: 'CAPM® - Arabic Course',
      batch: 'Batch 1',
      module: 'Module Name',
      title: 'Session 1',
      planned: '3 Hours',
      actual: '2 Hours 50 Mins',
      status: 'Completed'
    },
    {
      course: 'CAPM® - Arabic Course',
      batch: 'Batch 1',
      module: 'Module Name',
      title: 'Session 1',
      planned: '3 Hours',
      actual: '2 Hours 50 Mins',
      status: 'In Progress'
    },
    {
      course: 'CAPM® - Arabic Course',
      batch: 'Batch 1',
      module: 'Module Name',
      title: 'Session 1',
      planned: '3 Hours',
      actual: '2 Hours 50 Mins',
      status: 'Scheduled'
    },
    {
      course: 'CAPM® - Arabic Course',
      batch: 'Batch 1',
      module: 'Module Name',
      title: 'Session 1',
      planned: '3 Hours',
      actual: '2 Hours 50 Mins',
      status: 'Cancelled'
    }
  ];

  getStatusClass(status: string) {
    return status.toLowerCase().replace(' ', '-');
  }

  viewDetails(row: any) {
    console.log(row);
  }

   activeView: 'session' | 'batch' | 'student' = 'session';

   sessionWiseData = [
    {
      title: 'Session 1',
      date: '10-01-2026',
      batch: 'Batch 1',
      module: 'Module Name',
      trainer: 'Thariq A',
      total: 20,
      present: 5,
      absent: 15,
      percent: 25
    },
    {
      title: 'Session 2',
      date: '10-01-2026',
      batch: 'Batch 1',
      module: 'Module Name',
      trainer: 'Thariq A',
      total: 20,
      present: 15,
      absent: 5,
      percent: 75
    },
    {
      title: 'Session 3',
      date: '10-01-2026',
      batch: 'Batch 1',
      module: 'Module Name',
      trainer: 'Thariq A',
      total: 20,
      present: 18,
      absent: 2,
      percent: 90
    }
  ];

  /* ================= BATCH WISE ================= */
  batchWiseData = [
    {
      batch: 'Batch 1',
      trainer: 'Thariq A',
      total: 20,
      held: 12,
      avg: 88,
      bestDate: '01-01-2026',
      bestPercent: 93,
      worstDate: '08-01-2026',
      worstPercent: 25
    }
  ];

  /* ================= STUDENT WISE ================= */
  studentWiseData = [
    {
      id: '12345',
      name: 'Yaqoob Y',
      batch: 2,
      total: 12,
      attended: 3,
      percent: 25,
      lastAbsent: '08-01-2026',
      risk: 'High'
    },
    {
      id: '12345',
      name: 'Yaqoob Y',
      batch: 2,
      total: 12,
      attended: 9,
      percent: 75,
      lastAbsent: '04-01-2026',
      risk: 'Medium'
    },
    {
      id: '12345',
      name: 'Yaqoob Y',
      batch: 2,
      total: 12,
      attended: 11,
      percent: 95,
      lastAbsent: '11-12-2025',
      risk: 'Low'
    }
  ];

  setView(view: 'session' | 'batch' | 'student') {
    this.activeView = view;
  }

  percentClass(value: number) {
    if (value >= 90) return 'green';
    if (value >= 70) return 'orange';
    return 'red';
  }
}

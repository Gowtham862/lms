import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendance.html',
  styleUrls: ['./attendance.scss']
})
export class Attendance {

  stats = [
  {
    title: 'Average In Time',
    value: '11:11:23',
    change: '+3% from November',
    positive: true,
    icon: 'fa-solid fa-right-to-bracket'
  },
  {
    title: 'Average Out Time',
    value: '13:24:12',
    change: '+1% from November',
    positive: true,
    icon: 'fa-solid fa-right-from-bracket'
  },
  {
    title: 'Average Present Time',
    value: '01:32:56',
    change: '-2% from November',
    positive: false,
    icon: 'fa-solid fa-clock'
  },
  {
    title: 'Total Absent Days',
    value: '3 Days',
    change: '',
    positive: true,
    icon: 'fa-solid fa-user-xmark'
  }
];
currentYear = 2025;
currentMonthIndex = 11; // December (0-based)
currentMonthName = 'December';

weekDays = ['Su','Mo','Tu','We','Th','Fr','Sa'];

// Days array (includes 0 for empty slots)
calendarDays: number[] = [];

// Example absent days (can come from API later)
absentDays = [14, 15];

ngOnInit() {
  this.generateCalendar();
}

generateCalendar() {
  this.calendarDays = [];

  const firstDay = new Date(
    this.currentYear,
    this.currentMonthIndex,
    1
  ).getDay();

  const daysInMonth = new Date(
    this.currentYear,
    this.currentMonthIndex + 1,
    0
  ).getDate();

  // Empty slots for weekday alignment
  for (let i = 0; i < firstDay; i++) {
    this.calendarDays.push(0);
  }

  // Actual dates
  for (let d = 1; d <= daysInMonth; d++) {
    this.calendarDays.push(d);
  }

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


  attendanceLogs = [
    { date: '01-12-2025', in: '11:12:02', out: '12:40:02', total: '1 Hr 32 Mins' },
    { date: '02-12-2025', in: '11:12:02', out: '12:40:02', total: '1 Hr 32 Mins' },
    { date: '03-12-2025', in: '11:12:02', out: '12:40:02', total: '1 Hr 32 Mins' },
    { date: '04-12-2025', in: '11:12:02', out: '12:40:02', total: '1 Hr 32 Mins' },
    { date: '05-12-2025', in: '11:12:02', out: '12:40:02', total: '1 Hr 32 Mins' },
    { date: '06-12-2025', in: '11:12:02', out: '12:40:02', total: '1 Hr 32 Mins' },
    { date: '07-12-2025', in: '11:12:02', out: '12:40:02', total: '1 Hr 32 Mins' },
    { date: '08-12-2025', in: '11:12:02', out: '12:40:02', total: '1 Hr 32 Mins' },
    { date: '09-12-2025', in: '11:12:02', out: '12:40:02', total: '1 Hr 32 Mins' },
    { date: '10-12-2025', in: '11:12:02', out: '12:40:02', total: '1 Hr 32 Mins' }
  ];

}

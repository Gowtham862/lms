import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-batches-timeline',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './batches-timeline.html',
  styleUrl: './batches-timeline.css',
})
export class BatchesTimeline {

  viewType: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' = 'dayGridMonth';

  calendarOptions: any = {
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'dayGridMonth',
    firstDay: 1, 
    height: 'auto',

    headerToolbar: {
      left: '',
      center: '',
      right: ''
    },

    events: [
      {
        title: '11:00 (60 min)',
        start: '2026-01-02T11:00:00',
        end: '2026-01-02T12:00:00',
        backgroundColor: '#16a34a',
        borderRadius: '6px'
      },
      {
        title: '13:00 (120 min)',
        start: '2026-01-02T13:00:00',
        end: '2026-01-02T15:00:00',
        backgroundColor: '#16a34a'
      },
      {
        title: '13:00 (info here)',
        start: '2026-01-03T13:00:00',
        backgroundColor: '#eab308'
      },
      {
        title: '13:00 (info here)',
        start: '2026-01-11T13:00:00',
        backgroundColor: '#eab308'
      },
      {
        title: '13:00 (info here)',
        start: '2026-01-13T13:00:00',
        backgroundColor: '#eab308'
      }
    ]
  };

  changeView(view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay') {
    this.viewType = view;
    this.calendarOptions = {
      ...this.calendarOptions,
      initialView: view
    };
  }
}

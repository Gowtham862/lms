import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { liveclass } from '../../../core/services/liveclass/liveclass';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { CourseService } from '../../../course-management/course-service';
 
export interface Course {
  courseid: string;
  coursename: string;
   coursedesc: string;
 
}
export interface Createbatch{
 
  // course: Course | null;
    course: Course | null;
  batchNo: string | number;
  trainingMode: string;
  capacity: string | number;
  startDate: string;
  endDate: string;
  primarytrainerid: string | number;
  primarytrainername: string;
 
 
 
 
}
export interface CreateBatchPayload {
  courseid: string;
  batchno: string | number;
  trainingmode: string;
  studentcapacity: string | number;
  startdate: string;
  enddate: string;
}
@Component({
  selector: 'app-create-batch',
  imports: [FormsModule,CommonModule],
  templateUrl: './create-batch.html',
  styleUrl: './create-batch.scss',
})
export class CreateBatch {
  submitted = false;
  trainers: { trainerid: number, trainername: string }[] = [];
  courseSelected = false;
@Output() batchCreated = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  constructor(private service:liveclass,private location:Location, private courseService: CourseService, ){}
      course: Course[] = [];
      minDate: string = ''; 
  ngOnInit(): void {
         this.getLiveCourses();
         this.loadTrainers();
          const today = new Date();
  this.minDate = today.toISOString().split('T')[0]; 
  }
 
batch: Createbatch = {
  course: null,  
  batchNo: '',
  trainingMode: '',
  capacity: '',
  startDate: '',
  endDate: '',
   primarytrainerid: '',
  primarytrainername: ''
   
 
};
goBack() {
    this.close.emit();
  }
 
    getLiveCourses() {
    this.service.publishedcourses().subscribe({
      next: (res: any) => {
          this.course = res.data.map((item: any) => ({
        courseid: item.courseid,
        coursename: item.coursename,
        coursedesc: item.coursedesc
      }));
        console.log(this.course)
     
      },
      error: (err) => {
        console.error('Error fetching courses', err);
      }
    });
  }
onTrainerChange(trainerid: any) {
  const selected = this.trainers.find(t => t.trainerid == trainerid);
  this.batch.primarytrainername = selected ? selected.trainername : '';
  console.log('Selected Trainer:', this.batch.primarytrainerid, this.batch.primarytrainername);
}
loadTrainers() {
    this.service.GetTrainers().subscribe({
      next: (res: any) => {
        console.log('Trainer API raw response:', res);
       this.trainers = (res.data || [])
        .filter((t: any) => t.trainerstatus === 'Active')  
        .map((t: any) => ({
          trainerid: t.trainerid,
          trainername: t.trainername
        }));
         console.log('Mapped trainers in Edit:', this.trainers);
      },
      error: err => console.error('Error loading trainers', err)
    });
  }
 
createBatch() {
   this.submitted = true;
  if (!this.batch.course) return;
   if (!this.batch.batchNo || Number(this.batch.batchNo) < 1) {
    return;
  }


  if (!this.batch.batchNo || Number(this.batch.batchNo) < 1) {
    return;
  }
  if (!this.batch.trainingMode) {
    return;
  }
  if (!this.batch.capacity) {
    return;
  }
  if (!this.batch.startDate) {
    return;
  }
  if (!this.batch.endDate) {
    return;
  }
  if (!this.batch.primarytrainerid) {
    return;
  }
 
  if (this.courseSelected && this.modules.length > 0) {
    for (let i = 0; i < this.modules.length; i++) {
      const module = this.modules[i];

      // Check if sessions are added
      if (!module.sessions || module.sessions.length === 0) {
        alert(`Please add session details for Module ${i + 1}: ${module.moduleName}`);
        return;
      }

      // Check if each session has all fields filled
      for (let j = 0; j < module.sessions.length; j++) {
        const session = module.sessions[j];

        if (!session.sessionstartdate) {
          alert(`Module ${i + 1} - Session ${j + 1}: Start Date is required`);
          return;
        }
        if (!session.starttime) {
          alert(`Module ${i + 1} - Session ${j + 1}: Start Time is required`);
          return;
        }
        if (!session.sessionenddate) {
          alert(`Module ${i + 1} - Session ${j + 1}: End Date is required`);
          return;
        }
        if (!session.endtime) {
          alert(`Module ${i + 1} - Session ${j + 1}: End Time is required`);
          return;
        }
      }
    }
  }
  const totalSessions = this.modules.reduce(
    (sum, m) => sum + (m.sessions?.length || 0),
    0
  );
 
  const payload = {
    courseid: this.batch.course.courseid,
    coursename: this.batch.course.coursename,
      coursedesc: this.batch.course.coursedesc,
    batchno: this.batch.batchNo,
    trainingmode: this.batch.trainingMode,
    studentcapacity: this.batch.capacity,
    startdate: this.batch.startDate,
    enddate: this.batch.endDate,
       primarytrainerid: +this.batch.primarytrainerid,       // cast to number with +
   primarytrainer: this.batch.primarytrainername,
    status: 'Active',
    totalsessions: totalSessions,
 
    modules: this.modules.map(m => ({
      moduleNo: m.moduleNo,
      moduleName: m.moduleName,
      sessionDuration: m.sessionDuration,
      totalsession: m.totalsession,
     
      sessions: m.sessions || []
    }))
  };
 
  console.log('FINAL PAYLOAD →', payload);
 
  this.service.addbatchdata(payload).subscribe({
    next: () => {
      this.showSuccessModal = true;
      this.batchCreated.emit();
      // this.close.emit();
    },
    error:(err) => {
      if (err.status === 409) {
        alert(err.error?.message || 'This batch number already exists for this course. Please use a different batch number.');
      } else if (err.status === 400) {
        alert('Invalid batch data. Please check your inputs.');
      } else {
        alert('Something went wrong. Please try again.');
      }
      console.error('Batch creation error:', err);
    }
  });
}
 
 
 
 
  courseOptions = [
    '1 Month',
    '3 Months',
    '6 Months',
    '12 Months'
  ];
 
  batchNos = [1, 2, 3, 4, 5];
 
  trainingModes = [
    'Online',
    'Offline'
  ];
 
  // for session
SessionModal = false;
 
courseName: string = '';   // Fix for courseName error
 
currentModule: any;
 
sessionList: any[] = [];
/* ================= MODULES (UI ONLY) ================= */
 
// modules: any[] = [];
 
// modules: any[] = [{
//     moduleName: '',
//     sessionDuration: '',
//     totalsession: 0
//   }];
 
modules: any[] = [];
 
 
openSessionModal(module: any) {
 
  if (!module) return;
 
  this.currentModule = module;
 
  const total = Number(module.totalsession);
 
  if (!total || total <= 0) {
    alert('Please enter total sessions');
    return;
  }
 
 
 if (module.sessions?.length) {
  this.sessionList = module.sessions.map((s: any) => ({
    sessionNo: s.sessionNo,
    startDate: s.sessionstartdate,
    startTime: s.starttime,
    endDate: s.sessionenddate,
    endTime: s.endtime
  }));
}
  /* Else create empty rows */
  else {
    this.sessionList = Array.from(
      { length: total },
      (_, i) => ({
        sessionNo: i + 1,
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: ''
      })
    );
  }
 
  this.SessionModal = true;
}
 
showSuccessModal = false;
 
 closeSuccessModal() {
  this.showSuccessModal = false;
  this.batchCreated.emit();
  this.close.emit();  
}
 
 
 
closeSessionModal() {
  this.SessionModal = false;
}
 
saveSessionDetails() {
 
  if (!this.currentModule) return;
  for (let i = 0; i < this.sessionList.length; i++) {
    const s = this.sessionList[i];

    if (!s.startDate) {
      alert(`Session ${i + 1}: Start Date is required`);
      return;
    }
    if (!s.startTime) {
      alert(`Session ${i + 1}: Start Time is required`);
      return;
    }
    if (!s.endDate) {
      alert(`Session ${i + 1}: End Date is required`);
      return;
    }
    if (!s.endTime) {
      alert(`Session ${i + 1}: End Time is required`);
      return;
    }

    
    if (s.endDate < s.startDate) {
      alert(`Session ${i + 1}: End Date cannot be before Start Date`);
      return;
    }
        const startDateTime = new Date(`${s.startDate}T${s.startTime}`);
    const endDateTime   = new Date(`${s.endDate}T${s.endTime}`);

    if (isNaN(startDateTime.getTime())) {
      alert(`Session ${i + 1}: Invalid Start Date or Time`);
      return;
    }
    if (isNaN(endDateTime.getTime())) {
      alert(`Session ${i + 1}: Invalid End Date or Time`);
      return;
    }

    
    if (endDateTime <= startDateTime) {
      alert(`Session ${i + 1}: End Date & Time must be after Start Date & Time`);
      return;
    }
  }

  // ✅ Check sessions don't overlap each other
  for (let i = 0; i < this.sessionList.length - 1; i++) {
    const current = this.sessionList[i];
    const next    = this.sessionList[i + 1];

    const currentEnd  = new Date(`${current.endDate}T${current.endTime}`);
    const nextStart   = new Date(`${next.startDate}T${next.startTime}`);

    if (nextStart < currentEnd) {
      alert(`Session ${i + 2} overlaps with Session ${i + 1}. Please fix the times.`);
      return;
    }
  }

  
  /* Convert UI fields → API format */
  this.currentModule.sessions = this.sessionList.map((s: any) => ({
    sessionNo: s.sessionNo,
    starttime: s.startTime,
    endtime: s.endTime,
    sessionstartdate: s.startDate,
    sessionenddate: s.endDate
  }));
 
  console.log(
    'Saved sessions for module:',
    this.currentModule.moduleName,
    this.currentModule.sessions
  );
 
  this.SessionModal = false;
}
 
// onCourseChange(course: Course | null) {
 
//   this.courseSelected = !!course;
 
//   if (!course) {
//     this.modules = [];
//     return;
//   }
 
//   /* Create module rows dynamically */
//   this.modules = [
//     {
//       moduleName: 'Introduction',
//       sessionDuration: '1 Hour',
//       totalsession: 0   // start empty
//     },
//     {
//       moduleName: 'Advanced Topics',
//       sessionDuration: '2 Hours',
//       totalsession: 0
//     }
//   ];
 
//   this.courseName = course.coursename;
// }
 
 
onCourseChange(course: Course | null) {
 
  this.courseSelected = !!course;
 
  if (!course) {
    this.modules = [];
    return;
  }
 
  this.courseName = course.coursename;
 
  /* 🔥 CALL API BY ID */
  this.courseService.getCourseById(course.courseid)
    .subscribe({
      next: (res: any) => {
 
        console.log('Course By ID Response:', res);
 
        /* Map modules from API */
      this.modules = (res.data.modules || []).map((m: any, i: number) => ({
  moduleNo: i + 1,
  moduleName: m.moduleName,
  sessionDuration: m.sessionDuration,
  totalsession: m.totalsession || 0,
  sessions: m.sessions ? m.sessions.map((s: any) => ({
    sessionNo: s.sessionNo,
    starttime: s.starttime,
    endtime: s.endtime,
    sessionstartdate: s.sessionstartdate,
    sessionenddate: s.sessionenddate
  })) : []
}));
 
 
        console.log('Modules loaded:', this.modules);
      },
      error: err => {
        console.error('Failed to load modules', err);
      }
    });
}
 
 
// modules: any[] = [
//   {
//     moduleName: 'Introduction',
//     sessionDuration: '1 Hour',
//     totalsession: 2
//   }
// ];
 
   
}
 
 
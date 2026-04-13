
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { EventEmitter, Input, Output } from '@angular/core';
import { liveclass } from '../../../core/services/liveclass/liveclass';
import {  Metadata } from '../batch-management';
import { Session } from '../edit/edit';
import { TrainerService } from '../../../trainer-management/trainer-service';
import { CourseService } from '../../../course-management/course-service';



export interface Batch {
  batchId: number;
  batchno: string;
  course: Course;
  batchstartdate: string;
  status: string;
  batchendate:string;
  maxstudentcapacity:string;
}

export enum BatchStatus {
  ACTIVE = 'Active',
  INACTIVE = 'InActive',
  DEACTIVATED='Deactivated'
}
export interface Module {
  moduleId: string;
  moduleName: string;
  moduleDescription: string;
  moduleDuration: string;
  // startDate: string;
  // endDate: string;
  // startTime: string;
  // endTime: string;
   sessions: Session[];
   moduleNo?: number;
}

interface Student {
  studentName: string;
  enrollmentDate: string;
  assignedDate: string;
  courseName: string;
  batchNo: number;
}
export interface Course {
  adminId: string;
  courseid: number;
  adminname: string;
  coursename: string;
  coursecategory: string;
  courselevel: string;
  certificateavalibility: string;
  noofmodule: string;
  courseduration: string;
  status: string;
  rating: number;
  coursedesc: string;
  modules: Module[];
  metadata: Metadata[];
  moduleCount: string;
  language: string;
  trainingmode: string;
}

export interface Batch {
  batchId: number;
  batchno: string;
  course: Course;
  batchstartdate: string;
  status: string;
batchendate:string;

  maxstudentcapacity:string;
}
@Component({
  selector: 'app-activate-batch',
  standalone:true,
  imports: [FormsModule,CommonModule],
  templateUrl: './activate-batch.html',
  styleUrl: './activate-batch.css',
})
export class ActivateBatch implements OnInit{
 submitted = false;
   activeTab: 'modules' | 'students' = 'modules';
    constructor(private trainerService: TrainerService,
      private courseService: CourseService,
        private liveclassservice:liveclass,
        private getllcourses:liveclass){}

      minDate: string = '';
    ngOnInit() {
      this.loadTrainers();
      const today = new Date();
  this.minDate = today.toISOString().split('T')[0];
}




batch: any = {};
  batches: any[] = [];   
//  minDate: string = ''; 
students: any[] = [];
getStudents() {
  console.log('=== getStudents called ===');
  console.log('batchId:', this.batch?.batchId);

  if (!this.batch?.batchId) return;

  this.liveclassservice.getAllStudents(this.batch.batchId).subscribe({
    next: (res: any) => {
      console.log('Student API Response:', res);

      if (res?.status === 200 && Array.isArray(res?.data)) {
        this.students = res.data;
      } else {
        this.students = [];
      }

      console.log('Students assigned:', this.students);
    },
    error: err => {
      console.error('Student API error:', err);
      this.students = [];
    }
  });
}
 
  getTrainerName(trainerId: any): string {
  if (!trainerId) return '';

  const trainer = this.trainers.find(
    t => String(t.trainerid) === String(trainerId)
  );

  return trainer ? trainer.trainername : '';
}

  goback()
  {
    history.back()
  }

  
modules: Module[] = [];
  trainers: { trainerid: number, trainername: string }[] = [];

   @Input() course: any;   
  @Output() close = new EventEmitter<{ batchId: number; status: BatchStatus}>();

 @Input() set data(value: any) {
  if (!value) return;

 
  this.batch = {
    batchId: value.batchId,
    courseName: value.coursename ?? '',           
    batchno: value.batchno ?? '',
    training_ngmode: value.trainingmode ?? '',      
    maxstudentcapacity: value.studentcapacity ?? '',
    batchstartdate: value.batchstartdate ?? '',
    batchendate: value.batchendate ?? '',
    primarytrainerid: value.primarytrainerid ?? '',
    // primarytrainer: value.primarytrainer ?? '' ,

  };
const rawModules = value.course?.modules || value.modules || [];

this.modules = rawModules.map((m: any, i: number) => ({
  moduleNo: i + 1,
  moduleName: m.moduleName,
  moduleDuration: m.moduleDuration ?? m.sessionDuration ?? '',
  sessions: (m.sessions || []).map((s: any) => ({
    sessionNo: s.sessionNo,
    startTime: s.starttime,
    endTime: s.endtime,
    startDate: s.sessionstartdate,
    endDate: s.sessionenddate,
    completed: s.completed
  }))
}));

console.log('Modules loaded in Activate:', this.modules);
  // Map modules
  // this.modules = (value.modules || []).map((m: any, i: number) => ({
  //   moduleNo: i + 1,
  //   moduleName: m.moduleName,
  //   moduleDuration: m.moduleDuration,             // FIXED
  //   totalsession: m.totalsession || 0,
  //   sessions: (m.sessions || []).map((s: any) => ({
  //     sessionNo: s.sessionNo,
  //     startTime: s.starttime,
  //     endTime: s.endtime,
  //     startDate: s.sessionstartdate,
  //     endDate: s.sessionenddate,
  //     completed: s.completed
  //   })),
  //   sessionCount: (m.sessions || []).length
  // }));
 if (this.batch.batchId) {
    this.getStudents();
  }
  console.log('Modules loaded:', this.modules);
}

showSuccessModal = false;
closeSuccessModal() {
   this.showSuccessModal = false;

  this.close.emit({
    batchId: this.batch.batchId,
    status: BatchStatus.ACTIVE
  });
}

loadTrainers() {
    this.trainerService.GetTrainers().subscribe({
      next: (res: any) => {
        console.log('Trainer API raw response:', res);
        this.trainers = (res.data || []).map((t: any) => ({
          trainerid: t.trainerid,
          trainername: t.trainername,
        }));
         console.log('Mapped trainers in Edit:', this.trainers);
      },
      error: err => console.error('Error loading trainers', err)
    });
  }
getAllbatch() {
    this.getllcourses.getbatch().subscribe((res: any) => {
      console.log('Batch Response:', res);
     if (res.status === 200) {
      this.batches = res.data; 
      console.log('Batches array:', this.batches);
    }
  });
  }



updateCourseBatch(form: any) {
  if (form.invalid) {
    form.form.markAllAsTouched();
    return;
  }

  // Prepare modules with sessions
  const modulesPayload = this.modules.map(m => ({
    moduleNo: m.moduleNo,
    moduleName: m.moduleName,
    moduleDuration: m.moduleDuration,
    totalsession: m.sessions.length,
    sessions: m.sessions.map(s => ({
      sessionNo: s.sessionNo,
      starttime: s.startTime,
      endtime: s.endTime,
      sessionstartdate: s.startDate,
      sessionenddate: s.endDate,
     
    }))
  }));

  // Prepare full batch payload
  const updatedData = {
    batch_no: this.batch.batchno,
    trainingmode: this.batch.training_ngmode,
    studentcapacity: this.batch.maxstudentcapacity,
    batchstartdate: this.batch.batchstartdate,
    batchendate: this.batch.batchendate,
    primarytrainerid: this.batch.primarytrainerid,
    backuptrainerid: this.batch.backuptrainerid,
    primarytrainer: this.getTrainerName(this.batch.primarytrainerid),
    backuptrainer: this.getTrainerName(this.batch.backuptrainerid),
    status: 'Active', 
    modules: modulesPayload 
  };

  console.log('Payload to update batch with sessions:', updatedData);

  // Call API
  this.liveclassservice.updatebatch(this.batch.batchId, updatedData).subscribe({
    next: (res: any) => {
      this.batch.status = 'Active';
      console.log('Batch and sessions updated successfully:', res);
       this.showSuccessModal = true;
this.getStudents();

 
  this.activeTab = 'students';
      // Emit to parent component
      // this.close.emit({
      //   batchId: this.batch.batchId,
      //   status: BatchStatus.ACTIVE
      // });
    },
    error: (err) => {
      console.error('Failed to activate batch:', err);
      alert('Failed to activate batch');
    }
  });
}
deactivateBatch() {

  const confirmDeactivate = confirm(
    'Are you sure you want to deactivate this batch?'
  );

  if (!confirmDeactivate) return;

  const modulesPayload = this.modules.map(m => ({
    moduleNo: m.moduleNo,
    moduleName: m.moduleName,
    moduleDuration: m.moduleDuration,
    totalsession: m.sessions.length,
    sessions: m.sessions.map(s => ({
      sessionNo: s.sessionNo,
      starttime: s.startTime,
      endtime: s.endTime,
      sessionstartdate: s.startDate,
      sessionenddate: s.endDate
    }))
  }));

  const payload = {
    batch_no: this.batch.batchno,
    trainingmode: this.batch.training_ngmode,
    studentcapacity: this.batch.maxstudentcapacity,
    batchstartdate: this.batch.batchstartdate,
    batchendate: this.batch.batchendate,
    primarytrainerid: this.batch.primarytrainerid,
    backuptrainerid: this.batch.backuptrainerid,
    primarytrainer: this.getTrainerName(this.batch.primarytrainerid),
    backuptrainer: this.getTrainerName(this.batch.backuptrainerid),
    status: 'Deactivated',
    modules: modulesPayload
  };

  console.log('Deactivate payload:', payload);

  this.liveclassservice.updatebatch(this.batch.batchId, payload).subscribe({
    next: (res: any) => {

      this.batch.status = 'Deactivated';

      alert('Batch Deactivated Successfully');

      this.close.emit({
        batchId: this.batch.batchId,
        status: BatchStatus.DEACTIVATED
      });

    },
    error: (err) => {
      console.error('Failed to deactivate batch:', err);
      alert('Failed to deactivate batch');
    }
  });
}

/* ================= DELETE MODAL ================= */

showDeleteModal = false;

deleteType: 'module' | 'session' = 'module';

moduleToDelete: any;
sessionToDelete: any;

openDeleteModal(session?: any, module?: any) {

  if (session) {
    this.deleteType = 'session';
    this.sessionToDelete = session;
    this.moduleToDelete = module;
  } 
  else {
    this.deleteType = 'module';
    this.moduleToDelete = module;
  }

  this.showDeleteModal = true;
}

confirmDelete() {

  if (this.deleteType === 'module') {

    this.modules = this.modules.filter(
      m => m !== this.moduleToDelete
    );
  }

  if (this.deleteType === 'session') {

    this.moduleToDelete.sessions =
      this.moduleToDelete.sessions.filter(
        (s: any) => s !== this.sessionToDelete
      );
  }

  this.showDeleteModal = false;
}
closeDeleteModal() {
  this.showDeleteModal = false;
}

showEditModal = false;
selectedModule: any = null;
selectedSessions: any[] = [];

edit(module: Module) {
  this.selectedModule = module;
  this.selectedSessions = module.sessions || [];
  this.showEditModal = true;
}

// After editing session details in modal
saveSessionUpdates() {
  if (!this.selectedModule) return;

  this.selectedModule.sessions = [...this.selectedSessions];
  this.showEditModal = false;
}



closeEditModal() {
  this.showEditModal = false;
}

}

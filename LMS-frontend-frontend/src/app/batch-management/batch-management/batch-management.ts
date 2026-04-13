import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CreateBatch } from './create-batch/create-batch';
import { ActivateBatch } from './activate-batch/activate-batch';
import { Edit } from './edit/edit';
import { liveclass } from '../../core/services/liveclass/liveclass';
import { AddModules } from '../../course-management/add-modules/add-modules'; 

export interface DashboardCard {
  title: string;
  value: string | number;
  image: string;
  badgeText?: string;
  badgeType?: 'info' | 'success' | 'danger';
}
export interface Metadata {
  fileName: string;
  "File Size": string;
  "Detected File Type Long Name": string;
  "File Modified Date": string;
  "Detected File Type Name": string;
  "Detected MIME Type": string;
  "Expected File Name Extension": string;
  mimeType: string;
  "File Name": string;
  "Image Height": string;
  fileSizeKB: number;
  "Image Width": string;
}

export interface Module {
  moduleId: string;
  moduleName: string;
  moduleDescription: string;
  moduleDuration: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
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
  batchendate:string;
  presentStrength?:number;
   status: BatchStatus;
}

export interface BatchResponse {
  status: number;
  message: string;
  data: Batch[];
}

export enum BatchStatus {
  ACTIVE = 'Active',
  INACTIVE = 'InActive',
  COMPLETED='Completed',
   DEACTIVATED = 'Deactivated' 
}


@Component({
  selector: 'app-batch-management',
  standalone: true,
  imports: [CommonModule, CreateBatch, ActivateBatch, Edit],
  templateUrl: './batch-management.html',
  styleUrls:['./batch-management.css'],
})
export class BatchManagement {

 

  loadBatchDashboard() {
  this.getllcourses.gettotalbatch().subscribe({
    next: (res: any) => {
      const data = res?.data;
      if (!data) return;

      this.cards = [
        {
          title: 'Total Batches',
          value: data.totalBatches ?? 0,
          image: 'a-course.png',
        },
        {
          title: 'Total Active Batches',
          value: data.activeBatches ?? 0,
          image: 'a-course.png',
        },
        {
          title: 'Total Completed Batches',
          value: data.completedBatches ?? 0,
          image: 'a-atten.png',
        },
      ];
    },
    error: err => {
      console.error('Batch count API failed', err);
    }
  });
}

   constructor(private getllcourses:liveclass){}

   
   ngOnInit() {
    this.getAllbatch();
     this.loadBatchDashboard();
  }
 BatchStatus = BatchStatus;
  batches: any[] = [];
  // ---------- VIEW STATE ----------
  view: 'list' | 'create' | 'activate' | 'edit' = 'list';
  selectedCourse: any = null;
batchId!: number;

  // ---------- CARDS ----------
  cards: DashboardCard[] = [];

   hasActiveBatch: boolean = false;
  

  // ---------- NAVIGATION ----------
  openCreate() {
    this.view = 'create';
  }
goBack() {
    history.back();
  }


  // openActivate(batch: any) {
  //   this.selectedCourse = batch;
  //      this.view = 'activate';
  // }

  // ---------- batch-management.ts ----------
openActivate(batch: any) {
  if (!batch) return;

  
  const batchId = batch.batchId ?? batch.batchid;

  if (!batchId) {
    console.error('Batch ID is missing', batch);
    return;
  }


  this.getllcourses.findBatchbyid(batchId.toString()).subscribe({
    next: (res: any) => {
      if (!res?.data) {
        console.error('No batch data returned from API');
        return;
      }

    
      this.selectedCourse = {
        ...res.data,
        
        batchId: res.data.batchid,         
        batchno: res.data.batchno,
        batchstartdate: res.data.startdate,
        batchendate: res.data.enddate,

          primarytrainerid: res.data.primarytrainerid,
  primarytrainer: res.data.primarytrainer,
  totalsessions: res.data.totalsessions,

  modules: (res.data.modules || []).map((m: any, i: number) => ({
    moduleNo: m.moduleNo ?? i + 1,
    moduleName: m.moduleName,
    moduleDuration: m.sessionDuration,
    totalsession: m.totalsession,
    sessions: (m.sessions || []).map((s: any) => ({
      sessionNo: s.sessionNo,
      starttime: s.starttime,
      endtime: s.endtime,
      sessionstartdate: s.sessionstartdate,
      sessionenddate: s.sessionenddate,
      completed: s.completed
    }))
  }))
      };

      console.log('Full batch loaded for activate:', this.selectedCourse);

      // Switch view to ActivateBatch
      this.view = 'activate';
    },
    error: err => {
      console.error('Failed to load full batch', err);
      alert('Failed to load batch. Please try again.');
    }
  });
}


// openEdit(batch: any) {
//   this.selectedCourse = batch;
//   this.view = 'edit';
// }

openEdit(batch: any) {
  const batchId = batch.batchId ?? batch.batchid;
  if (!batchId) return;

  this.getllcourses.findBatchbyid(batchId.toString()).subscribe({
    next: (res: any) => {
      if (!res?.data) return;

     
      this.selectedCourse = {
        ...res.data,
        course: res.data.course ?? batch.course,
         batchId: res.data.batchId ?? res.data.batchid ?? batchId,
        maxstudentcapacity: res.data.maxstudentcapacity ?? batch.maxstudentcapacity ?? '',
        batchstartdate: res.data.batchstartdate ?? batch.batchstartdate ?? '',  
  batchendate: res.data.batchendate ?? batch.batchendate ?? '', 
      };

      this.view = 'edit'; 
    },
    error: (err) => {
      console.error('Failed to load batch for edit', err);
      alert('Failed to load batch. Please try again.');
    }
  });
}



onBatchCreated() {
  console.log('Batch created → reloading list');
  this.getAllbatch();           
  this.loadBatchDashboard();    
}
// backToList(updatedBatch?: { batchId: number; status: BatchStatus }) {
//   this.view = 'list';
//   this.selectedCourse = null;

backToList(updatedBatch?: { batchId: number; status: BatchStatus }) {
  this.view = 'list';
  this.selectedCourse = null;

  // Reload from backend immediately
  this.getAllbatch();
  this.loadBatchDashboard();
}


getAllbatch() {
  this.getllcourses.getbatch().subscribe((res: any) => {
    console.log('Batch Response:', res);
    if (res.status === 200) {
    this.batches = res.data.map((b: any) => ({
  ...b,
 status: b.status === 'Active'
  ? BatchStatus.ACTIVE
  : b.status === 'Completed'
    ? BatchStatus.COMPLETED
    : BatchStatus.INACTIVE,
presentStrength: 0
}));
this.batches.forEach(batch => {
        this.getStudentCount(batch);
      });
    }
  });
  console.log('Batches---->:', this. batches);
}
    

getStudentCount(batch: any) {
  console.log('batchid student', batch.batchId);

  this.getllcourses.getAllStudents(batch.batchId).subscribe((res: any) => {
    console.log('STUDENT BATCH ID', batch.batchId, res);

    if (res.status === 200) {
      batch.presentStrength = res.data.length;

      // console.log(`strength  ${batch.batchno}:`,batch.presentStrength);
    }
  });
}

}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { TrainerService } from '../../../trainer-management/trainer-service';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../course-management/course-service';
import { liveclass } from '../../../core/services/liveclass/liveclass';

export interface Metadata {
  fileName: string;
  'File Size': string;
  'Detected File Type Long Name': string;
  'File Modified Date': string;
  'Detected File Type Name': string;
  'Detected MIME Type': string;
  'Expected File Name Extension': string;
  mimeType: string;
  'File Name': string;
  'Image Height': string;
  fileSizeKB: number;
  'Image Width': string;
}

export interface Module {
  moduleId: string;
  moduleName: string;
  moduleDescription: string;
  sessionDuration: string;
  // startDate: string;
  // endDate: string;
  // startTime: string;
  // endTime: string;
  totalsession: Session[];
}
export interface Session {
  sessionNo: number;
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

interface Student {
  studentName: string;
  enrollmentDate: string;
  assignedDate: string;
  courseName: string;
  batchNo: number;
}
export interface Batch {
  batchId: number;
  batchno: string;
  course: Course;
  batchstartdate: string;

  status: string;
  batchendate: string;
  maxstudentcapacity: string;
}

export interface BatchResponse {
  status: number;
  message: string;
  data: Batch[];
}
@Component({
  selector: 'app-edit',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './edit.html',
  styleUrls: ['./edit.css'],
  template: `
    <h3>Edit Batch</h3>

    <p><b>Course:</b> {{ data?.courseName }}</p>
    <p><b>Batch No:</b> {{ data?.batchNo }}</p>

    <button (click)="close.emit()">Back</button>
  `,
})
export class Edit {
    submitted = false;
  activeTab: 'modules' | 'students' = 'modules';
  constructor(
    private trainerService: TrainerService,
    private courseService: CourseService,
    private liveclassservice: liveclass,
    private getllcourses: liveclass,
    
  ) {}
  ngOnInit(): void {
    this.loadTrainers();
  //   this.getstudent();
  //   if (this.batch?.modules) {
  //   this.modules = this.batch.modules;
  // }
  const today = new Date();
  this.minDate = today.toISOString().split('T')[0]; 
  }

  batch: any = {};
  batches: any[] = [];
  batchId!: number;
  isSubmitted = false;
  minDate: string = ''; 
  // batch = {
  //   batchId: 0,
  //   courseName: '',
  //   batchNo: '',
  //   trainingMode: '',
  //   maxstudentcapacity: '',
  //   batchstartdate: '',
  //   batchendate: '',
  //   primaryTrainer: '',
  //   backupTrainer: ''
  // };
  modules: Module[] = [];
  students: Student[] =[];
  trainers: { trainerid: number; trainername: string }[] = [];
pendingTrainerId: any = null;
  //  @Input() data: any;
  @Output() close = new EventEmitter<{ batchId: number; status: string }>();
private _data: any;



@Input() set data(value: any) {
  if (!value) return;

  this._data = value;

  this.batch = {
    batchId: value.batchId ?? 0,
    courseName: value.coursename ?? value.course?.coursename ?? '',
    batchNo: value.batchno ?? '',
    trainingMode: value.trainingmode ?? value.course?.trainingmode ?? '',
    maxstudentcapacity: value.maxstudentcapacity ?? '',
    batchstartdate: value.batchstartdate ?? '',
    batchendate: value.batchendate ?? '',
    primarytrainerid: String(value.primarytrainerid ?? ''),
    primarytrainer: value.primarytrainer ?? '',
    status: value.status ?? 'Active',
  };

  this.pendingTrainerId = String(value.primarytrainerid ?? '');

 
  const rawModules = value.course?.modules || value.modules || [];

  this.modules = rawModules.map((m: any, i: number) => ({
    moduleNo: m.moduleNo ?? i + 1,
    moduleName: m.moduleName ?? '',
    sessionDuration: m.sessionDuration ?? m.moduleDuration ?? '',  
    totalsession: m.totalsession ?? [],
  }));

  console.log('Modules mapped in edit:', this.modules);

  if (this.batch.batchId) {
    this.getstudent();
  }
}
get data() { return this._data; }
 

  getAllbatch() {
    this.getllcourses.getbatch().subscribe((res: any) => {
      console.log('Batch Response:', res);
      if (res.status === 200) {
        this.batches = res.data; 
        console.log('Batches array:', this.batches);
      }
    });
  }
  loadTrainers() {
    console.log('Mapped trainers in Edit:');
    this.trainerService.GetTrainers().subscribe({
      next: (res: any) => {
        console.log('Trainer API raw response:', res);
        this.trainers = (res.data || []).map((t: any) => ({
          trainerid: t.trainerid,
          trainername: t.trainername,
        }));

         if (this.pendingTrainerId) {
        this.batch.primarytrainerid = this.pendingTrainerId;
      }
        console.log('Mapped trainers in Edit:', this.trainers);
      },
      error: (err) => console.error('Error loading trainers', err),
    });
  }

   getstudent(){
    this.liveclassservice.getAllStudents(this.batch.batchId).subscribe((res:any)=>{
      console.log('Students Response:', res);
      if(res.status===200){
        this.students=res.data;
        console.log('Students array:',this.students);
      }
    });
  }
  getTrainerName(trainerId: any): string {
    if (!trainerId) return '';

    const trainer = this.trainers.find((t) => String(t.trainerid) === String(trainerId));

    return trainer ? trainer.trainername : '';
  }

  toastMessage = '';
  showToast = false;
  showErrorToast(message: string) {
    this.toastMessage = message;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  isDeactivated = false;
showSuccessModal = false;
closeSuccessModal() {
   this.showSuccessModal = false;
    this.close.emit({
    batchId: this.batch.batchId,
    status: this.batch.status,
  });
}
  updateCourseBatch(form: any) {
    if (form.invalid) {
      form.form.markAllAsTouched();
      return;
    }

    const updatedData = {
      batch_no: this.batch.batchNo,
      training_ngmode: this.batch.trainingMode,
      Student_capacity: this.batch.maxstudentcapacity,
      start_data: this.batch.batchstartdate,
      end_date: this.batch.batchenddate,
      primarytrainerid: +this.batch.primarytrainerid,

      backuptrainerid: +this.batch.primarytrainerid,

      primarytrainer: this.getTrainerName(this.batch.primarytrainerid),
     

       status: this.batch.status || 'Active'
    };
    
    console.log('Payload success:', updatedData);
console.log("FINAL PAYLOAD:", JSON.stringify(updatedData, null, 2));

    this.liveclassservice.updatebatch(this.batch.batchId, updatedData).subscribe({
      next: (res: any) => {
            console.log('Payload success:', updatedData);
        this.batch.status = 'Active';
        this.showSuccessModal = true;
        // this.close.emit({
        //   batchId: this.batch.batchId,
        //   status: this.batch.status,
        // });
      },
      error: (err) => {
        console.error('Batch update failed:', err);
        alert('Update failed');
      },
    });
  }

  // deactivateBatch() {
  //   this.batch.status = 'Active';
  //   this.batch.uiStatus = 'Deactive';
  // }


// markAsCompleted() {
//   if (!this.batch.batchId) return;

//   const payload = {
//     batch_no: this.batch.batchNo,
//       training_ngmode: this.batch.trainingMode,
//       Student_capacity: this.batch.maxstudentcapacity,
//       start_data: this.batch.batchstartdate,
//       end_date: this.batch.batchenddate,
//       primarytrainerid: +this.batch.primarytrainerid,

//       backuptrainerid: +this.batch.primarytrainerid,

//       primarytrainer: this.getTrainerName(this.batch.primarytrainerid),
      

//       status: 'Completed',
//   };

//   console.log('Marking batch as Completed:', payload);

//   this.liveclassservice
//     .updatebatch(this.batch.batchId, payload)
//     .subscribe({
//       next: (res: any) => {
//         this.batch.status = 'Completed';
//         this.showSuccessModal = true;

//         this.close.emit({
//           batchId: this.batch.batchId,
//           status: 'Completed'
//         });
//       },
//       error: (err) => {
//         console.error('Failed to complete batch:', err);
//         alert('Failed to mark batch as Completed');
//       }
//     });
// }
markAsCompleted() {
  if (!this.batch.batchId) return;

  
  this.batch.status = 'Completed';

  alert('Batch marked as Completed. Click Save Changes to confirm.');
}

}

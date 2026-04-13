import { Courses } from './../courses/courses';
import { routes } from './../app.routes';
import { AuthService } from './../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AddModules } from './add-modules/add-modules';
import { ApiService } from '.././core/services/api.service';
import { CourseService } from './course-service';
import { environment } from '../../environments/environment';
import { liveclass } from '../core/services/liveclass/liveclass';
 
export interface DashboardCard {
  title: string;
  value: string | number;
  image: string;
  badgeText?: string;
  badgeType?: 'info' | 'success' | 'danger';
}
// interface Module {
//     moduleId: string;
//     moduleName: string;
//     moduleDescription: string;
//     moduleDuration: string;
//     // startDate: string;
//     // endDate: string;
//     // startTime: string;
//     // endTime: string;
//     // sessions: Session[];
//     // sessionCount?: number;
//   }
interface Module {
  moduleNo: number;
  moduleName: string;
  sessionDuration: string;
  totalsession: string;
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
interface Course {
  adminname: string;
  adminId: string;
  courseid: string;
  coursename: string;
  rating: number;
  coursedesc: string;
  coursecategory: string;
  courseduration: string;
  trainingmode: string;
  courselevel: string;
  language: string;
  certificateavalibility: string;
  noofmodule: string;
  modules: Module[];
  // sessionCount?: string;
  moduleCount: number;
  status: 'Unpublished' | 'Published' | 'Archived';
 /* NEW FIELDS */
  recommendedCourseIds?: string[];
  price?: number;
  discount?: number;
  metadata?: Metadata[];
  thumbnailUrl?: string;
}
interface Metadata {
  fileName: string;
  mimeType: string;
  width: number;
  height: number;
  fileSizeKB: number;
}
export enum CourseStatus {
  Unpublished = 'Unpublished',
  Published = 'Published',
  Archived = 'Archived',
}
 
export enum BatchStatus {
  ACTIVE = 'Active',
  INACTIVE = 'InActive'
}
 
@Component({
  selector: 'app-course-management',
  imports: [CommonModule, FormsModule, RouterLink, AddModules],
  templateUrl: './course-management.html',
  styleUrl: './course-management.css',
})
export class CourseManagement implements OnInit {
  private baseUrl = environment.imagebaseurl;

  loadCourseCounts() {
    this.liveService.getcoursedetails().subscribe({
      next: (res: any) => {
        const data = res?.data;
 
        if (!data) return;
 
        this.cards = [
          {
            title: 'Total Courses',
            value: data.totalCourses ?? 0,
            image: 'a-course.png',
          },
          {
            title: 'Total Published Courses',
            value: data.publishedCourses ?? 0,
            image: 'a-course.png',
          },
          {
            title: 'Total Archived Courses',
            value: data.archived ?? 0,
            image: 'a-atten.png',
          },
        ];
      },
      error: (err) => {
        console.error('Course count API failed', err);
      },
    });
  }
  loading: boolean = false;
  cards: DashboardCard[] = [];
  showSuccessModal = false;
  // closeSuccessModal() {
  //   this.showSuccessModal = false;
  // }
  closeSuccessModal() {
  this.showSuccessModal = false;
  this.showCreateForm = false;
   this.resetCourseForm();
  this.loadCourses();          
}
 
  searchText = '';
 
  get CoursesOverviewList(): any[] {
  if (!this.searchText) {
    return this.courses;
  }
 
  return this.courses.filter(item =>
    item.coursename?.toLowerCase().includes(this.searchText.toLowerCase()) ||
    // item. courseid?.includes(this.searchText.toLowerCase()) ||
    item.status?.toLowerCase().includes(this.searchText.toLowerCase())
  );
}
  courses: Course[] = [];
  course: Course = {
    adminId: this.getuserid(),
    adminname: this.getUserName(),
    courseid: '',
    coursename: '',
    rating: 5,
    coursedesc: '',
    coursecategory: '',
    courseduration: '',
    trainingmode: '',
    courselevel: '',
    language: '',
    certificateavalibility: '',
    // sessionCount:'',
    noofmodule: '0',
    moduleCount: 0,
    status: 'Unpublished',
    modules: [],
 recommendedCourseIds: [],
  price: 0,
  discount: 0
  };
 
  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private liveService: liveclass,
private getllcourses:liveclass
  ) {}
 
  ngOnInit() {
    this.loadCourses();
    this.loadCourseCounts();
 this.getAllbatch();
    const adminname = this.getUserName();
    const adminid = this.getuserid();
  }
isSelected(course: any): boolean {
  return this.selectedCourses.some(c => c.courseid === course.courseid);
}
 

  //  BatchStatus = BatchStatus;
    batches: any[] = [];
    // ---------- VIEW STATE ----------
    view: 'list' | 'create' | 'activate' | 'edit' = 'list';
    // selectedCourse: any = null;
  batchId!: number;
  selectedCourseId: string = '';
 
  getAllbatch() {
    this.getllcourses.getbatch().subscribe((res: any) => {
      console.log('Batch Response:', res);
      if (res.status === 200) {
      this.batches = res.data.map((b: any) => ({
    ...b,
   status: b.status === 'Active' ? BatchStatus.ACTIVE : BatchStatus.INACTIVE,
   presentStrength:0
  }));
  // this.batches.forEach(batch => {
  //         this.getStudentCount(batch);
  //       });
      }
    });
    console.log('Batches---->:', this. batches);
  }
showDropdown = false;
selectedCourses: any[] = [];
 
toggleDropdown() {
  this.showDropdown = !this.showDropdown;
}
 
onCourseCheckboxChange(event: any, course: any) {
  if (event.target.checked) {
    this.selectedCourses.push(course);
  } else {
    this.selectedCourses =
      this.selectedCourses.filter(
        c => c.courseid !== course.courseid
      );
  }
  console.log('selectedCourses now:', this.selectedCourses);
}
 
getSelectedCourseNames() {
  return this.selectedCourses
    .map(c => c.coursename)
    .join(', ');
}
  onModulesAdded(modules: Module[]) {
    console.log('Modules received from child:', modules);
 
    /* Assign modules to course payload */
    this.course.modules = modules;
 
    /* Update counts */
    this.course.noofmodule = modules.length.toString();
    this.course.moduleCount = modules.length;
 
  /* NEW → Recommended Course IDs */
  // this.course.recommendedCourseIds =
  //   this.selectedCourses.map(c => c.courseid);
   this.course.recommendedCourseIds = this.selectedCourses.map(c => String(c.courseid));

  console.log('recommendedCourseIds to save:', this.course.recommendedCourseIds);
  console.log('Final Course Payload →', this.course);
 
    /* Close module screen */
    this.showAddModules = false;
 
    /* Trigger API */
    this.submitCourse();
  }
 
  resetCourseForm() {
  this.course = {
    adminId: this.getuserid(),
    adminname: this.getUserName(),
    courseid: '',
    coursename: '',
    rating: 5,
    coursedesc: '',
    coursecategory: '',
    courseduration: '',
    trainingmode: '',
    courselevel: '',
    language: '',
    certificateavalibility: '',
    noofmodule: '0',
    moduleCount: 0,
    status: 'Unpublished',
    modules: [],
  };
 
  this.imageFile = null;
  this.photoPreview = null;
}
 
 
  getUserName(): string {
    return localStorage.getItem('currentUser') || 'User';
  }
  getuserid(): string {
    return localStorage.getItem('userId') || '';
  }
  showCreateForm = false;
  showAddModules = false;
 
  selectedCourse!: Course;
  editedStatus!: CourseStatus;
 
  openCreateForm() {

     this.resetCourseForm();   
  this.selectedCourses = [];
  this.photoPreview = null;  
  this.imageFile = null;   
    this.showCreateForm = true;
    this.showAddModules = false;
  }
  showModules = false;
 
  closeCreateForm() {
    this.showCreateForm = false;
  }
  showModulesSection = false;
 
  onCourseFormChange() {
    this.showModulesSection = true;
  }
  goBack() {
    this.showCreateForm = false;
    this.showAddModules = false;
  }
 
  loadCourses() {
    console.log('loadCourses() called');
    this.courseService.GetAllCourses().subscribe({
      next: (res: any) => {
        console.log('GET ALL RESPONSE:', res);
 
        this.courses = res.data.map((course: any) => {
          let status: 'Published' | 'Archived' | 'Unpublished' = 'Unpublished';
          if (course.status) {
            const s = course.status.toString().toLowerCase();
            if (s === 'published') status = 'Published';
            else if (s === 'archived') status = 'Archived';
          }
 
          const sessionCount = course.modules
            ? course.modules.reduce((sum: number, mod: any) => sum + (mod.sessions?.length || 0), 0)
            : 0;
          console.log(sessionCount);
 
          // Thumbnail logic
          let thumbnailUrl = 'assets/course-placeholder.png';
          if (course.metadata?.length > 0) {
            const imageMeta = course.metadata.find((m: Metadata) =>
              m.mimeType?.startsWith('image')
            );
            if (imageMeta) {
              console.log(this.baseUrl);
              thumbnailUrl = `${this.baseUrl}${imageMeta.fileName}`;
            }
          }
 
          return { ...course, status, thumbnailUrl };
        });
      },
      error: (err) => {
        console.error('failed to fetch', err);
      },
    });
  }
 
 
  submitCourse() {
    const formData = new FormData();
 
   
    if (this.imageFile) {
      formData.append('file', this.imageFile);
    }
 

    const payload = {
      ...this.course,
      modules: this.course.modules,
    };
 
    console.log('Submitting payload →', payload);
 
    formData.append(
      'course',
      new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      })
    );
 
    this.loading = true;
 
    this.courseService.AddCourse(formData).subscribe({
      next: (res) => {
        this.loading = false;
 
        console.log('Course created:', res);
 
        this.showSuccessModal = true;
 
        this.loadCourses();
 
        // this.showCreateForm = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Create course failed:', err);
        alert('Failed to create course');
      },
    });
  }
 
  trainerPhotoFile: File | null = null;
  courseFile: File | null = null;
  imageFile: any;
  onCourseFileSelect(event: any) {
    const courseFile = event.target.files[0];
    this.imageFile = courseFile;
    // console.log('Selected course file:3333333333', this.courseFile?.name);
    console.log('Selected course', courseFile.name);
 
    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview = reader.result as string;
    };
    reader.readAsDataURL(courseFile);
  }
 
  photoPreview: string | null = null;
  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
 
    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
 
  openAddModules(form:any) {
      if (form.invalid) {
    return;   
  }
    if (!this.course.moduleCount || this.course.moduleCount <= 0) {
      alert('Please select number of modules');
      return;
    }
 
    this.showAddModules = false;
 
    setTimeout(() => {
      this.showAddModules = true;
    });
  }
 
  moduleNumbers = Array.from({ length: 10 }, (_, i) => i + 1);
 
}
 
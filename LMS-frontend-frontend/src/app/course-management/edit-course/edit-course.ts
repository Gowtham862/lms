import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CourseService } from '../course-service';
import { Module } from '../add-modules/add-modules';
import { CourseStatus } from '../course-management';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

interface Course {
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
  moduleCount: number;
  thumbnailUrl?: string;
  startDate?: string; 
  endDate?: string;

  recommendedCourseIds?: string[];
  price?: number;
  discount?: number;
  status:'Unpublished' | 'Published' | 'Archived';
}

@Component({
  selector: 'app-edit-course',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-course.html',
  styleUrl: './edit-course.scss',
})
export class EditCourse {

  @Output() close = new EventEmitter<void>();
  courseid!: string;
  course: Course = {
    adminId: '',
    courseid: '',
    coursename: '',
    rating: 0,
    coursedesc: '',
    coursecategory: '',
    courseduration: '',
    trainingmode: '',
    courselevel: '',
    language: '',
    certificateavalibility: '',
    noofmodule: '0',
    moduleCount: 0,
    status:'Unpublished' ,
    modules: []

  };
selectedCourse!: Course;
  editedStatus!: CourseStatus;
  modules: Module[] = [];
  loading = false;

  thumbnailFile: File | null = null;
  thumbnailPreview: string | null = null;

  SessionModal = false;
  currentModule!: Module;
  // sessionList: Session[] = [];

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private router: Router
  ) {}

  ngOnInit() {
     const id = history.state.courseId;

  if (!id) {
    console.warn('Course ID missing');
    return;
  }

  this.courseid = id;
  console.log('Course ID:', this.courseid);

  this.loadCourse();
    this.loadCourses(); 
  }

  loadCourse() {
    this.loading = true;
    this.courseService.getCourseById(this.courseid).subscribe({
      next: (res: any) => {
       const data = res?.data;
      if (!data) {
        this.loading = false;
        return;
      }
       console.log('FULL API RESPONSE:', res);
      console.log('data.recommendedCourseIds:', data?.recommendedCourseIds);
      console.log('this.courses:', this.courses);

     
      this.course = data;

      
      this.modules = (data.modules || []).map((m: any) => ({
        ...m,
        sessions: Array.isArray(m.sessions) ? m.sessions : [],
        isNew: false
      }));

        this.course.modules = this.modules;
        this.course.noofmodule = this.modules.length.toString();
        this.course.moduleCount = this.modules.length;

      
      if (data.metadata?.length > 0) {

        const imageMeta = data.metadata.find(
          (m: any) => m.mimeType?.startsWith('image')
        );

        if (imageMeta) {
          const baseUrl = environment.imagebaseurl;
          this.thumbnailPreview = `${baseUrl}${imageMeta.fileName}`;
        }
      }

      
        console.log('recommendedCourseIds from API:', data.recommendedCourseIds);
      console.log('All courses available:', this.courses);

if (data.recommendedCourseIds?.length && this.courses?.length) {
  this.selectedCourses = this.courses.filter(c =>
    data.recommendedCourseIds.map(String).includes(String(c.courseid))
  );
  console.log('Patched selectedCourses:', this.selectedCourses);
}

        this.loading = false;
      },

      error: () => {
        this.loading = false;
        alert('Course not found');
      }
    });
  }
deleteCourse(courseid: string): void {
    this.courseService.deleteModule(courseid).subscribe(
      response => {
        console.log('Course deleted successfully', response);
        alert('Course deleted successfully');
         this.router.navigate(['/Course-management']);

      },
      error => {
        console.error('Error deleting course', error);

      }
    );
  }

setStatus(status: 'Published' | 'Archived') {
  this.course.status = status;
  alert(`Course marked as ${status}`);
}

updateStatus(status: 'Published' | 'Archived') {
  const formData = new FormData();

  const payload = {
    status: status
  };

  formData.append('course', JSON.stringify(payload));

  this.loading = true;

this.courseService.updateCourse(this.courseid, formData).subscribe({
    next: () => {
      this.loading = false;


      this.course.status = status;

      alert(`Course ${status} successfully`);

    },
    error: err => {
      this.loading = false;
      console.error(err);
      alert('Status update failed');
    }
  });
}


  onThumbnailSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.thumbnailFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.thumbnailPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

showDropdown = false;
courses: any[] = [];
selectedCourses: any[] = [];

toggleDropdown() {
  this.showDropdown = !this.showDropdown;
}

loadCourses() {
  this.courseService.GetAllCourses().subscribe((res: any) => {
    this.courses = res.data || res;
  });
   this.loadCourse();
  
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

}
isSelected(course: any): boolean {
  return this.selectedCourses.some(
    c => c.courseid === course.courseid
  );
}
getSelectedCourseNames(): string {

  return this.selectedCourses
    .map(c => c.coursename)
    .join(', ');

}

showSuccessModal = false;
closeSuccessModal() {
  this.showSuccessModal = false;
  history.back(); 
}

saveCourse() {
  const formData = new FormData();

  // Append thumbnail if selected
  if (this.thumbnailFile) {
    formData.append('files', this.thumbnailFile);
    console.log('Thumbnail file to upload:', this.thumbnailFile.name);
  }

  // Construct the payload exactly like your example
  const payload: any = {
    rating: this.course.rating,
    coursename: this.course.coursename,
    coursedesc: this.course.coursedesc,
    coursecategory: this.course.coursecategory,
    courseduration: this.course.courseduration,
    trainingmode: this.course.trainingmode,
    courselevel: this.course.courselevel,
    language: this.course.language,
    certificateavalibility: this.course.certificateavalibility,
    noofmodule: this.modules.length.toString(),
    moduleCount: this.modules.length,
    status: this.course.status,
    price: this.course.price,
    discount: this.course.discount,
    recommendedCourseIds: this.selectedCourses.map(
  c => c.courseid
),
    modules: this.modules.map(m => ({
      moduleNo: m.moduleNo,
      moduleName: m.moduleName,
      sessionDuration: m.sessionDuration,
      totalsession: m.totalsession
    }))
  };

  console.log('Payload before sending:', payload);

  formData.append('course', JSON.stringify(payload));

  this.loading = true;
  this.courseService.updateCourse(this.courseid, formData).subscribe({
    next: (res: any) => {
      this.loading = false;
      console.log('Response from backend:', res);

      // Update course modules in component state
      this.course.modules = this.modules;

     this.showSuccessModal = true; 
    },
    error: (err) => {
      this.loading = false;
      console.error('Error updating course:', err);
      alert('Failed to update course');
    }
  });
}



  closeSessionModal() {
    this.SessionModal = false;
  }

  goBack() {
    this.close.emit();
  }//for the one page previous

}
 
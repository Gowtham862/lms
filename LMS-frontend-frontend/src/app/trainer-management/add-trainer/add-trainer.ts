import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { TrainerService } from '../trainer-service';
import { liveclass } from '../../core/services/liveclass/liveclass';
export interface Course {
  courseid: string;
  coursename: string;
}
export interface Createbatch{

  // course: Course | null;
    course: Course | null;


}

export interface Trainer {
  adminid: string;
  trainerid: string;
  trainername: string;
  personalemailid: string;
  contactnumber: string;
  dateofbirth: string;
  address: string;
  state: string;
  city: string;
  loginemail: string;
  temporaraypassword: string;
  areoferperience: string;
  yearofexperience: string;
  qualification: string;
  languageknown: string[]; 
  // attachresume: string;
  trainerstatus: string;
  role: string;
  abouttrainer: string;
}


   interface Metadata {
  fileName: string;
  mimeType: string;
  width: number;
  height: number;
  fileSizeKB: number;
}
@Component({
  selector: 'app-add-trainer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,RouterLink],
  templateUrl: './add-trainer.html',
  styleUrls: ['./add-trainer.scss']
})
export class AddTrainer {
  loading:boolean=false;



constructor(private trainerService:TrainerService,private service:liveclass,private router: Router) {}
  course: Course[] = [];
ngOnInit(): void {
         this.getLiveCourses();
  }
Trainers: Trainer[] = [];
photoPreview: string | null = null;
  // resumeFile: File | null = null;
  // resumeName = '';
  imageFile:any;
   trainer: Trainer = {
  adminid: '12911',
  trainerid: '',
  trainername: '',
  personalemailid: '',
  contactnumber: '',
  dateofbirth: '',
  address: '',
  state: '',
  city: '',
  loginemail: '',
  temporaraypassword: '',
  areoferperience: '',
  yearofexperience: '',
  qualification: '',
   languageknown: [],
  // attachresume: '',
  // assignedcourse: '',
  // assignedcourseid: '',
  // courselevel: '',
  trainerstatus: '',
  role: 'INSTRUCTOR',
  abouttrainer: ''
};

expertiseList: string[] = [
  // Project & Business
  "Project Management",
  "Agile & Scrum",
  "PMI / PMP",
  "Business Analysis",
  "Leadership & Strategy",

  // Development
  "Full Stack Development",
  "Frontend Development",
  "Backend Development",
  "Java Development",
  "Python Development",
  "Mobile App Development",

  // Data & AI
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "Data Analytics",

  // Cloud & DevOps
  "AWS Cloud",
  "Azure Cloud",
  "DevOps",
  "Docker & Kubernetes",

  // Security
  "Cyber Security",
  "Ethical Hacking",
  "Network Security",

  // Design
  "UI/UX Design",
  "Graphic Design",

  // Testing
  "Manual Testing",
  "Automation Testing"
];
  toastType: 'success' | 'error' = 'error';

  // onPhotoSelected(event: any) {
  //   // const file = event.target.files[0];
  //   // if (!file) return;

  //   // const reader = new FileReader();
  //   // reader.onload = () => {
  //   //   this.photoPreview = reader.result as string;
  //   // };
  //   // reader.readAsDataURL(file);

  //   const photoPreview = event.target.files[0];
  //   this.photoPreview = photoPreview;
  //   console.log('Photo Preview:', photoPreview);

  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     this.photoPreview = reader.result as string;
  //   };
  //   reader.readAsDataURL(photoPreview);

  // }

  batch: Createbatch = {
    course: null,   

  };
showSuccessModal = false;
closeSuccessModal() {
   this.showSuccessModal = false;
    this.router.navigate(['/trainer-management']);

}
onPhotoSelected(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  this.imageFile = file;
  const reader = new FileReader();
  reader.onload = () => {
    this.photoPreview = reader.result as string;
  };
  reader.readAsDataURL(file);
}

getLiveCourses() {
    this.service.liveclassdata().subscribe({
      next: (res: any) => {
          this.course = res.data.map((item: any) => ({
        courseid: item.courseid,
        coursename: item.coursename
      }));
        console.log(this.course)

      },
      error: (err) => {
        console.error('Error fetching courses', err);
      }
    });
  }
submitCourse() {
  const formData = new FormData();


   console.log( this.batch.course?.courseid +"courseid")
   console.log('this.imageFile-----> to be sent:'+this.imageFile);
   console.log('this.imageFile----->111111:'+this.imageFile?.name);

  if (this.imageFile) {
    formData.append('file', this.imageFile, this.imageFile.name);
  }

  formData.append(
    'trainer',
    new Blob([JSON.stringify(this.trainer)], { type: 'application/json' })
  );

   console.log('this.imageFile-----> to be sent: after'+this.imageFile);
   console.log('this.imageFile----->111111:'+this.imageFile?.name);

   this.trainerService.AddTrainer(formData).subscribe({
    next: res => {

      console.log('Backend response:', res);
       this.showSuccessModal = true;
    },
    error: err => {

      console.error('API Error Details:', err);
      alert('Failed to create trainer');
    }
  });
}

  // onResumeSelected(event: any) {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   this.resumeFile = file;
  //   this.resumeName = file.name;
  // }
// onResumeSelected(event: any) {
//   const file = event.target.files[0];
//   if (!file) return;

//   this.resumeFile = file;
//   this.resumeName = file.name;
// }

showToast = false;
toastMessage = '';

// submitTrainer(form: any) {

//   if (form.invalid) {
//     this.showErrorToast('Please fill all required fields');
//     return;
//   }

//   console.log('===== TRAINER DATA SUBMITTED =====');

//   console.log('Trainer Object:', this.trainer);

//   console.log('Trainer ID:', this.trainer.trainerId);
//   console.log('Name:', this.trainer.name);
//   console.log('Personal Email:', this.trainer.personalEmail);
//   console.log('Contact No:', this.trainer.contactNo);
//   console.log('DOB:', this.trainer.dob);
//   console.log('Address:', this.trainer.address);
//   console.log('State:', this.trainer.state);
//   console.log('City:', this.trainer.city);
//   console.log('Login Email:', this.trainer.loginEmail);
//   console.log('Password:', this.trainer.password);
//   console.log('Expertise:', this.trainer.expertise);
//   console.log('Experience:', this.trainer.experience);
//   console.log('Qualification:', this.trainer.qualification);
//   console.log('Language:', this.trainer.language);
//   console.log('Course:', this.trainer.course);
//   console.log('Level:', this.trainer.level);
//   console.log('Status:', this.trainer.status);
//   console.log('About:', this.trainer.about);

//   if (this.photoPreview) {
//     console.log('Profile Photo Selected: YES');
//     console.log('Photo Preview (Base64):', this.photoPreview);
//   } else {
//     console.log('Profile Photo Selected: NO');
//   }

//   if (this.resumeFile) {
//     console.log('Resume Uploaded: YES');
//     console.log('Resume Name:', this.resumeFile.name);
//     console.log('Resume Type:', this.resumeFile.type);
//     console.log('Resume Size (KB):', (this.resumeFile.size / 1024).toFixed(2));
//   } else {
//     console.log('Resume Uploaded: NO');
//   }

//   console.log('=================================');

//   this.showSuccessToast('Trainer added successfully!');
// }
submitTrainer(form: any) {
  if (form.invalid) {
    this.showErrorToast('Please fill all required fields');
    return;
  }
  if (!this.imageFile) {
    this.showErrorToast('Please upload profile photo');
    return;
  }
  // if (!this.resumeFile) {
  //   this.showErrorToast('Please upload resume');
  //   return;
  // }
const selectedCourse = this.batch.course;

  // this.trainer.assignedcourseid = selectedCourse!.courseid;
  // this.trainer.assignedcourse   = selectedCourse!.coursename;
  const formData = new FormData();


    formData.append('trainer', JSON.stringify(this.trainer));

  formData.append('file', this.imageFile);
  // formData.append('file', this.resumeFile);
  console.log('Trainer Data:', this.trainer);
  console.log('Photo:', this.imageFile.name);
  // console.log('Resume:', this.resumeFile.name);

  // API Call
   this.loading = true; 
  this.trainerService.AddTrainer(formData).subscribe({
    next: res => {
      this.loading=false;
      console.log('Backend response:', res);
      this.showSuccessModal = true;
      form.resetForm();
    },
    error: err => {
      this.loading = false; 
      console.error('API Error:', err);
      this.showErrorToast('Failed to create trainer');
    }
  });
}


showErrorToast(message: string) {
  this.toastMessage = message;
  this.showToast = true;

  setTimeout(() => {
    this.showToast = false;
  }, 3000);
}

showSuccessToast(message: string) {
  this.toastMessage = message;
  this.showToast = true;

  setTimeout(() => {
    this.showToast = false;
  }, 3000);
}

//changes 
languages: string[] = [
  'English',
  'Arabic',
  'Urdu'
];

onLanguageChange(event: any) {

  const value = event.target.value;

  if (event.target.checked) {
    this.trainer.languageknown.push(value);
  } 
  else {
    this.trainer.languageknown =
      this.trainer.languageknown.filter(
        (lang: string) => lang !== value
      );
  }

  console.log(
    'Selected Languages:',
    this.trainer.languageknown
  );
}

showLanguageDropdown = false;

toggleLanguageDropdown() {
  this.showLanguageDropdown =
    !this.showLanguageDropdown;
}

}
 
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TrainerService } from '../trainer-service';
import { environment } from '../../../environments/environment';

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
  attachresume: string;
  assignedcourse: string;
  assignedcourseid: string;
  courselevel: string;
  trainerstatus: string;
  role: string;
  abouttrainer: string;
}

@Component({
  selector: 'app-edit-trainer',
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './edit-trainer.html',
   styleUrls: ['./edit-trainer.css'],
})
export class EditTrainer {
  constructor( private route: ActivatedRoute,
  private router: Router,
  private trainerService: TrainerService) {}

  trainerid!: string;
  private baseUrl = environment.imagebaseurl;

  ngOnInit() {
  const state = history.state;

  console.log('Trainer ID:', state.trainerId);

  this.trainerid = state?.trainerId;

  if (this.trainerid) {
    this.loadTrainer();
  }
}

trainer: Trainer = {
  adminid: '',
  trainerid: '12344',
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
  attachresume: '',
  assignedcourse: '',
  assignedcourseid: '',
  courselevel: '',
  trainerstatus: '',
  role: 'ADMIN',
  abouttrainer: ''
};
imageFile: File | null = null;
resumeFile: File | null = null;
photoPreview: string | null = null;
resumeName = '';

// loadTrainer() {
//   this.trainerService.getTrainerById(this.trainerid).subscribe({
//     next: (res) => {
//       this.trainer = res.data;  
//     },
//     error: (err) => {
//       console.error(err);
//       alert('Trainer not found');
//     }
//   });
// }
// loadTrainer() {
//   this.trainerService.getTrainerById(this.trainerid).subscribe({
//     next: (res) => {
//       this.trainer = res.data;

//       // ✅ Same pattern as course — use fileName not filePath
//       if (res.data.metadata && res.data.metadata.length > 0) {
//         const imageMetadata = res.data.metadata.find(
//           (m: any) => m.mimeType?.startsWith('image')
//         );
//         if (imageMetadata?.fileName) {
//           this.photoPreview = `${this.baseUrl}${imageMetadata.fileName}`;
//           console.log('Trainer photo URL:', this.photoPreview);
//         }
//       }
//     },
//     error: (err) => {
//       console.error(err);
//       alert('Trainer not found');
//     }
//   });
// }
loadTrainer() {
  this.trainerService.getTrainerById(this.trainerid).subscribe({
    next: (res) => {
      const data = res.data;

      // Patch manually
      this.trainer.trainerid = data.trainerid;
      this.trainer.trainername = data.trainername;
      this.trainer.personalemailid = data.personalemailid;
      this.trainer.contactnumber = data.contactnumber;
      this.trainer.dateofbirth = data.dateofbirth;
      this.trainer.address = data.address;
      this.trainer.state = data.state;
      this.trainer.city = data.city;
      this.trainer.loginemail = data.loginemail;
      this.trainer.temporaraypassword = data.temporaraypassword;
      this.trainer.areoferperience = data.areoferperience;
      this.trainer.yearofexperience = data.yearofexperience;
      this.trainer.qualification = data.qualification;
      this.trainer.languageknown = data.languageknown;
      this.trainer.assignedcourse = data.assignedcourse;
      this.trainer.assignedcourseid = data.assignedcourseid;
      this.trainer.courselevel = data.courselevel;
      this.trainer.trainerstatus = data.trainerstatus;
      this.trainer.abouttrainer = data.abouttrainer;

      // Image patch
      if (data.metadata && data.metadata.length > 0) {
        const imageMetadata = data.metadata.find(
          (m: any) => m.mimeType?.startsWith('image')
        );

        if (imageMetadata?.fileName) {
          this.photoPreview = `${this.baseUrl}${imageMetadata.fileName}`;
        }
      }
    },
    error: (err) => {
      console.error(err);
      alert('Trainer not found');
    }
  });
}

// submitTrainer() {
//   this.trainerService.updateTrainer(this.trainerid, this.trainer)
//     .subscribe({
//       next: (res) => {
//         this.showSuccessModal = true;
       
//       },
//       error: (err) => {
//         console.error(err);
//         alert('Update failed');
//       }
//     });
// }
submitTrainer() {
  const formData = new FormData();

  // Append trainer JSON as a Blob with key 'trainer' — must match @RequestPart("trainer")
  formData.append(
    'trainer',
    new Blob([JSON.stringify(this.trainer)], { type: 'application/json' })
  );

  // Append files with key 'files' — must match @RequestPart("files")
  if (this.imageFile) {
    formData.append('files', this.imageFile, this.imageFile.name);
  }

  if (this.resumeFile) {
    formData.append('files', this.resumeFile, this.resumeFile.name);
  }

  this.trainerService.updateTrainer(this.trainerid, formData).subscribe({
    next: () => {
      this.showSuccessModal = true;
    },
    error: (err) => {
      console.error(err);
      alert('Update failed');
    }
  });
}

// Fix deactivateTrainer — must also use FormData now
deactivateTrainer() {
  if (!confirm('Are you sure you want to deactivate this trainer?')) return;

  const payload = { ...this.trainer, trainerstatus: 'Deactivated' };

  const formData = new FormData();
  formData.append(
    'trainer',
    new Blob([JSON.stringify(payload)], { type: 'application/json' })
  );

  this.trainerService.updateTrainer(this.trainerid, formData).subscribe({
    next: () => {
      this.trainer.trainerstatus = 'Deactivated';
      alert('Trainer Deactivated Successfully');
    },
    error: (err) => console.error(err)
  });
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

onResumeSelected(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  this.resumeFile = file;
  this.resumeName = file.name;
}



// deactivateTrainer() {
//   if (!confirm('Are you sure you want to deactivate this trainer?')) return;

//   const payload = {
//     trainerstatus: 'Deactivated'
//   };

//   this.trainerService
//     .updateTrainer(this.trainerid, payload)
//     .subscribe({
//       next: () => {
//         this.trainer.trainerstatus = 'Deactivated';
//         alert('Trainer Deactivated Successfully');
//       },
//       error: (err) => console.error(err)
//     });
// }
showSuccessModal = false;
closeSuccessModal() {
  this.showSuccessModal = false;
  this.router.navigate(['/trainer-management']);
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

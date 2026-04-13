import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SuperAdminservice } from '../../../core/services/super-adminservice';
import { environment } from '../../../../environments/environment';

export interface SuperAdmin {
   file?: string; 
  adminid?: number;             
  adminname: string;
  personalemailid: string;
  contactnumber: string;
  dateofbirth: string;
  address: string;
  state: string;
  city: string;
  loginemail: string;
  temporaraypassword: string;
  adminrole: string;
  adminstatus: 'Active' | 'Inactive';
  metadata?: Metadata[];
}
 interface Metadata {
  fileName: string;
  mimeType: string;
  width: number;
  height: number;
  fileSizeKB: number;
}
@Component({
  selector: 'app-add-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,     
    RouterModule    
  ],
  templateUrl: './add-admin.html',
  styleUrls: ['./add-admin.css']
})

export class AddAdmin {
baseUrl = environment.imagebaseurl;
   adminRoles = ['LMS_ADMIN', 'SALES_ADMIN'];
  adminStatuses: SuperAdmin['adminstatus'][] = ['Active', 'Inactive'];
isLoading = false;

admin: SuperAdmin = {
  // adminid: Date.now(),
    adminname: '',
    personalemailid: '',
    contactnumber: '',
    dateofbirth: '',
    address: '',
    state: '',
    city: '',
    loginemail: '',
    temporaraypassword: '',
    adminrole: '',
    adminstatus: 'Active',
  };

  photoPreview: string | null = null;
  imageFile:any;

  constructor(private router: Router,private superAdminService: SuperAdminservice) {}
   superAdmins: SuperAdmin[] = [];
   ngOnInit(): void {
         
  }
  


  //  submitTrainer(form: any) {
  //   if (form.invalid) {
  //     console.error('Form invalid');
  //     return;
  //   }

  //   const formData = new FormData();

  //   formData.append('superadmin',  JSON.stringify(this.admin));
  //   formData.append('adminname', this.admin.adminname);
  //   formData.append('personalemailid', this.admin.personalemailid);
  //   formData.append('contactnumber', this.admin.contactnumber);
  //   formData.append('dateofbirth', this.admin.dateofbirth);
  //   formData.append('address', this.admin.address);
  //   formData.append('state', this.admin.state);
  //   formData.append('city', this.admin.city);
  //   formData.append('loginemail', this.admin.loginemail);
  //   formData.append('temporaraypassword', this.admin.temporaraypassword);
  //   formData.append('adminrole', this.admin.adminrole);
  //   formData.append('adminstatus', this.admin.adminstatus);

  //   if (this.imageFile) {
  //     formData.append('file', this.imageFile, this.imageFile.name);
  //   }

  //   this.superAdminService.AddAdmin(formData).subscribe({
  //     next: (res: any) => {
  //        this.showSuccessModal = true;
  //       console.log('Admin added successfully:', res);
       
  //     },
  //     error: (err: any) => console.error('Error adding admin:', err),
  //   });
  // }
submitTrainer(form: any) {
  if (form.invalid) {
    console.error('Form invalid');
    return;
  }

  this.isLoading = true;  

  const formData = new FormData();

  formData.append('superadmin', JSON.stringify(this.admin));
  formData.append('adminname', this.admin.adminname);
  formData.append('personalemailid', this.admin.personalemailid);
  formData.append('contactnumber', this.admin.contactnumber);
  formData.append('dateofbirth', this.admin.dateofbirth);
  formData.append('address', this.admin.address);
  formData.append('state', this.admin.state);
  formData.append('city', this.admin.city);
  formData.append('loginemail', this.admin.loginemail);
  formData.append('temporaraypassword', this.admin.temporaraypassword);
  formData.append('adminrole', this.admin.adminrole);
  formData.append('adminstatus', this.admin.adminstatus);

  if (this.imageFile) {
    formData.append('file', this.imageFile, this.imageFile.name);
  }

  this.superAdminService.AddAdmin(formData).subscribe({
    next: (res: any) => {
      this.isLoading = false;   
      this.showSuccessModal = true;
      console.log('Admin added successfully:', res);
    },
    error: (err: any) => {
      this.isLoading = false;
      if(err.status===409)
        {
          alert("Admin with this email already exists")
        }   
      console.error('Error adding admin:', err);
    },
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
  showSuccessModal = false;
 
closeSuccessModal() {
  this.showSuccessModal = false;
  this.router.navigate(['/super-admin']);
}
}

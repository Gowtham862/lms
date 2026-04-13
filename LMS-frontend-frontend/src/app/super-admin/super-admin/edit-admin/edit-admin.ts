import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  adminstatus: 'Active' | 'Inactive'|'Deactivated';
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
  selector: 'app-edit-admin',
  imports: [ CommonModule,
    FormsModule,    
    RouterModule ]   ,
  templateUrl: './edit-admin.html',
  styleUrls: ['./edit-admin.css'],
})
export class EditAdmin {
   baseUrl = environment.imagebaseurl;
 trainer = {
    trainerId: '123456',
    name: '',
    personalEmail: '',
    contactNo: '',
    dob: '',
    address: '',
    state: '',
    city: '',
    loginEmail: '',
    password: '',
   adminRole:'',
    adminStatus:''
  };


 constructor(private router: Router,private superAdminService: SuperAdminservice,private route: ActivatedRoute,) {}
   superAdmins: SuperAdmin[] = [];
    adminid!: number;
  
ngOnInit(): void {

  const state = history.state;

  if (state?.adminId) {
    this.adminid = state.adminId;
    this.loadadmin();  
    return;
  }

  
  const idParam = this.route.snapshot.paramMap.get('adminid');

  if (idParam) {
    this.adminid = Number(idParam);
    this.loadadmin();
  }
}

  admin: SuperAdmin = {
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
      file: '',
    };
   
savePermissions() {
   console.log('Permissions for admin saved:', this.admin);
  alert('Permissions updated successfully!');
}

 photoPreview: string | null = null;
  imageFile:any;


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

submitAdmin(form: any) {
  if (form.invalid) {
    form.control.markAllAsTouched();
    return;
  }

  const formData = new FormData();

  
  const payload = {
    adminname: this.admin.adminname,
    personalemailid: this.admin.personalemailid,
    contactnumber: this.admin.contactnumber,
    dateofbirth: this.admin.dateofbirth,
    address: this.admin.address,
    state: this.admin.state,
    city: this.admin.city,
    loginemail: this.admin.loginemail,
    temporaraypassword: this.admin.temporaraypassword,
    adminrole: this.admin.adminrole,
    adminstatus: this.admin.adminstatus
  };

  formData.append(
    'superadmin',
    new Blob([JSON.stringify(payload)], { type: 'application/json' })
  );

 
  if (this.imageFile) {
    formData.append('files', this.imageFile, this.imageFile.name);
  }

  this.superAdminService.updateAdmin(this.adminid, formData).subscribe({
    next: () => {
      // alert('Admin updated successfully!');
       this.showSuccessModal = true;
      // this.router.navigate(['/super-admin']);
    },
    error: (err: any) => {
      console.error('Update failed:', err);
      alert('Update failed');
    },
  });
}

isDeactivated = false;
deactivateAdmin() {
  const confirmDeactivate = confirm(
    'Are you sure you want to deactivate this admin?'
  );
  if (!confirmDeactivate) return;

  this.admin.adminstatus = 'Deactivated';

  alert(this.admin.adminstatus); // temporarily test
}


// loadadmin() {
//   this.superAdminService.getAdminById(this.adminid).subscribe({
//     next: (res: any) => {
//        console.log('Admin response from API:', res);
//        Object.assign(this.admin, res.data);
//       const data = res.data;

//       this.admin = {
//         adminid: data.adminid,
//         adminname: data.adminname,
//         personalemailid: data.personalemailid,
//         contactnumber: data.contactnumber,
//         dateofbirth: data.dateofbirth,
//         address: data.address,
//         state: data.state,
//         city: data.city,
//         loginemail: data.loginemail,
//         temporaraypassword: data.temporaraypassword,
//         adminrole: data.adminrole,
//         adminstatus: data.adminstatus === 'Active' ? 'Active' : 'Inactive',
//         metadata: data.metadata || [],
//         file: data.metadata?.[0]?.fileName || ''
//       };

//       // preview image if exists
//       this.photoPreview = this.admin.file || null;
//     },
//     error: (err) => {
//       console.error(err);
//       alert('Super Admin not found');
//     }
//   });
// }
normalizeStatus(status: string): 'Active' | 'Inactive' | 'Deactivated' {
  if (!status) return 'Inactive';

  const value = status.toLowerCase();

  if (value === 'active') return 'Active';
  if (value === 'inactive') return 'Inactive';
  if (value === 'deactivated' || value === 'deactived')
    return 'Deactivated';

  return 'Inactive';
}
  loadadmin() {
    this.superAdminService.getAdminById(this.adminid).subscribe({
      next: (res: any) => {
        const data = res.data;
this.admin = {
  ...data,
  adminstatus: this.normalizeStatus(data.adminstatus)
};

      //       if (this.admin.adminstatus === 'Deactived') {
      //   this.admin.adminstatus = 'Deactivated';
      // }

        if (data.metadata?.length > 0) {
          const imageMeta = data.metadata.find((m: Metadata) =>
            m.mimeType?.startsWith('image')
          );
          if (imageMeta) {
            this.photoPreview = `${this.baseUrl}${imageMeta.fileName}`;
          }
        }
      },
      error: (err: any) => {
        console.error(err);
        alert('Super Admin not found');
      },
    });
  }

    showSuccessModal = false;
 
closeSuccessModal() {
  this.showSuccessModal = false;
  this.router.navigate(['/super-admin']);
}

}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SuperAdminservice } from '../../core/services/super-adminservice';
import { environment } from '../../../environments/environment';
export interface SuperAdmin {
   file: string; 
  adminid: number;             
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
  adminstatus: 'Active' | 'Inactive' | 'Deactivated';
  metadata: Metadata[];
}
 interface Metadata {
  fileName: string;
  mimeType: string;
  width: number;
  height: number;
  fileSizeKB: number;
}
@Component({
  selector: 'app-super-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './super-admin.html',
  styleUrls: ['./super-admin.css'],
})


export class SuperAdminComponent {
  baseUrl = environment.imagebaseurl;
constructor(private router: Router,private superAdminService: SuperAdminservice) {}
 ngOnInit() {
    this.loadAdmins();
  }
 
    stats = [
    {
      title: 'Total Onboarded Admins',
      value: 0,
      icon: 'fa-solid fa-user-graduate'
    },
    {
      title: 'Total Active Admins',
      value: 0,
      icon: 'fa-solid fa-user-check'
    },
    {
      title: 'Total Inactive Admins',
      value: 0,
      icon: 'fa-solid fa-user-xmark'
    }
  ];


  admins = [
    {
      name: 'Mr Shamim A',
      id: '112233',
      role: 'Support Admin',
      email: 'shamim@albayan.com',
      date: '01-01-2026',
      status: 'Active',
      image: 'arab-women.png'
    },
    {
      name: 'Mr Shamim A',
      id: '112233',
      role: 'Support Admin',
      email: 'shamim@albayan.com',
      date: '01-01-2026',
      status: 'Active',
      image: 'arab-women.png'
    },
    {
      name: 'Mr Shamim A',
      id: '112233',
      role: 'Finance Admin',
      email: 'shamim@albayan.com',
      date: '01-01-2026',
      status: 'InActive',
      image: 'arab-women.png'
    }
  ];

   superAdmins: SuperAdmin[] = [];
  filteredAdmins: SuperAdmin[] = [];
  searchText = '';

 onSearch() {
    const search = this.searchText.toLowerCase();
    this.filteredAdmins = this.superAdmins.filter(
      a =>
        a.adminname.toLowerCase().includes(search) ||
        a.adminid.toString().includes(search)
    );
  }

editAdmin(admin: SuperAdmin) {
   console.log('Edit admin:', admin);
  

  this.router.navigate(['/edit-admin'], {
    state: { adminId: admin.adminid }
  });
}

loadAdmins() {

  this.superAdminService.GetAdmin().subscribe({
    next: (res: any) => {

      const admins: any[] = res.data || [];

      this.superAdmins = admins.map(a => ({

        adminid: a.adminid,
        adminname: a.adminname,
        personalemailid: a.personalemailid,
        contactnumber: a.contactnumber,
        dateofbirth: a.dateofbirth,
        address: a.address,
        state: a.state,
        city: a.city,
        loginemail: a.loginemail,
        temporaraypassword: a.temporaraypassword,
        adminrole: a.adminrole,

        // ✅ Properly handle all 3 statuses
        adminstatus: a.adminstatus
          ? a.adminstatus.charAt(0).toUpperCase() +
            a.adminstatus.slice(1).toLowerCase()
          : '',

        metadata: a.metadata || [],

        file: a.metadata?.[0]?.fileName
          ? `${this.baseUrl}${a.metadata[0].fileName}`
          : '/assets/placeholder.png'
      }));

      this.filteredAdmins = [...this.superAdmins];

      // ✅ Calculate stats including Deactivated
      const total = this.superAdmins.length;
      const active = this.superAdmins.filter(a => a.adminstatus === 'Active').length;
      const inactive = this.superAdmins.filter(a => a.adminstatus === 'Inactive').length;
      const deactivated = this.superAdmins.filter(a => a.adminstatus === 'Deactivated').length;

      this.stats[0].value = total;
      this.stats[1].value = active;
      this.stats[2].value = inactive;

      // 🔥 If you have 4th stats card for deactivated
      if (this.stats[3]) {
        this.stats[3].value = deactivated;
      }

    },
    error: (err: any) => console.error(err)
  });
}


}

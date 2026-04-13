import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActionBtn } from './action-btn/action-btn';
import { liveclass } from '../core/services/liveclass/liveclass';

// interface Lead {
//   id: number;
//   name: string;
//   email: string;
//   contact: string;
//   course: string;
//   source: string;
//   currentStatus: string;
//   nextStatus: string;
// }
interface Lead {
  
  id: number;
  name: string;
  email: string;
  contact: string;
  course: string;
  source: string;
  currentStatus: string;
  nextStatus: string;
    paymentStatus?: 'Paid' | 'Denied';
}


@Component({
  selector: 'app-sales-and-marketing',
    standalone: true,  
  imports: [FormsModule,CommonModule,ActionBtn],
  templateUrl: './sales-and-marketing.html',
  styleUrl: './sales-and-marketing.css',
})


export class SalesAndMarketing implements OnInit {
currentPage = 0;
totalLeads = 0; 
hasNextPage = true;
   activeTab1: 'active' | 'completed' | 'similar' = 'active';
     setTab(tab: 'active' | 'completed' | 'similar') {
    this.activeTab1 = tab;
  }
    constructor(private liveclass: liveclass) {}


  leads: Lead[] = [];
 
    filteredLeads: any[] = [];

  // updatePaymentStatus(
  //   lead: any,
  //   status: 'Paid' | 'Denied'
  // ) {
  //   lead.paymentStatus = status;
  // }

  tabs = [
    'All',
    'First Call',
    'Yet to contact',
    'Follow Up Call',
    'Payment Enabled'
  ];

  activeTab = 'All';

  ngOnInit() {
    this.loadLeads();
  }


  loadLeads(page: number = 0) {
    this.liveclass.getLeads(page).subscribe({

      next: (res) => {

        console.log('API Response:', res);
 if (!res.data || res.data.length === 0) {
  this.hasNextPage = false;
       
          // go back
        return;
      } this.currentPage = page;


       
this.leads = res.data.map((x: any) => {

  
  let paymentStatus: 'Paid' | 'Denied' | null = null;

  if (x.currentstatus?.toLowerCase() === 'paid') {
    paymentStatus = 'Paid';
  }
  else if (x.currentstatus?.toLowerCase() === 'denied') {
    paymentStatus = 'Denied';
  }

  return {

    id: x.interstedid,
    name: x.username,
    email: x.useremail,
    contact: x.usercontact,
    course: x.coursename,
    source: 'Website',
     courseid: x.courseid,
          userid: x.userid,
          batchid: x.batchid,
          batchstartdate: x.batchstartdate,
          batchno: x.batchno,

          fullObject: x , 

    currentStatus: x.currentstatus || 'Yet To Connect',
    nextStatus: x.nextstatus || '-',

    paymentStatus   // 👈 IMPORTANT
  };

});


        this.filteredLeads = [...this.leads];
         this.totalLeads = res.totalElements || res.data.length;
          this.hasNextPage = res.data.length === 1;

      },

      error: (err) => {
          if (err.status === 404) {
        this.hasNextPage = false;
      }
        console.error('API Error:', err);
      }
    });
  }

nextPage() {
 if (!this.hasNextPage) return;

  const next = this.currentPage + 1;
  this.loadLeads(next);
}

prevPage() {
   if (this.currentPage > 0) {
    const prev = this.currentPage - 1;
    this.loadLeads(prev);
  }
}
  
 //  Update Payment Status
// updatePaymentStatus(lead: Lead) {
//     console.log('Clicked Lead Data:', lead);

//  console.log('Selected Lead Full Details:', lead);

//   const id = lead.id;
//    this.liveclass.updatebyinterstid(id) .subscribe({

//       next: (res: any) => {
//          this.loadLeads();

//         console.log('Status Updated:', res);
        
       

//       },

//       error: (err) => {
//         console.error(
//           'Update Status Error:',
//           err
//         );
//       }

//     });

// }


updatePaymentStatus(lead: any) {

  // if (this.isSaving) return;   // 🚫 prevent double click
  // this.isSaving = true;

  const payload = {
    courseid: lead.courseid,
    userid: lead.userid,
    // username: lead.username || lead.name,
    username: lead.name,
    useremail: lead.useremail || lead.email,
    batchid: lead.batchid,
    coursename: lead.coursename || lead.course,
    batchstartdate: lead.batchstartdate,
    batchno: lead.batchno,
    usercontact:lead.usercontact || lead.contactS
  };

  this.liveclass.savepurchase(payload)
    .subscribe({

      next: (res: any) => {

        this.liveclass.updatebyinterstid(lead.id)
          .subscribe(() => {

            console.log('Lead marked Paid');

            this.loadLeads(this.currentPage);
            // this.isSaving = false;
          });

      },

      error: (err) => {
        console.error('Purchase Error:', err);
        // this.isSaving = false;
      }

    });

}



updatePayment(id:number) {

 
   this.liveclass.updatebyinterstatusdenied(id) .subscribe({

      next: (res: any) => {
         this.loadLeads(this.currentPage);

        console.log('Status Updated:', res);
        
       

      },

      error: (err) => {
        console.error(
          'Update Status Error:',
          err
        );
      }

    });

}

  // 👉 Tab Filter
  selectTab(tab: string) {
    this.activeTab = tab;

    if (tab === 'All') {
      this.filteredLeads = this.leads;
    } else {
      this.filteredLeads = this.leads.filter(
        x => x.currentStatus === tab
      );
    }
  }
 
  // 👉 Status Colors
  statusClass(status: string) {

    switch (status?.toLowerCase()) {

      case 'yet to contact':
      case 'yet to connect':
        return 'status-red';

      case 'contacted':
      case 'first call':
        return 'status-blue';

      case 'follow up call':
        return 'status-purple';

      case 'payment enabled':
        return 'status-green';

      default:
        return '';
    }
  }

  // 👉 Component toggle
  showDetails = false;
    selectedLeadId!: number;
open(lead: any) {

  this.selectedLeadId = lead.id;  // store id
  this.showDetails = true;        // show child

}

  closeDetails() {
    this.showDetails = false;
  }

  // Confirmation Modal State
showConfirmModal = false;
selectedLead: any = null;
selectedAction: 'Paid' | 'Denied' | null = null;
 
openConfirmModal(lead: any, action: 'Paid' | 'Denied') {
  this.selectedLead = lead;
  this.selectedAction = action;
  this.showConfirmModal = true;
}
 
confirmAction() {
 
  if (!this.selectedLead || !this.selectedAction) return;
 
  if (this.selectedAction === 'Paid') {
    this.updatePaymentStatus(this.selectedLead);
  }
 
  if (this.selectedAction === 'Denied') {
    this.updatePayment(this.selectedLead.id);
  }
 
  this.closeModal();
}
 
closeModal() {
  this.showConfirmModal = false;
  this.selectedLead = null;
  this.selectedAction = null;
}



}

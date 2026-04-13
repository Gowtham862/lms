import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Input, OnInit } from '@angular/core';
import { liveclass } from '../../core/services/liveclass/liveclass';

interface Journey {
  sno: number;
  date: string;
  status: string;
  notes: string;
}
@Component({
  selector: 'app-action-btn',
  standalone: true, 
  imports: [FormsModule,CommonModule],
  templateUrl: './action-btn.html',
  styleUrl: './action-btn.css',
})
export class ActionBtn implements OnInit{

  
  constructor(private liveclass: liveclass) {}

  @Input() leadId!: number; 
  ngOnInit() {
  this.loadLeadDetails();
}

loadLeadDetails() {

  this.liveclass.getLeadById(this.leadId)
    .subscribe({

      next: (res: any) => {

        const x = res.data;

        this.trainee = {

          leadId: x.interstedid,
          name: x.username,
          email: x.useremail,
          contact: x.usercontact,
          course: x.coursename,

          batch:
            `Batch ${x.batchno} (${x.batchstartdate})`,

          source: 'Website', 
          fees: 'Rs.10,000'   
        };

      },

      error: (err) => {
        console.error('Lead Details Error:', err);
      }
    });
}


  //  trainee = {
  //   leadId: 12345,
  //   name: 'YAQOOB Y',
  //   email: 'thoriq123@gmail.com',
  //   contact: '+91 98999 76899',
  //   course: 'ARABIC',
  //   batch: 'Batch 11 (14/02/2026)',
  //   source: 'Google Ads',
  //   fees: 'Rs.10,000'
  // };
  trainee: any = {};


  // 👉 Sales Update Model
  sales = {
    date: '',
    status: '',
    notes: '',
    nextStatus: ''
  };

  // 👉 Journey Table Data
  journeyList: Journey[] = []; // empty → shows No Records
@Output() close = new EventEmitter<void>();

  goBack() {
    this.close.emit();
  }
  saveChanges(){
    alert("Changes Saved !");
  }

}

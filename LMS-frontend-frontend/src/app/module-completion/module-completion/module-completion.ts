import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { liveclass } from '../../core/services/liveclass/liveclass';


@Component({
  selector: 'app-module-completion',
  imports: [CommonModule,FormsModule],
  templateUrl: './module-completion.html',
  styleUrl: './module-completion.css',
})
export class ModuleCompletion implements OnInit {
moduleOverviewApiData: any[] = [];
  moduleTrackingList: any[] = [];
courses: string[] = [];
completionSearchText = '';
moduleOverviewList: any[] = [];
selectedCourse = '';

  constructor(private service:liveclass){}
    ngOnInit(): void {
   this.modulereport();
   this.loadCompletionModules();
  }
  modulereport()
  {
      this.service.moduleoverviewreport().subscribe({
      next: (res: any) => {
        
          this.moduleOverviewApiData = res.data || [];
           this.moduleOverviewList = this.moduleOverviewApiData.map((item: any) => ({
             batchId: item.batchId,    
        courseName: item.courseName,
        batchName: `Batch ${item.batchNo}`,
        totalModules: item.totalModules,
        completed: item.modulesCompleted,
        pending: item.modulesPending,
        inProgress: item.modulesInProgress,
        completion: item.courseCompletionPercentage,
        trainerName: item.trainerName || 'N/A'
      }));

      this.courses = [
  ...new Set(this.moduleOverviewApiData.map((item: any) => item.courseName))
];
        
      },
      error: (err: any) => {
        console.error(err);
      
      }
    });
  }

loadCompletionModules() {
  this.service.getModuleDates().subscribe({
    next: (res: any) => {
      const today = new Date();

      this.moduleTrackingList = (res.data || []).map((item: any) => {
        const startDate = new Date(item.moduleStartDate);
        const endDate = new Date(item.moduleEndDate);

        let status = 'Yet To Start';
        let completionDate = '';
        let completion = 0;

        if (today > endDate) {
          status = 'Completed';
          completionDate = item.moduleEndDate;
          completion = 100;
        } else if (today >= startDate && today <= endDate) {
          status = 'Pending';
          completion = 50;
        }

        return {
          // 🔑 REQUIRED FOR VIEW DETAILS (VERY IMPORTANT)
          batchId: item.batchid,
          courseName: item.coursename,
          inProgress: item.modulename,
          completion: completion,
          trainerName: item.trainerName,

          
          moduleName: item.modulename,
          trainer: item.trainerName,
          startDate: item.moduleStartDate,
          endDate: item.moduleEndDate,
          completionDate: completionDate,
          status: status,
          document: status === 'Completed' ? 'Uploaded' : ''
        };
      });
    },
    error: (err) => {
      console.error('Completion module API error', err);
    }
  });
}


  
     activeTab: 'overview' | 'completion' | 'progress' = 'overview';

  // Optional method (cleaner than inline click)
  setTab(tab: 'overview' | 'completion' | 'progress') {
    this.activeTab = tab;

      if (tab === 'completion' && this.moduleTrackingList.length === 0) {
    // this.loadCompletionModules();
  }
  }

    searchText = '';


get filteredModuleOverviewList(): any[] {
  if (!this.searchText) {
    return this.moduleOverviewList;
  }

  return this.moduleOverviewList.filter(item =>
    item.courseName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
    item.batchName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
    item.trainerName?.toLowerCase().includes(this.searchText.toLowerCase())
  );
}

  get filteredModuleTrackingList(): any[] {
  let list = this.moduleTrackingList;
 
  // Filter by selected course
  if (this.selectedCourse) {
    list = list.filter(item =>
      item.courseName?.trim().toLowerCase() === this.selectedCourse.trim().toLowerCase()
    );
  }
 
  // Filter by search text
  if (this.completionSearchText) {
    const value = this.completionSearchText.toLowerCase();
    list = list.filter(item =>
      item.moduleName?.toLowerCase().includes(value) ||
      item.trainer?.toLowerCase().includes(value) ||
      item.status?.toLowerCase().includes(value)
    );
  }
 
  return list;
}


  viewDetails(row: any) {
    console.log('View details:', row);
  }


  viewDetails1(row: any) {
    console.log('View Details:', row);
  }

  dropdownOpen = false;

toggleDropdown() {
  this.dropdownOpen = !this.dropdownOpen;
}

selectCourse(course: string) {
  this.selectedCourse = course;
  this.dropdownOpen = false;
}

completionVsPendingData = [
  {
    batchName: 'Batch 1',
    totalModule: 4,
    trainer: 'Thariq A',
    startDate: '02-01-2026',
    endDate: '03-01-2026',
    completionDate: '03-01-2026',
    completionPercent: 45,
    avgTime: '4 Hr 45 Mins',
    performance: 'Low'
  },
  {
    batchName: 'Batch 2',
    totalModule: 4,
    trainer: 'Sherif A',
    startDate: '02-01-2026',
    endDate: '03-01-2026',
    completionDate: '03-01-2026',
    completionPercent: 70,
    avgTime: '2 Hr 30 Mins',
    performance: 'Low'
  },
  {
    batchName: 'Batch 3',
    totalModule: 4,
    trainer: 'Hamza A',
    startDate: '02-01-2026',
    endDate: '03-01-2026',
    completionDate: '03-01-2026',
    completionPercent: 85,
    avgTime: '1 Hr 15 Mins',
    performance: 'Good'
  },
  {
    batchName: 'Batch 4',
    totalModule: 4,
    trainer: 'Abu A',
    startDate: '02-01-2026',
    endDate: '03-01-2026',
    completionDate: '03-01-2026',
    completionPercent: 65,
    avgTime: '1 Hr 30 Mins',
    performance: 'Average'
  },
  {
    batchName: 'Batch 5',
    totalModule: 4,
    trainer: 'Nadeem A',
    startDate: '02-01-2026',
    endDate: '03-01-2026',
    completionDate: '03-01-2026',
    completionPercent: 100,
    avgTime: '1 Hr 00 Mins',
    performance: 'Good'
  }
];

showModuleModal = false;

selectedModule: any = null;

viewDetails2(row: any) {
  this.showModuleModal = true;
  this.selectedModule = null;

  this.service.getregisteredbatchstudents(row.batchId).subscribe({
    next: (res: any) => {

      const students = (res.data || []).map((s: any) => s.username);

      this.selectedModule = {
        courseName: row.courseName,
        moduleName: row.inProgress || 'N/A',
        trainer: row.trainerName || 'N/A',
        quiz: row.completion + '%',
        students: students
      };
    },
    error: (err) => {
      console.error(err);
      this.showModuleModal = false;
    }
  });
}



closeModal() {
  this.showModuleModal = false;
}



}

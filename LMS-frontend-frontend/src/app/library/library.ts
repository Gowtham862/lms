import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { liveclass } from '../core/services/liveclass/liveclass';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './library.html',
  styleUrl: './library.css',
})
export class Library implements OnInit {

  constructor(
    private liveClassService: liveclass,
    private authService: AuthService
  ) {}

  /* ================= INIT ================= */

  ngOnInit(): void {
    this.loadPurchasedCourses(); // ⭐ buttons
    this.loadFiles();            // ⭐ table
  }

  getuserid(): string {
    return localStorage.getItem('userId') || '';
  }

  /* ================= EXISTING STATE (UNCHANGED) ================= */

  activeTab: 'active' | 'completed' | 'similar' = 'active';
  activeTab1: 'course-1' | 'course-2' = 'course-1';

  selectedVideo: string | null = null;
  selectedFileType: 'all' | 'pdf' | 'xls' | 'doc' | 'ppt' = 'all';

  files: any[] = [];

  completedFiles = [
    { name: 'Final Report.pdf', uploadedBy: 'Jacob Jones', date: '12-12-2025', size: '15.4 MB' },
    { name: 'Completion Summary.docx', uploadedBy: 'Jacob Jones', date: '15-12-2025', size: '11.2 MB' },
    { name: 'Presentation.ppt', uploadedBy: 'Jacob Jones', date: '18-12-2025', size: '9.8 MB' },
  ];

  /* ================= REQUIRED FOR BUTTONS ================= */

  enrolledCourses: string[] = [];
  selectedCourse: string = '';

  /* ================= PURCHASE API (COURSE BUTTONS) ================= */

loadPurchasedCourses() {
  this.liveClassService
    .getPurchasedCourses(this.getuserid())
    .subscribe((response: any) => {

      const courses = response?.data || [];

      this.enrolledCourses = [];

      courses.forEach((course: any) => {
        if (
          course?.coursename &&
          !this.enrolledCourses.includes(course.coursename)
        ) {
          this.enrolledCourses.push(course.coursename);
        }
      });

      // auto-select first course
      if (this.enrolledCourses.length > 0) {
        this.selectedCourse = this.enrolledCourses[0];
      }
    });
}



  setCourse(course: string) {
    this.selectedCourse = course;
    this.selectedFileType = 'all';
  }

  /* ================= SESSION REPORT API (FILES) ================= */
formatFileSize(kb: number): string {
    if (kb >= 1024 * 1024) {
      return `${(kb / (1024 * 1024)).toFixed(2)} GB`;
    } else if (kb >= 1024) {
      return `${(kb / 1024).toFixed(2)} MB`;
    } else {
      return `${kb} KB`;
    }
  }
  loadFiles() {
    this.liveClassService.getSessionReportByUser(this.getuserid())
      .subscribe((response: any[]) => {
        this.files = response.map(item => {
          const meta = item.metadata?.[0];

          return {
           name: meta.fileName
    ? meta.fileName.substring(meta.fileName.indexOf('_') + 1)
    : '-',
  originalName: meta.fileName,
            uploadedBy: item?.trainername ?? 'N/A',
            courseName: item?.coursename ?? '',
            date: meta?.createdISO
              ? new Date(meta.createdISO).toLocaleDateString('en-GB')
              : '-',
           size: meta.fileSizeKB ? this.formatFileSize(meta.fileSizeKB) : '-',
          };
        });
      });
  }

  /* ================= FILE FILTER ================= */

  get filteredFiles() {
    let data = [...this.files];

    // course filter
    if (this.selectedCourse) {
      data = data.filter(file => file.courseName === this.selectedCourse);
    }

    // file type filter
    if (this.selectedFileType !== 'all') {
      data = data.filter(file => {
        const ext = this.getFileExtension(file.name);
        if (this.selectedFileType === 'pdf') return ext === 'pdf';
        if (this.selectedFileType === 'xls') return ext === 'xls' || ext === 'xlsx';
        if (this.selectedFileType === 'doc') return ext === 'doc' || ext === 'docx';
        if (this.selectedFileType === 'ppt') return ext === 'ppt' || ext === 'pptx';
        return true;
      });
    }

    return data;
  }

  get filteredCompletedFiles() {
    if (this.selectedFileType === 'all') return this.completedFiles;

    return this.completedFiles.filter(file => {
      const ext = this.getFileExtension(file.name);
      if (this.selectedFileType === 'pdf') return ext === 'pdf';
      if (this.selectedFileType === 'xls') return ext === 'xls' || ext === 'xlsx';
      if (this.selectedFileType === 'doc') return ext === 'doc' || ext === 'docx';
      if (this.selectedFileType === 'ppt') return ext === 'ppt' || ext === 'pptx';
      return true;
    });
  }

  /* ================= HELPERS ================= */

  setTab(tab: 'active' | 'completed' | 'similar') {
    this.activeTab = tab;
    this.selectedVideo = null;
    this.selectedFileType = 'all';
  }

  setFileFilter(type: 'all' | 'pdf' | 'xls' | 'doc' | 'ppt') {
    this.selectedFileType = type;
  }

  playVideo(src: string) {
    this.selectedVideo = src;
    this.activeTab = 'completed';
  }

  closePlayer() {
    this.selectedVideo = null;
  }

  getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }

  getFileIcon(fileName: string): string {
    const ext = this.getFileExtension(fileName);
    if (ext === 'pdf') return '/pdf.png';
    if (ext === 'xls' || ext === 'xlsx') return '/xls.png';
    if (ext === 'ppt' || ext === 'pptx') return '/ppt.png';
    if (ext === 'doc' || ext === 'docx') return '/doc.png';
    return '/file.png';
  }

  /* ================= DOWNLOAD ================= */

  downloadFile(file: any) {
    this.liveClassService
      .downloadCertificateFile(file.originalName)
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = file.name;
        anchor.click();
        window.URL.revokeObjectURL(url);
      });
  }
}

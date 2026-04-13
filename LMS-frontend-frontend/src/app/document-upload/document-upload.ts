import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { liveclass } from '../core/services/liveclass/liveclass';
import { AuthService } from '../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './document-upload.html',
  styleUrl: './document-upload.scss',
})
export class DocumentUpload implements OnInit {

  private baseurl=environment.imagebaseurl

  constructor(private service: liveclass, private authService: AuthService,private http: HttpClient) { }

  /* ===================== TABS ===================== */

  activeTab: 'active' | 'document' | 'recording' | 'CCourse' = 'active';
  activeTab1: string = '';
  activeTab2: 'batch-1' | 'batch-2' | 'batch-3' = 'batch-1';

  /* ===================== STATE ===================== */

  selectedCourse: string = '';
  selectedBatch: number | null = null;

  selectedVideo: string | null = null;
  selectedFileType: 'all' | 'pdf' | 'xls' | 'doc' | 'ppt' = 'all';



  files: any[] = [];            // Active Courses Library (OLD API)
  completedFiles: any[] = [];

  recordingFiles: any[] = [];   // Recording Sessions (NEW API)

  courses: { id: string; name: string }[] = [];

  recordingCourses: { id: string; name: string }[] = [];

  /* ===================== INIT ===================== */

  ngOnInit(): void {
    this.loadFiles();        // Active tab (OLD)
    this.loadRecordings(); 


    // Recording tab (NEW)
  }

  getUserId(): string {
    return localStorage.getItem('userId') || '';
  }



  loadFiles() {
    this.service.getSessionFiles(this.getUserId()).subscribe({
      next: (res: any) => {
        console.table(res.data);
        console.log(JSON.stringify(res, null, 2));

        const data = res.data || [];

        const courseMap = new Map<string, boolean>();
        data.forEach((item: any) => courseMap.set(item.coursename, true));

        this.courses = Array.from(courseMap.keys()).map((name, index) => ({
          id: `course-${index}`,
          name
        }));

        if (!this.selectedCourse && this.courses.length) {
          this.selectedCourse = this.courses[0].name;
        }

        this.files = data.flatMap((item: any) =>
          (item.metadata || []).map((meta: any) => ({
name: meta.fileName
    ? meta.fileName.substring(meta.fileName.indexOf('_') + 1)
    : '-',
  originalName: meta.fileName,
            uploadedBy: `Batch ${item.batchno}`,
            courseId: item.courseid,
            batchId: item.batchid,
          date: item?.createdDate
            ? new Date(item.createdDate).toLocaleDateString('en-IN')
            : '-',
           size: meta.fileSizeKB ? this.formatFileSize(meta.fileSizeKB) : '-',
            courseName: item.coursename,
            batchNo: Number(item.batchno)
          }))
        );

        this.completedFiles = [...this.files];
      },
      error: err => console.error('Session files API error', err)
    });
  }

  /* =================================================
     RECORDING SESSIONS (FINAL FIX)
     ========================c========================= */

//   loadRecordings() {

//     const trainerId = this.getUserId();

//     this.service.getTrainerRecordings(this.getUserId()).subscribe({
//       next: (res: any) => {

//         console.log(JSON.stringify(res, null, 2) + "lll");

//         const data = res?.data || [];

//       this.recordingFiles = data.map((item: any) => {
//   const meta = item.metadata?.[0];

//   const fileName = meta?.fileName || '';

//   return {
//    courseId: item.courseid,    
//   batchId: item.batchid,   
//     courseName: item.coursename,
//     moduleName: item.modulename,
//     sessionNo: item.sessionno,
//     batchNo: Number(item.batchno),
//     sessionReportId: item.sessionreportid,

//     name: fileName,
//     date: meta?.createdISO
//       ? new Date(meta.createdISO).toLocaleDateString('en-GB')
//       : '-',
//     size: meta?.fileSizeKB
//       ? `${meta.fileSizeKB} KB`
//       : '-',

//     recorded: item.recorded === true,



//     };

// });


//         const recCourseSet = new Set<string>();
//         this.recordingFiles.forEach(f => recCourseSet.add(f.courseName));

//         this.courses = Array.from(recCourseSet).map((name, index) => ({
//           id: `rec-course-${index}`,
//           name
//         }));

//         this.selectedCourse = this.courses[0]?.name || '';


//         console.log('Recording Sessions:', this.recordingFiles);
//       },
//       error: err => console.error('Recording API failed', err)
//     });
//   }
loadRecordings() {
  this.service.getTrainerRecordings(this.getUserId()).subscribe({
    next: (res: any) => {
      const data = res?.data || [];

      this.recordingFiles = data.map((item: any) => {
        return {
          courseId: item.courseid,
          batchId: item.batchid,
          courseName: item.coursename,
          moduleName: item.modulename,
          sessionNo: item.sessionno,
          batchNo: Number(item.batchno),
          sessionReportId: Number(item.sessionreportid),
          name: '-',
          date: '-',
          size: '-',
          duration: '-',
          recorded: false
        };
      });

      // Auto-select first course
      const recCourseSet = new Set<string>();
      this.recordingFiles.forEach(f => recCourseSet.add(f.courseName));
      this.courses = Array.from(recCourseSet).map((name, index) => ({
        id: `rec-course-${index}`,
        name
      }));
      this.selectedCourse = this.courses[0]?.name || '';

      // Fetch recording details for each session
      this.recordingFiles.forEach((file, index) => {
        this.service.getRecordingVideo(file.sessionReportId).subscribe({
          next: (res: any) => {
            if (res.status === 200 && res.data) {
              const recData = res.data;
              const meta = recData.metadata?.[0];

              this.recordingFiles[index] = {
                ...this.recordingFiles[index],
                name: meta?.fileName ? meta.fileName.replace(/^(\d+_)+/, '') : '-',
                date: recData.enrollDate
                  ? new Date(recData.enrollDate).toLocaleDateString('en-GB')
                  : '-',
                size: meta.fileSizeKB ? this.formatFileSize(meta.fileSizeKB) : '-',
                duration: meta?.durationMinutes ? `${meta.durationMinutes} mins` : '-',
                recorded: !!meta?.fileName
              };
            }
          },
          error: () => {
            // No recording yet — keep defaults
          }
        });
      });
    },
    error: err => console.error('Recording API failed', err)
  });
}
formatFileSize(kb: number): string {
    if (kb >= 1024 * 1024) {
      return `${(kb / (1024 * 1024)).toFixed(2)} GB`;
    } else if (kb >= 1024) {
      return `${(kb / 1024).toFixed(2)} MB`;
    } else {
      return `${kb} KB`;
    }
  }
  setTab(tab: 'active' | 'document' | 'recording' | 'CCourse') {
    this.activeTab = tab;
    this.selectedVideo = null;
    this.selectedFileType = 'all';
    this.selectedBatch = null;
  }

  setFileFilter(type: 'all' | 'pdf' | 'xls' | 'doc' | 'ppt') {
    this.selectedFileType = type;
  }

get filteredFiles() {

  let data = this.files;

  /* 🔹 1. Filter by Course */
  if (this.selectedCourse) {
    data = data.filter(
      file => file.courseName === this.selectedCourse
    );
  }

  /* 🔹 2. Filter by File Type */
  if (this.selectedFileType !== 'all') {

    data = data.filter(file => {

      const ext =
        this.getFileExtension(file.name);

      if (this.selectedFileType === 'pdf')
        return ext === 'pdf';

      if (this.selectedFileType === 'xls')
        return ext === 'xls' || ext === 'xlsx';

      if (this.selectedFileType === 'doc')
        return ext === 'doc' || ext === 'docx';

      if (this.selectedFileType === 'ppt')
        return ext === 'ppt' || ext === 'pptx';

      return true;
    });
  }

  return data;
}


get availableBatches() {

  if (!this.selectedCourse) return [];

  return Array.from(

    new Set(
      this.recordingFiles
        .filter(f =>
          f.courseName === this.selectedCourse   
        )
        .map(f => f.batchNo)
    )

  );
}


  get filteredRecordingFiles() {
    return this.recordingFiles.filter(file =>
      (!this.selectedCourse || file.courseName === this.selectedCourse) &&
      (!this.selectedBatch || file.batchNo === this.selectedBatch)
    );
  }

selectCourse(courseName: string) {

  console.log('Selected Course →', courseName);

  this.selectedCourse = courseName;
}


  /* ===================== HELPERS ===================== */

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

downloadFile(file: any) {

  console.log('Download file object →', file);

  if (file.name && !file.sessionReportId) {

    const url = `${this.baseurl}${file.originalName}`;

    console.log('Document URL:', url);

    this.http.get(url, { responseType: 'blob' })
      .subscribe({

        next: (blob: Blob) => {

          const downloadUrl =
            window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = file.name;
          a.click();

          window.URL.revokeObjectURL(downloadUrl);
        },

        error: err => {
          console.error('Document download failed', err);
        }
      });

    return;
  }

  /* ================= RECORDING DOWNLOAD ================= */
  if (file.sessionReportId) {

    this.service.getRecordingVideo(file.sessionReportId)
      .subscribe({

        next: (res: any) => {

          if (res.status !== 200 || !res.data?.length) {
            console.error('No video found');
            return;
          }

          const fileName = res.data[0].fileName;
          const url = `${this.baseurl}${fileName}`;

          console.log('Recording URL:', url);

          this.http.get(url, { responseType: 'blob' })
            .subscribe({

              next: (blob: Blob) => {

                const downloadUrl =
                  window.URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = fileName;
                a.click();

                window.URL.revokeObjectURL(downloadUrl);
              },

              error: err => {
                console.error('Recording download failed', err);
              }
            });

        },

        error: err => {
          console.error('Recording fetch failed', err);
        }
      });

    return;
  }

  console.error('Unknown file type');
}

  isRecordingModalOpen = false;
  selectedRecording: any = null;
  selectedUploadFile: File | null = null;
  videoUrl: string | null = null;
  isUploading = false;
  openRecordingModal(file: any) {
    this.selectedRecording = file;
    this.isRecordingModalOpen = true;
    this.selectedUploadFile = null;
  }

closeRecordingModal() {
  this.isRecordingModalOpen = false;
  this.selectedRecording = null;
  this.selectedUploadFile = null;
}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.mp4')) {
      alert('Only MP4 files allowed');
      return;
    }

    this.selectedUploadFile = file;
  }

  removeFile() {
    this.selectedUploadFile = null;
  }


  //put and get the video
  uploadRecording() {
    if (!this.selectedUploadFile || !this.selectedRecording) {
      return;
    }

    const formData = new FormData();

    formData.append('file', this.selectedUploadFile);
    const sessionPayload = {
      courseid: Number(this.selectedRecording.courseid),
      batchid: Number(this.selectedRecording.batchid),
      sessionreportid: this.selectedRecording.sessionReportId,
      coursename: this.selectedRecording.courseName,
      modulename: this.selectedRecording.moduleName,
      sessionno: this.selectedRecording.sessionNo,
      batchno: this.selectedRecording.batchNo,
      trainerid: this.getUserId()
    };
    formData.append('session', JSON.stringify(sessionPayload));
    this.isUploading = true;
    this.service.addRecordingSession(formData).subscribe({
      next: (res: any) => {
        this.isUploading = false;
        if (res?.status === true) {
          if (res?.status === true) {
            const index = this.recordingFiles.findIndex(
              r => r.sessionReportId === this.selectedRecording.sessionReportId
            );
            if (index !== -1) {
              this.recordingFiles[index].hasRecording = true;
              this.selectedRecording = this.recordingFiles[index];
            }
            this.openVideoModal(this.selectedRecording);
          }

        }

        this.selectedUploadFile = null;
        this.loadRecordings();
      },


      error: err => {
        this.isUploading = false;
        console.error('Upload failed', err);
        alert('Upload failed');
      }
    });
  }

  // playRecording(file: any) { 
  //   this.videoUrl = null;

  //   this.service.getRecordingVideo(file.sessionReportId).subscribe({

  //     next: (blob: Blob) => {

  //       this.videoUrl = URL.createObjectURL(blob);
  //     },
  //     error: err => {
  //       console.error('Video load failed', err);
  //       alert('Unable to load video');
  //     }
  //   });
  // }

//view recording
isVideoModalOpen = false;
// videoUrls: string | null = null;

// openVideoModal(file: any) {
//   this.isVideoModalOpen = true;

//   this.videoUrl = file.videoUrl;

//   this.service.getRecordingVideo(file.sessionReportId).subscribe({
//     next: (blob: Blob) => {
//       this.videoUrl = URL.createObjectURL(blob);
//     },
//     error: err => {
//       console.error('Video load failed', err);
//       alert('Unable to load video');
//     }
//   });
// }

openVideoModal(file: any) {
  console.log('SessionReportId:', file.sessionReportId); 
  this.isVideoModalOpen = true;

  // Direct video path
  // this.videoUrl = file.videoUrl;
    this.loadSessionVideo(file.sessionReportId);
}

closeVideoModal() {
  this.isVideoModalOpen = false;
  this.videoUrl = null;
}


loadSessionVideo(sessionId: number) {
  this.videoUrl = null;
  this.service.getRecordingVideo(sessionId).subscribe({
    next: (res: any) => {
      if (res.status === 200 && res.data) {
        const meta = res.data.metadata?.[0];  // ← res.data.metadata[0]
        this.videoUrl = meta?.fileName ? `${this.baseurl}${meta.fileName}` : null;
        console.log('Video URL:', this.videoUrl);
      }
    },
    error: (err) => console.error('Error loading video', err)
  });
}



}
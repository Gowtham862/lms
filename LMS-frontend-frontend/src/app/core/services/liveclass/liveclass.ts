import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class liveclass {
  constructor(private API: ApiService, private http: HttpClient) { }


  liveclassdata() {
    return this.API.get('addnewcourses/getallcourses');
  }
  publishedcourses() {
    return this.API.get('addnewcourses/getpublishedcourse');
  }

  getTrainerById(trainerid: string) {
  return this.API.get(`addtrainer/findbyid/${trainerid}`);
}

GetTrainers(){
    return this.API.get('addtrainer/getalltrainer');
  }
    publishedbatchcourses() {
    return this.API.get('purchase/getbatchwithcourse');
  }
  addbatchdata(data: any) {
    return this.API.post('batch/add', data);
  }
  getallbatch() {
    return this.API.get('batch/getallbatch');
  }
  getCourseById(courseid: string) {
    console.log("calling.....")
    console.log(courseid)
    return this.API.get(`addnewcourses/findbyid/${courseid}`);
  }
  
  findBatchbyCourseid(courseids: string) {
    console.log("batchbycourseid")
    return this.API.get(`batch/findbyid/${courseids}`);
  }

  findBatchbyid(courseids: string) {
    return this.API.get(`batch/findbybatchid/${courseids}`);
  }
  savepurchase(data: any) {
    return this.API.post('purchase/add', data);
  }

  enrollecoursecheck(userid: string) {
    return this.API.get(`purchase/user/${userid}`);
  }
   enrollecoursechec(userid: string) {
    return this.API.get(`intersted/status/${userid}`);
  }

  getalluserpurchasedcourse() {
    return this.API.get('purchase/getall');
  }
   Assignedcoursefortrainer(userid: string) {
    return this.API.get(`batch/trainer/${userid}`);
  } 
  Assignedcoursetrainer(userid: string) {
    return this.API.get(`batch/details/${userid}`);
  } 
    getbatch(){
      return this.API.get('purchase/getbatchwithcourse')
    }
 
    updatebatch(batchId:number,payload: any) {
      console.log('Updating batch with ID:', batchId, 'Payload:', payload);
      return this.API.patch(`batch/update/${batchId}`, payload);
    }

    getregisteredbatchstudents(batchid:string){
      return this.API.get(`purchase/findstudents/${batchid}`);
      
    }
   uploadSessionReport(formData: FormData) {
   
  return this.API.post('sessionreport/uploa?file',formData );
}

//module completion API'S
   moduleoverviewreport()
   {
       return this.API.get('sessionreport/getall');
   }
 
 getModuleDates() {
  return this.API.get('sessionreport/dates');
}
// certificate issunace
getCertificateIssuance() {
  return this.API.get('sessionreport/getAl');
}


issueCertificate(payload: {
  userid: number;
  username: string;
  coursename: string;
  courseid:number;
}) {
  const params = new HttpParams()
    .set('username', payload.username)
    .set('coursename', payload.coursename)
    .set('userid', payload.userid.toString())
    .set('courseid', payload.courseid)

  return this.API.post(
    'certificate/test-generate',
    null,          // ✅ NO BODY
    { params }     // ✅ REQUEST PARAMS
  );
}

 download(courseids: string) {
    console.log("batchbycourseid")
    return this.API.get(`certificate/download/user/${courseids}`);
  }

  // library
  getSessionReportByUser(userId: string) {
  return this.API.get(`sessionreport/user/${userId}`);
}
 
 
downloadCertificateFile(fileName: string) {
  return this.API.get(
    `certificate/download/${encodeURIComponent(fileName)}`,
    { responseType: 'blob' }
  );
}
 
getPurchasedCourses(userId: string) {
  return this.API.get(`purchase/${userId}/getpurchasedcourses`);
}
getindividualtrainer(userId:String){
   return this.API.get(`sessionreport/trainer/${userId}`);
}

// trainer dashboard card data
getBatchCounts(trainerId: string) {
  return this.API.get(`batch/batchcounts/${trainerId}`);
}

getIncompleteCourses(userId: string) {
  return this.API.get(`batch/incompletedcours/${userId}`);
}
getcompleteCourse(userId: string) {
  return this.API.get(`batch/trainerprogress/${userId}`);
}
getCompletedCourses(userId: string) {
  return this.API.get(`batch/completedcours/${userId}`);
}


getSessionFiles(userId: string) {
  return this.API.get(`sessionreport/sessions/${userId}`);
}

getcoursedetails(){
  return this.API.get('addnewcourses/count');
}

gettrainerdetails(){
  return this.API.get('addtrainer/stats');
}
gettraineeattendance(userId:string) {
  return this.API.get(`sessionreport/student/${userId}/overall`);
}
gettrainersummary(){
  return this.API.get('batch/summary');
}
gettotalbatch(){
  return this.API.get('batch/total/count');
}
gettraineeoverview(){
  return this.API.get('purchase/traineepurchases');
}
getcourseoverview(){
  return this.API.get('addnewcourses/overview/trainee');
}

downloadCertificateByUserAndCourse(userId: string, courseId: number) {
  return this.API.get(
    `certificate/download/user/${userId}/course/${courseId}`,
    { responseType: 'blob' }
  );
}

//session recording
getTrainerRecordings(trainerId: string) {
  return this.API.get(`sessionreport/trainer/recording/${trainerId}`
  );
}

//get and put the video

addRecordingSession(formData: FormData) {
  return this.API.post('Recordingsessions/add', formData);
}

getRecordingVideo(sessionreportid: number) {
  return this.API.get(
    `Recordingsessions/session/${sessionreportid}`
  );
}

//new requirment for the active and completed course
getCourseProgress(userId: string) {
  return this.API.get(`purchase/progress/${userId}`);
}

//updated course
  // 🔹 Modules + Sessions by Course
getModulesWithSessions(courseId: number) {
  return this.API.get(
    `sessionreport/modulessessions/${courseId}`
  );
}
 
// 🔹 Recording + Documents by session
getSessionRecording(sessionReportId: number) {
  return this.API.get(
    `sessionreport/recording/${sessionReportId}`
  );
}


reject(payload: {
  userid: number;
  username: string;
  coursename: string;
  courseid:number;
}) {
  const params = new HttpParams()
    .set('username', payload.username)
    .set('coursename', payload.coursename)
    .set('userid', payload.userid.toString())
    .set('courseid', payload.courseid)
 
  return this.API.post(
    'certificate/reject-certificate',
    null,        
    { params }    
  );
}
//student list
getAllStudents(batchId: number) {
  return this.API.get(`purchase/batch/${batchId}`);
}
//sales and marketing
getLeads(page: number = 0) {
  return this.API.get(`intersted/findall/${page}`);
}
 
// 👉 Get Lead Details by ID
getLeadById(id: number) {
  return this.API.get(`intersted/findbyid/${id}`);
}
updatebyinterstid(id: number) {
  return this.API.put(`intersted/update/status/${id}`,{});
}
updatebyinterstatusdenied(id: number) {
  return this.API.put(`intersted/update/denied/${id}`,{});
}
 
// ✅ SAVE INTERESTED STUDENT
saveInterestedStudent(data: any) {
  return this.API.post(
    'intersted/save/student',
    data
  );
}

// ✅ Recommended Courses
// liveclass.service.ts

getAllRecommendedCourses() {
  return this.API.get(
    `addnewcourses/recommended`
  );
}


getRecommendedCourses(courseId: string | number) {
  return this.http.get( `${environment.apiBaseUrl}/addnewcourses/recommended/${courseId}`);
}
getRecommendedCoursesByUserId(userId:string|number){
  return this.API.get(`addnewcourses/recommended/user/${userId}`)
}

getTrainersByCourseId(courseId: string) {
  return this.http.get<any[]>(
    `${environment.apiBaseUrl}/batch/trainer/course/${courseId}`
  );
}
}
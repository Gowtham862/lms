import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { ApiService } from '.././core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(private API: ApiService,private http: HttpClient) {}
  

  AddCourse(formData:FormData){
    return this.API.post('addnewcourses/uploa',formData)
  }
  GetAllCourses(){
    return this.API.get('addnewcourses/getallcourses');
  }
 
  getCourseById(courseid: string) {
  return this.API.get(`addnewcourses/findbyid/${courseid}`);
}

updateCourse(courseid: string, formData: FormData) {
  return this.API.patch(`addnewcourses/updatecourse/${courseid}`, formData);

}
 deleteModule(coursed: string) {
  return this.API.delete(`addnewcourses/delete/${coursed}`);
 
}
 
}
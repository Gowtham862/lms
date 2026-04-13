import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TrainerService {

  constructor( private API: ApiService,private http: HttpClient) { }

  AddTrainer(formData:FormData){
    return this.API.post('addtrainer/upload',formData)
  
}
 GetTrainers(){
    return this.API.get('addtrainer/getalltrainer');
  }


// updateTrainer(trainerid: string, trainer: any) {
//   return this.API.patch(`addtrainer/update/${trainerid}`, trainer);
// }
updateTrainer(trainerid: string, formData: FormData) {
  return this.API.patch(`addtrainer/update/${trainerid}`, formData);
}
getTrainerById(trainerid: string) {
  return this.API.get(`addtrainer/findbyid/${trainerid}`);
}
getTrainersByCourseId(courseId: string) {
  return this.http.get<any[]>(`${environment.apiBaseUrl}/batch/trainer/course/${courseId}`);
}




}
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SuperAdminservice {
  constructor(private API:ApiService,private http:HttpClient){}
   
     AddAdmin(formData:FormData){
    return this.API.post('superadmin/save',formData)
 
}
 
 GetAdmin(){
    return this.API.get('superadmin/getalladmin');
  }
 
 
 
updateAdmin(adminid: number, formData: FormData) {
  return this.API.patch(`superadmin/update/${adminid}`, formData);
}
 
getAdminById(adminid: number) {
  return this.API.get(`superadmin/${adminid}`);
}
 
}

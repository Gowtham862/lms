
import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ForgotpasswordService {
  constructor(private API: ApiService,private http: HttpClient) {}

  Forgotpassservice(data:any)
  {
      return this.API.post(`forgotpassword/sendOtp/${data}`,{});
  }
  updatepassword(data:any)
  {
    return this.API.post('forgotpassword/changepassword',data)
  }
  
}

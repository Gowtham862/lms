import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface LoginResponse {
  status: number;
  message: string;
  data: {
    token: string;
    userid: string;
    firstname: string;
    role: string;
    email: string;
    phone:string;
  };
}
@Injectable({ providedIn: 'root' })

export class AuthService {
  getIncompleteCourses(arg0: string) {
    throw new Error('Method not implemented.');
  }
private baseUrl = environment.apiBaseUrl;
  private userKey = 'currentUser';
  private tokenKey = 'authToken';
  private roleKey = 'role';
  private idKey = 'userId';
  private emailKey = 'useremail';
   private phoneKey='phonekey';

  constructor(private api: ApiService,private http: HttpClient) {}

 
getUserId(): string | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem(this.idKey);
  }
  return null;
}
getrole() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem("role");
  }
  return null; 
}
getphoneNumber() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem(this.phoneKey);
  }
  return null;
}
   login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/users/login`, { email, password })
      .pipe(
        tap((res) => {
          console.log('Login response:', res);
          
          console.log(res.data.phone)
 
          if (res && res.data) {
            console.log('Login data:', res.data);
   
            if (res.data.token) {
              localStorage.setItem(this.tokenKey, res.data.token);
          
            }
            if (res.data.userid) {
              localStorage.setItem(this.idKey, res.data.userid);
            }
            if (res.data.role) {
              localStorage.setItem(this.roleKey, res.data.role);
            }
             if(res.data.phone)
            {
               localStorage.setItem(this.phoneKey, res.data.phone);
            }
            if (res.data.firstname) {
              localStorage.setItem(this.userKey, res.data.firstname);
            }
            if (res.data.email) {
              localStorage.setItem(this.emailKey, res.data.email);
            }
            console.log(this.getphoneNumber());
          }
        })
      );
  }
    logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
      localStorage.removeItem(this.roleKey);
      localStorage.removeItem(this.idKey);
      localStorage.removeItem(this.emailKey);
    }
  }
 isAuthenticated(): boolean {
    return !!this.getToken();
  }
    getToken(): string | null{
    if (typeof window !== 'undefined' && window.localStorage) {
      var token=localStorage.getItem(this.tokenKey)
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }
   getCurrentUser():string| null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const user = localStorage.getItem(this.userKey);
      
      return localStorage.getItem(this.userKey);
    }
    return null;
  }
   getAuthHeaders(): HttpHeaders {
      return new HttpHeaders({
        Authorization: `Bearer ${this.getToken()}`,
      });
    }
  
}

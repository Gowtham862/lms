import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {

  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}
   private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
    return new HttpHeaders();
  }

   get(url: string, options: any = {}): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseUrl}/${url}`, { ...options, headers });
  }

 post(url: string, body: any, options: any = {}): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.baseUrl}/${url}`, body, { ...options, headers });
  }

   put(url: string, body: any, options: any = {}): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put<any>(`${this.baseUrl}/${url}`, body, { ...options, headers });
  }

 delete(url: string, options: any = {}): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.baseUrl}/${url}`, { ...options, headers });
  }

patch(url: string, body: any, options: any = {}): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.patch<any>(
    `${this.baseUrl}/${url}`,
    body,
    { ...options, headers }
  );}


  
  
}


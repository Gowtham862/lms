import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class quizservice {
  constructor(private API: ApiService,private http: HttpClient) {}

   getquiz() {
    return this.API.get('question/getallquestion');
    }
  
}

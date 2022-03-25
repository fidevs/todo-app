import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment as env } from '../../environments/environment';

export interface Task {
  desc: string;
  duration: number;
}

export interface TaskDetail {
  id: string;
  desc: string;
  duration: number;
  finalDate: string | null;
  delay: number;
  status: "COMPLETED" | "PENDING";
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  saveNewTask(task: Task): Observable<HttpResponse<TaskDetail>> { // Record new task in DB
    console.log("Saving new task: ", task);
    return this.http.post<TaskDetail>(`${env.apiUrl}/task`, task, { observe: 'response' });
  }

  consultList(status: string, orderBy: string, order: string): Observable<TaskDetail[]> { // Filter and sort task list
    console.log("Consulting task list"); // Configure request params
    const params: HttpParams = new HttpParams().set("orderBy", orderBy).set("order", order);
    status !== "ALL" && params.set("status", status);

    return this.http.get<TaskDetail[]>(`${env.apiUrl}/task`, { params });
  }

  removeTask(id: string): Observable<TaskDetail> { // Mark task as delete
    console.log("Delete task");
    return this.http.delete<TaskDetail>(`${env.apiUrl}/task/${id}/status`);
  }

}

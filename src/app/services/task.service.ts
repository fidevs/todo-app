import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TaskDetail } from './api.service';

export interface CurrentTask {
  id: string;
  desc: string;
  duration: number;
  time: number;
  running: boolean;
};

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  current: CurrentTask[] = [];
  taskList: TaskDetail[] = [];

  constructor() { }

  addTask(task: TaskDetail): TaskDetail[] { // Add task to list
    this.taskList.push(task);
    return this.taskList;
  }

  mapList(tasks: TaskDetail[]): TaskDetail[] { // Add tasks to list
    this.taskList = tasks;
    return this.taskList;
  }

  removeTask(id: string): TaskDetail[] { // Remove task from list
    this.taskList = this.taskList.filter(task => task.id !== id);
    return this.taskList;
  }

  updateTask(updatedTask: TaskDetail): TaskDetail[] { // Update task from list
    this.taskList = [
      ...this.taskList.filter(task => task.id !== updatedTask.id),
      updatedTask
    ];
    return this.taskList;
  }

  localSearch(term: string): Observable<TaskDetail[]> {
    const results: TaskDetail[] = term === ""
      ? this.taskList
      : this.taskList.filter(item => item.desc.toLowerCase().indexOf(term.toLowerCase()) !== -1);
    console.log({results});
    return of(results);
  }

}

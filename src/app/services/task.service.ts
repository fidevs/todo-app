import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TaskDetail } from './api.service';

export interface CurrentTask {
  id: string;
  desc: string;
  duration: number;
  time: number;
  running: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  current: CurrentTask[] = [];
  taskList: TaskDetail[] = [];
  pendingList: TaskDetail[] = [];

  constructor() { }

  addTask(task: TaskDetail): TaskDetail[] { // Add task to list
    this.taskList = [...this.taskList, task];
    if (task.status === 'PENDING') this.pendingList = [...this.pendingList, task];
    return this.taskList;
  }

  mapList(tasks: TaskDetail[], firstLoad: boolean): TaskDetail[] { // Add tasks to list
    const filteredTask = tasks.filter(task => this.current.find(t => t.id === task.id) === undefined);
    this.taskList = filteredTask;
    if (firstLoad) this.pendingList = filteredTask.filter(task => task.status !== 'COMPLETED');
    return this.taskList;
  }

  removeTask(id: string): TaskDetail[] { // Remove task from list
    this.taskList = this.taskList.filter(task => task.id !== id);
    this.pendingList = this.pendingList.filter(task => task.id !== id);
    return this.taskList;
  }

  updateTask(updatedTask: TaskDetail): TaskDetail[] { // Update task from list
    this.taskList = [
      ...this.taskList.filter(task => task.id !== updatedTask.id),
      updatedTask
    ];
    return this.taskList;
  }

  startTask({ id, desc, duration }: TaskDetail): TaskDetail[] { // Send task to running list. Return new list
    this.current = [
      ...this.current,
      { id, desc, duration, running: true, time: 0 }
    ];
    this.taskList = [...this.taskList.filter(task => task.id !== id)];
    this.pendingList = [...this.pendingList.filter(task => task.id !== id)];
    return this.taskList;
  }

  saveCurrentTask(task: CurrentTask): void { // Save current task details
    this.current = [
      ...this.current.filter(t => t.id !== task.id),
      task
    ];
  }

  backupCurrentTask(): void { // Save progress of current task list
    localStorage.setItem("tasks", JSON.stringify(this.current));
  }

  loadCurrentTaskBackup(): void { // Load backup of current task list
    const backup = localStorage.getItem("tasks");
    const array: CurrentTask[] = backup === null ? [] : JSON.parse(backup);
    this.current = array.map(t => Object.assign({}, t, { running: false }));
  }

  removeCurrentTask(id: string): void { // Remove task from current list
    console.log("removeCurrentTask");
    this.current = this.current.filter(task => task.id !== id);
  }

  localSearch(term: string): Observable<TaskDetail[]> { // TODO: Not working
    const results: TaskDetail[] = term === ""
      ? this.taskList
      : this.taskList.filter(item => item.desc.toLowerCase().indexOf(term.toLowerCase()) !== -1);
    return of(results);
  }

}

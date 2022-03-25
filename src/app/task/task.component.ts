import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService, TaskDetail } from '../services/api.service';
import { SnackbarService } from '../services/snackbar.service';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  @Input() task!: TaskDetail; // Task details

  @Output() updateList = new EventEmitter<TaskDetail[]>(); // Upgrade task list

  // View indicators
  deleting = false;
  updating = false;

  constructor(
    private api: ApiService,
    private taskService: TaskService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {}

  delete(): void {
    this.deleting = true;
    this.api.removeTask(this.task.id).subscribe({
      next: deletedTask => {
        // Remove task from list and update task on view
        this.updateList.emit(this.taskService.removeTask(deletedTask.id));
        this.snackbar.open("¡Tarea borrada con éxito!", "OK", 3000);
      },
      error: () => this.deleting = false,
      complete: () => this.deleting = false
    });
  }

}

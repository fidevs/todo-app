import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService, TaskDetail, Task } from '../services/api.service';
import { SnackbarService } from '../services/snackbar.service';
import { TaskService } from '../services/task.service';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent {
  @Input() task!: TaskDetail; // Task details

  @Output() updateList = new EventEmitter<TaskDetail[]>(); // Upgrade task list

  // View indicators
  deleting = false;
  updating = false;

  constructor(
    private api: ApiService,
    private taskService: TaskService,
    private snackbar: SnackbarService,
    public dialog: MatDialog
  ) {}

  update(): void { // Send request to update task
    const dialogRef = this.dialog.open(TaskDialogComponent, { // Open dilog to update task
      width: '300px',
      data: { id: this.task.id, task: { desc: this.task.desc, duration: this.task.duration } }
    });

    dialogRef.afterClosed().subscribe((result: Task) => {
      if (result !== undefined) {
        this.updating = true;
        this.api.updateTask(this.task.id, result).subscribe({
          next: updatedTask => {
            // Upgrade task from list and update task on view
            this.updateList.emit(this.taskService.updateTask(updatedTask));
            this.snackbar.open("¡Tarea actualizada con éxito!", "OK", 3000);
          },
          error: () => this.updating = false,
          complete: () => this.updating = false
        });
      }
    });
  }

  delete(): void { // Send request to delete task
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

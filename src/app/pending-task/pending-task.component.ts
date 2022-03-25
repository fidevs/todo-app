import { Component, EventEmitter, Output } from '@angular/core';
import { TaskDetail } from '../services/api.service';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-pending-task',
  templateUrl: './pending-task.component.html',
  styleUrls: ['./pending-task.component.css']
})
export class PendingTaskComponent {
  @Output() updateList = new EventEmitter<TaskDetail[]>(); // Upgrade task list

  constructor(public service: TaskService) { }

}

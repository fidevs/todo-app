import { Component, Input, OnInit } from '@angular/core';
import { TaskDetail } from '../services/api.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  @Input() task!: TaskDetail;
  constructor() { }

  ngOnInit(): void {
  }

}

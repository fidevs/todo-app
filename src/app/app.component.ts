import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';

export interface Task {
  description: string;
  duration: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'todo-app';
  task: Task | null = null;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '300px',
      data: { description: "Descripción", duration: 120 }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log({result});
      this.task = result;
    });
  }

}

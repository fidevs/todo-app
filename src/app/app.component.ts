import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  Subject,
  switchMap,
} from 'rxjs';
import { ApiService, Task, TaskDetail } from './services/api.service';
import { SnackbarService } from './services/snackbar.service';
import { CurrentTask, TaskService } from './services/task.service';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  // Task filters
  filter: 'ALL' | 'PENDING' | 'COMPLETED' = 'ALL';
  sortBy: 'desc' | 'date' | 'duration' | 'delay' | 'status' = 'desc';
  orderAsc = true;
  search = '';

  // View flags
  savingTask = false;
  searchingList = false;

  // Task list to display
  list$!: Observable<TaskDetail[]>;
  private searchTerms = new Subject<string>();

  constructor(
    public dialog: MatDialog,
    private api: ApiService,
    private taskService: TaskService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.refreshList(); // Get task list
    this.list$ = this.searchTerms.pipe(
      // wait 500ms after each keystroke before considering the term
      debounceTime(500),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.taskService.localSearch(term))
    );
    this.list$.subscribe();
  }

  refreshList() { // Consult task list in server
    this.searchingList = true;
    this.api.consultList(this.filter, this.sortBy, this.orderAsc ? "ASC" : "DESC").subscribe({
      next: (list => {
        this.list$ = of(this.taskService.mapList(list)); // Map new list
        this.search = ''; // Clean search input
        this.snackbar.open('Lista actualizada', 'OK', 1500);
      }),
      error: () => this.searchingList = false,
      complete: () => this.searchingList = false
    });
  }
  loadListManually(list: TaskDetail[]): void {
    this.list$ = of(list);
  }

  // Clear box of search
  clearInput(): void {
    this.search = '';
    this.searchTask('');
  }

  // Push a search term into the observable stream.
  searchTask(term: string): void {
    this.searchTerms.next(term);
  }

  // Open modal and save new task
  recordNewTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      // Open dialog
      width: '300px',
      data: { id: null, task: { desc: '', duration: 1 } },
    });

    dialogRef.afterClosed().subscribe((result: Task) => {
      // If user select save button => send request to save task
      if (result !== undefined) {
        this.savingTask = true;
        this.api.saveNewTask(result).subscribe({
          next: (res) => {
            // Add to list just if filter COMPLETED is inactive
            if (res.status === 201 && this.filter !== 'COMPLETED') {
              this.loadListManually(this.taskService.addTask(res.body!));
              this.search = ''; // Clean search input
              this.snackbar.open('Tarea registrada', 'LISTO', 5000);
              // TODO: Add task to pending list
            }
          },
          error: () => (this.savingTask = false),
          complete: () => (this.savingTask = false)
        });
      }
    });
  }

  get currentTasks(): CurrentTask[] {
    return this.taskService.current;
  }
}

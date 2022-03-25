import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { interval, Subscription, Observable } from 'rxjs';
import { ApiService, TaskDetail } from '../services/api.service';
import { SnackbarService } from '../services/snackbar.service';
import { CurrentTask, TaskService } from '../services/task.service';

@Component({
  selector: 'app-current-task',
  templateUrl: './current-task.component.html',
  styleUrls: ['./current-task.component.css'],
})
export class CurrentTaskComponent implements OnInit, OnDestroy {
  @Input() task!: CurrentTask;

  @Output() mapTask = new EventEmitter<TaskDetail>();

  myInterval!: Observable<number>;
  counter: number = 0;
  minutes: number = 0;
  seconds: number = 0;

  loading = false;
  completed = false;

  subscription: Subscription | null = null;

  constructor(
    private api: ApiService,
    private service: TaskService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.counter = this.task.time;
    const minutes = Math.floor(this.counter / 60);
    this.minutes = minutes > 0 ? minutes : 0;
    this.seconds = minutes > 0 ? this.counter - minutes * 60 : this.counter;
    this.myInterval = interval(1000); // Start interval to count seconds
    if (this.task.running) {
      // Play task automatically
      this.subscription = this.myInterval.subscribe(() => this.updateCounter());
    }
  }

  toggleCounter(): void { // Pause/Play counter
    if (this.task.running) this.subscription!.unsubscribe();
    else this.subscription = this.myInterval.subscribe(() => this.updateCounter());
    this.task.running = !this.task.running;
  }

  restartCounter(): void { // Restore and pause counter
    this.task.running = false;
    this.subscription?.unsubscribe();
    this.counter = 0;
    this.minutes = 0;
    this.seconds = 0;
  }

  ngOnDestroy(): void { // Save current task details before destroy
    if (!this.completed) {
      this.subscription?.unsubscribe();
      this.task.time = this.counter;
      this.service.saveCurrentTask(this.task);
    }
  }

  updateCounter(): void { // Update counter and calculate minutes and seconds
    this.counter++;
    const minutes = Math.floor(this.counter / 60);
    this.minutes = minutes > 0 ? minutes : 0;
    this.seconds = minutes > 0 ? this.counter - minutes * 60 : this.counter;
    this.task.time = this.counter;
  }

  done(): void { // Mark task as completed
    this.loading = true;
    this.api.completeTask(this.task.id, this.counter/60).subscribe({
      next: task => {
        console.log("Next");
        this.completed = true;
        this.loading = false
        this.snackbar.open("¡Tarea completada!", "LISTO", 3000);
        this.mapTask.emit(task);
        this.service.removeCurrentTask(task.id);
      },
      error: () => this.loading = false
    })
  }
}

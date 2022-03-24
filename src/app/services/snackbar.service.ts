import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({providedIn: 'root'})
export class SnackbarService {
  constructor(private snackbar: MatSnackBar) { }

  public open(message: string, action = "OK", duration = 3000): void {
    this.snackbar.open(message, action, { duration });
  }
}

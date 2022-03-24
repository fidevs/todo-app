import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(private snackBarService: SnackbarService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((httpError: HttpErrorResponse) => {
        if (httpError.status === 0) {
          // A client-side or network error occurred. Handle it accordingly.
          this.snackBarService.open('Ocurrio un error con la petición', 'OK', 2000);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong.
          console.error(
            `Backend returned code ${httpError.status}, body was: `,
            httpError.error
          );
          if (httpError instanceof HttpErrorResponse) {
            console.log('instanceof HttpErrorResponse');
            switch (httpError.status) {
              case 500:
                this.snackBarService.open('Ocurió un error inesperado intentelo más tarde', 'OK', 2000);
                break;
              case 400:
              case 404:
              case 409:
                if (httpError.error.code && httpError.error.message)
                  this.snackBarService.open(`[${httpError.error.code}]: ${httpError.error.message}`, 'OK', 3000);
                else
                  this.snackBarService.open(
                    `[${httpError.status}]: Ocurió un error inesperado intentelo más tarde`,
                    'OK',
                    2000
                  );
                break;
              default:
                return throwError(httpError);
            }
          }
        }
        // Return an observable with a user-facing error message.
        // return throwError(() => new Error('Something bad happened; please try again later.'));
        return throwError(httpError);
      })
    );
  }
}

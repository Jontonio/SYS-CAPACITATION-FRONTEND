import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { LoaddingService } from '../services/Loadding.service';

@Injectable()
export class HanddleErrorInterceptor implements HttpInterceptor {

  constructor(private _notify:NotificationService, private _loadding:LoaddingService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(
      catchError((e) => {
        this._loadding.setLoadding(false);
        // show message error validations
        if(e.error.errors){
          Object.keys( e.error.errors ).forEach( label => this._notify.error(e.error.message, e.error.errors[label][0]) )
        }
        // show others errors
        if(e.error && !e.error.errors){
          this._notify.error('ERROR: ', e.error.message)
        }

        return throwError(() => e);
      })
    );
    
  }

}

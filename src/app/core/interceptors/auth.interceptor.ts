import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { HttpEvent } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { AuthenticationService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CacheService } from '../services/cache.service';
 
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private _cache:CacheService,
                private authService: AuthenticationService, 
                private dialog: MatDialog) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token = this._cache.getSessionStorage('x-token')

        if (token) {

            const cloned = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + token) 
            });

            return next.handle(cloned).pipe(tap(() => { }, (err: any) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        this.dialog.closeAll();
                        this.authService.redirecToLogin();
                    }
                }
            }));
        } 
        
        return next.handle(req);
    }
}

import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { AuthenticationService } from '../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoaddingService } from '../services/Loadding.service';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private spinner: NgxSpinnerService,
        private loadding:LoaddingService,
        private notificationService:NotificationService,
        private authService: AuthenticationService) { }

    canActivate(): Promise<boolean> {
        
        this.spinner.show();
        this.loadding.setMessage('Modulos del sistema');
        
        return new Promise((resolve, reject) => {
            
            this.authService.getCurrentUser().subscribe({
                next:({ data }) => {
                    this.authService.setUserAuth(data);
                    resolve(true);
                    this.spinner.hide();
                },
                error:(e) => {
                    this.spinner.hide();
                    this.authService.removeLocalStorage('x-token')
                    this.authService.redirecToLogin();
                    reject(false)
                },
            })

        })

    }

}

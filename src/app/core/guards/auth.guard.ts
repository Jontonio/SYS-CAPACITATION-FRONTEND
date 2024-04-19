import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthenticationService } from '../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoaddingService } from '../services/Loadding.service';
import { CacheService } from '../services/cache.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private spinner: NgxSpinnerService,
        private loadding:LoaddingService,
        private _cache:CacheService,
        private authService: AuthenticationService) { }

    canActivate(): Promise<boolean> {
        
        this.spinner.show();
        this.loadding.setMessage('Modulos del sistema');
        
        return new Promise((resolve, reject) => {
            
            this.authService.getCurrentUser().subscribe({
                next:({ data }) => {
                    this.authService.setUserAuth(data);
                    this.spinner.hide();
                    resolve(true);
                },
                error:(e) => {
                    this.spinner.hide();
                    this._cache.removeSessionStorage('x-token')
                    this.authService.redirecToLogin();
                    reject(false)
                },
            })

        })

    }

}

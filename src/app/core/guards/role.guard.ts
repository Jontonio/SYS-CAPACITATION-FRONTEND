import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoaddingService } from '../services/Loadding.service';
import { NotificationService } from '../services/notification.service';
import { AuthenticationService } from '../services/auth.service';
import { CacheService } from '../services/cache.service';
import { PayloadToken } from '../interface/PayloadToken';
import jwtDecode from 'jwt-decode';
import { LocalService } from '../services/local.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private spinner: NgxSpinnerService,
    private loadding:LoaddingService,
    private _cache:CacheService,
    private _local:LocalService,
    private authService: AuthenticationService) { }

canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    
    this.spinner.show();
    this.loadding.setMessage('Modulos del sistema');
    const rolesPermitidos = route.data?.['rolesPermitidos'];

    return new Promise((resolve, reject) => {
        
        const token = this._cache.getSessionStorage('x-token')

        if (!token) {
            resolve(false);
            return;
        }

        this.authService.getCurrentUser().subscribe({
            next:({ data }) => {
                const decoded:PayloadToken = jwtDecode(data.token)
                decoded.id_inia_station?this._local.setStationID(decoded.id_inia_station):'';
                data.roles.forEach( role => {
                    resolve(Boolean(rolesPermitidos.includes(role.name)))
                })
                resolve(false);
            },
            error:(e) => {
                this._cache.removeLocalStorage('x-token')
                this.authService.redirecToLogin();
                reject(false)
            },
        })

    })

}
}

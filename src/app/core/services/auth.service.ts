import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, switchMap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CurrentUser, UserAuth } from '../interface/AuthRes';
import { HttpRes } from '../class/HttpRes';
import { Router } from '@angular/router';
import { CacheService } from './cache.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    public URL:string;
    private keyToken;
    private userAuth!:CurrentUser; 

    constructor(private http: HttpClient,
                private _chache:CacheService,
                private router:Router) {
            this.URL = environment.URL_BASE;
            this.keyToken = 'x-token';
    }

    get KetToken(){
        return this.keyToken;
    }

    get getUserAuth(){
        return this.userAuth;
    }

    setUserAuth(user:CurrentUser){
        this.userAuth = user; 
    }

    login(email: string, password: string){
        return this.http.post(`${this.URL}/login`, { email, password })
        .pipe(
          tap((response:any) => {
            const { data } = response;
            const { token } = data.authorization;
            this._chache.saveSessionStorage(this.keyToken, token)
          }),
          switchMap(res => this.getCurrentUser())
        );
    }

    logout() {
        return this.http.get<HttpRes>(`${this.URL}/logout`).pipe(
            tap((response) => {
                this._chache.removeLocalStorage(this.keyToken);
            })
        )
    }

    redirecToLogin(){
        this.router.navigate(['auth/login']);
    }

    getCurrentUser(): Observable<UserAuth> {
        return this.http.get<UserAuth>(`${this.URL}/user-authenticated`);
    }

    passwordResetRequest(email: string) {
        return of(true).pipe(delay(1000));
    }

    changePassword(email: string, currentPwd: string, newPwd: string) {
        return of(true).pipe(delay(1000));
    }

    passwordReset(email: string, token: string, password: string, confirmPassword: string): any {
        return of(true).pipe(delay(1000));
    }
    
}

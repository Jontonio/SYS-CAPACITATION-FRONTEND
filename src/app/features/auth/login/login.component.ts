import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { LoaddingService } from 'src/app/core/services/Loadding.service';
import { Remember } from 'src/app/core/interface/Remember';
import { CurrentUser } from 'src/app/core/interface/AuthRes';
import { PayloadToken } from 'src/app/core/interface/PayloadToken';
import jwtDecode from 'jwt-decode';
import { Role } from 'src/app/core/interface/Role';
import { LocalService } from 'src/app/core/services/local.service';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginForm!: FormGroup;
    rememberEmail!:boolean;

    constructor(private router: Router,
        private titleService: Title,
        private fb:FormBuilder,
        private _local:LocalService,
        private spinner:NgxSpinnerService,
        private loaddingService:LoaddingService,
        private authenticationService: AuthenticationService) {
        }
        
        ngOnInit() {
            this.titleService.setTitle('SIRDEV - Login');
            this.authenticationService.logout();
            this.createForm();
            this.completeRememberInfo()
    }

    completeRememberInfo(){

        if(!this.authenticationService.getLocalStorage('rememberMe')){
            return;
        }

        const remember = JSON.parse(this.authenticationService.getLocalStorage('rememberMe')||'') as Remember || {} as Remember;
        
        if(remember){
            this.email.setValue(remember.email);
            this.rememberMe.setValue(remember.rememberMe);
        }else{
            this.authenticationService.removeLocalStorage('rememberMe')
        }
    }

    private createForm() {

        const savedUserEmail = localStorage.getItem('savedUserEmail');

        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email ]],
            password:['password', Validators.required],
            rememberMe:[savedUserEmail !== null]
        });
    }

    get email(){
        return this.loginForm.controls['email'];
    }
    get password(){
        return this.loginForm.controls['password'];
    }
    get rememberMe(){
        return this.loginForm.controls['rememberMe'];
    }

    login() {
        
        if(this.loginForm.invalid){
            Object.keys( this.loginForm.controls ).forEach( input => this.loginForm.controls[ input ].markAllAsTouched() )
            return;
        }

        this.spinner.show();
        this.loaddingService.setMessage('Iniciando sesión');
        this.authenticationService
            .login(this.email.value, this.password.value)
            .subscribe({
                next:({ data }) => {
                    
                    const remember:Remember = {email:this.email.value, rememberMe:this.rememberMe.value }

                    if(this.rememberMe.value){
                        this.authenticationService.saveLocalStorage('rememberMe', JSON.stringify(remember));
                    }else{
                        this.authenticationService.removeLocalStorage('rememberMe')
                    }

                    this.redirecToModule(data);

                    this.spinner.hide();
                    
                },
                error:(e) => this.spinner.hide()
            });

    }

    resetPassword() {
        this.router.navigate(['/auth/password-reset-request']);
    }

    redirecToModule(data:CurrentUser){

    
        if( data.roles.length == 0){ // user has not a role
            this.router.navigate(['/has-no-role']);
        }
        
        // Verify roles for routing
        const role = data.roles[0];
        
        switch (role.name) {
            case Role.root:
                console.log("root")
                this.router.navigate(['/root']);
                break;
            case Role.admin:
                this.router.navigate(['/admin']);
                break;
            case Role.station:
                const decoded:PayloadToken = jwtDecode(data.token);
                this._local.setStationID(decoded.id_inia_station!);
                this.router.navigate([`/station/${decoded.id_inia_station!}`]);
                break;
            case Role.viewer:
                this.router.navigate(['/viewer']);
                break;
            default:
                this.router.navigate(['/has-not-role']);
                break;
        }
    }
}

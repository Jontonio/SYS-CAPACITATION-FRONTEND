import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { LoaddingService } from 'src/app/core/services/Loadding.service';
import { Remember } from 'src/app/core/interface/Remember';

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
            password:['', Validators.required],
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
                next:() => {

                    const remember:Remember = {email:this.email.value, rememberMe:this.rememberMe.value }

                    if(this.rememberMe.value){
                        this.authenticationService.saveLocalStorage('rememberMe', JSON.stringify(remember));
                    }else{
                        this.authenticationService.removeLocalStorage('rememberMe')
                    }

                    this.spinner.hide();
                    this.router.navigate(['/main/dashboard'])
                },
                error:(e) => {
                    console.log("first")
                    this.spinner.hide();   
                }
            });

    }

    resetPassword() {
        this.router.navigate(['/auth/password-reset-request']);
    }
}

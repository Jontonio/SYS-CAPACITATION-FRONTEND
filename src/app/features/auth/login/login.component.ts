import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormControl, Validators, UntypedFormGroup, FormGroup, FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginForm!: FormGroup;
    loading!: boolean;

    constructor(private router: Router,
        private titleService: Title,
        private fb:FormBuilder,
        private notificationService: NotificationService,
        private authenticationService: AuthenticationService) {
    }

    ngOnInit() {
        this.titleService.setTitle('SISTEMA - Login');
        this.authenticationService.logout();
        this.createForm();
    }

    private createForm() {

        const savedUserEmail = localStorage.getItem('savedUserEmail');

        this.loginForm = this.fb.group({
            email: [null, [Validators.required, Validators.email ]],
            password:[null, Validators.required],
            rememberMe:[savedUserEmail !== null]
        });
    }

    login() {
        console.log(this.loginForm.value)
        this.loading = true;
        // this.authenticationService
        //     .login(email.toLowerCase(), password)
        //     .subscribe(
        //         data => {
        //             if (rememberMe) {
        //                 localStorage.setItem('savedUserEmail', email);
        //             } else {
        //                 localStorage.removeItem('savedUserEmail');
        //             }
        //             this.router.navigate(['/']);
        //         },
        //         error => {
        //             this.notificationService.openSnackBar(error.error);
        //             this.loading = false;
        //         }
        //     );
    }

    resetPassword() {
        this.router.navigate(['/auth/password-reset-request']);
    }
}

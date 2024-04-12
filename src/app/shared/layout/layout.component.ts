import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Subscription, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

 import { AuthenticationService } from 'src/app/core/services/auth.service';
import { SpinnerService } from '../../core/services/spinner.service';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy, AfterViewInit {

    private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;
    showSpinner: boolean = false;
    userName: string = "";
    isAdmin: boolean = false;

    private autoLogoutSubscription: Subscription = new Subscription;

    constructor(private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher,
        public spinnerService: SpinnerService,
        private dialog:MatDialog,
        private authService: AuthenticationService) {

        this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        // tslint:disable-next-line: deprecation
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnInit(): void {

        const user = this.authService.getUserAuth;

        this.userName = user.name;

    }

    ngOnDestroy(): void {
        // tslint:disable-next-line: deprecation
        this.mobileQuery.removeListener(this._mobileQueryListener);
        this.autoLogoutSubscription.unsubscribe();
    }

    ngAfterViewInit(): void {
        this.changeDetectorRef.detectChanges();
    }

    logout(){
        
        const dialogRefDelete = this.dialog.open(ConfirmDialogComponent,{
            disableClose:true,
            panelClass:'dialog-class',
            data:{
            title:'Cerrar sesión',
            message:`¿Esta seguro de cerrar la sesión en el sistema?`
            }
        });
    
        dialogRefDelete.afterClosed().pipe(
            switchMap((obs) => {
                if(obs){
                    return this.authService.logout();
                }
                return of(null);
            })
        ).subscribe({
            next:(res) =>{
                if(res){
                    this.authService.redirecToLogin()
                }
            }
        });
    }
}

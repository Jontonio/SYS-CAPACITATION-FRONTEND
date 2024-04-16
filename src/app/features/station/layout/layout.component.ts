import { MediaMatcher } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription, of, switchMap } from 'rxjs';
import { LoaddingService } from 'src/app/core/services/Loadding.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { BdService } from 'src/app/core/services/bd.service';
import { LocalService } from 'src/app/core/services/local.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

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
      private routerActive:ActivatedRoute,
      public spinnerService: SpinnerService,
      private dialog:MatDialog,
      private _db:BdService,
      private _loading:LoaddingService,
      public _local:LocalService,
      private authService: AuthenticationService) {
          this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
          this._mobileQueryListener = () => changeDetectorRef.detectChanges();
          // tslint:disable-next-line: deprecation
          this.mobileQuery.addListener(this._mobileQueryListener);
          const id = this.routerActive.snapshot.params['id_inia_station'];
          this._local.setStationID(id);
          this.getStation(id)
  }

  ngOnInit(): void {

      const user = this.authService.getUserAuth;

      this.userName = user.name;

  }

  getStation(id_inia_station:number){
    this._loading.setLoadding(true);
    this._db.getStation(id_inia_station).subscribe({
        next:({ data }) => {
            this._local.setStation(data);
            this._loading.setLoadding(false);
        }
    })
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

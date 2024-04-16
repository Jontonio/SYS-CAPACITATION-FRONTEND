import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { map } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { BdService } from 'src/app/core/services/bd.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ModalSearchProjectComponent } from 'src/app/features/dashboard/components/modal-search-project/modal-search-project.component';
import { ResReport } from 'src/app/features/dashboard/interfaces/ResReport';
import { EventProject } from 'src/app/features/projects/class/Event';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  
  currentUser: any;
  dataPieChart:ResReport[] = [];
  dataHorizonBarChart:ResReport[] = [];
  dataVerticalBarChart:ResReport[] =[];

  constructor(private notificationService: NotificationService,
    private dialog:MatDialog,
    private _db:BdService,
    private authService: AuthenticationService,
    private titleService: Title) {
      this.getReportCountProjectsOfYears();
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.titleService.setTitle('SIRDEV - dashboard');
  }

  dialogSearch(){

    const dialogRefSearch = this.dialog.open(ModalSearchProjectComponent,{
      disableClose:false,
      panelClass:'dialog-class',
      width:'500px',
    })

    dialogRefSearch.afterClosed().subscribe((event:EventProject) => {
      if(!event) return;
      
      //get reports
      this.getReportSexParticipants(event.id_event)
      this.getReportChargesParticipants(event.id_event);

    });

  }

  getReportSexParticipants(id_event:number){
    this._db.getReportSexParticipants(id_event).subscribe({
      next:({ data }) => {
        this.dataPieChart = data;
      }
    })
  }

  getReportChargesParticipants(id_event:number){
    this._db.getReportChargesParticipants(id_event).subscribe({
      next:({ data }) => {
        this.dataHorizonBarChart = data;
      }
    })
  }

  getReportCountProjectsOfYears(){
    this._db.getReportCountProjectsOfYears().pipe(
      map( (res) => {
        res.data = res.data.map((val:ResReport) => {
          val.name = val.name.toString()
          return val
        })
        return res;
      })
    ).subscribe({
      next:({ data }) => {
        this.dataVerticalBarChart = data;
      }
    })
  }

}

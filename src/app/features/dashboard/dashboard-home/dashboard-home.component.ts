import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalSearchProjectComponent } from '../components/modal-search-project/modal-search-project.component';
import { EventProject } from '../../projects/class/Event';
import { BdService } from 'src/app/core/services/bd.service';
import { ResReport } from '../interfaces/ResReport';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
  
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

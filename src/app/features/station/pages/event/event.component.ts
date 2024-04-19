import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { DataDialog } from 'src/app/core/interface/DataDialog';
import { LoaddingService } from 'src/app/core/services/Loadding.service';
import { BdService } from 'src/app/core/services/bd.service';
import { LocalService } from 'src/app/core/services/local.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { FacilitatorEvent } from 'src/app/features/facilitators/class/FacilitatorEvent';
import { Attendance } from 'src/app/features/projects/class/Attendance';
import { EventProject } from 'src/app/features/projects/class/Event';
import { Participant } from 'src/app/features/projects/class/Participant';
import { FormParticipantComponent } from 'src/app/features/projects/components/form-participant/form-participant.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { FormFacilitatorComponent } from 'src/app/shared/facilitator/form-facilitator/form-facilitator.component';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  dataSource = new MatTableDataSource([]);
  id_event!:number;
  event!:EventProject;

  msg:string = '';

  length:number = 10;
  pageIndex:number = 0;
  pageSize:number = 10;
  startPage:number = 0;
  endPage:number = 0;

  displayedColumns: string[] = [
    'index',
    'id_card_participant',
    'participant_name',
    'participant_location',
    'participant_charge',
    'participant_email',
    'participant_phone',
    'action'
  ];

  textTest:string = 'MEJORAMIENTO DE LOS SERVICIOS DE INVESTIGACIÓN Y TRANSFERENCIA DE TECNOLOGÍA EN GANADERÍA ALTO ANDINA EN LAS REGIONES DE: APURIMAC, AREQUIPA, AYACUCHO, CUSCO, HUANCAVELICA, JUNÍN, MOQUEGUA, PASCO, PUNO, Y TACNA, 33 DISTRITOS. CUI N°2491159 (PROGAN)MEJORAMIENTO DE LOS SERVICIOS DE INVESTIGACIÓN Y TRANSFERENCIA DE TECNOLOGÍA EN GANADERÍA ALTO ANDINA EN LAS REGIONES DE: APURIMAC, AREQUIPA, AYACUCHO, CUSCO, HUANCAVELICA, JUNÍN, MOQUEGUA, PASCO, PUNO, Y TACNA, 33 DISTRITOS. CUI N°2491159 (PROGAN)'
  showAllText:boolean = false;

  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;

  constructor(private dialog:MatDialog, 
              private _db:BdService,
              public _local:LocalService,
              private _notify:NotificationService,
              public _loadding:LoaddingService,
              private activeRouter:ActivatedRoute) {
    this.id_event = this.activeRouter.snapshot.params['id_event'];
    this.getEvent(this.id_event, this._local.getStationID());
  }

  ngOnInit(): void {
    this.getParticipantsFromEvent(this.id_event, this.pageIndex);
  }

  getParticipantsFromEvent(id_event:number, pageIndex:number){
    this._loadding.setLoadding(true);
    this._db.getParticipantsFromEvent(id_event, pageIndex).subscribe({
      next:({ data }) => {
        this.dataSource = data.data;
        this.length = data.total;
        this._loadding.setLoadding(false);
        if(this.length==0){
          this.msg = 'Lista vacia de asistentes al evento'
        }
      }
    })
  }

  pageEvent(evn:PageEvent){

    this.endPage = evn.pageSize;
    this.startPage = evn.pageIndex * evn.pageSize;
    this.endPage = this.startPage + evn.pageSize;

    this.pageIndex = evn.pageIndex + 1;

    this.getParticipantsFromEvent(this.id_event, this.pageIndex);

  }

  statusEvent(status:boolean){
    this.getEvent(this.id_event, this._local.getStationID());
  }

  statusFacilitador(status:boolean){
    this.getEvent(this.id_event, this._local.getStationID());
  }

  statusEventFormParticipant(status:boolean){
    this.getParticipantsFromEvent(this.id_event, this.pageIndex);
  }

  getEvent(id_event:number, id_inia_station:number){
    this._db.getEvent(id_event, id_inia_station).subscribe({
      next:({ data }) => {
        this.event = data
        this._local.setEvent(this.event);
      }
    })
  }

  openDialogEditParticipant(participant:Participant){

    const data:DataDialog = {isUpdate:true, data: participant, id_parent: this.id_event };

    const dialogRefParticipant = this.dialog.open(FormParticipantComponent,{
      panelClass:'dialog-class',
      disableClose:true,
      data
    })

    dialogRefParticipant.afterClosed().subscribe((result:boolean) => {
      if(result){
        this.getParticipantsFromEvent(this.id_event, this.pageIndex);
      }
    });

  }

  openDialogDelete({ id_attendance, participant }:Attendance){
    const dialogRefAttendance = this.dialog.open(ConfirmDialogComponent,{
      disableClose:true,
      panelClass:'dialog-class-delete',
      data:{
        title:'Eliminar evento',
        message:`¿Esta seguro de eliminar el registro de asistencia de ${participant.participant_name}?`
      }
    });

    dialogRefAttendance.afterClosed().subscribe((result:boolean) => {
      if(result){
        this._loadding.setLoadding(true);
        this._db.deleteAttendance(id_attendance).subscribe({
          next:({ message }) => {
            this._notify.success('Eliminación de datos', message)
            this._loadding.setLoadding(false);
            this.getParticipantsFromEvent(this.id_event, this.pageIndex);
          }
        })
      }
    });
  }

  searchAttendance(term:string){
    this._db.searchTable('attendance', term, this.id_event).subscribe({
      next:({ data }) => {
        this.dataSource = data.data;
        this.length = data.total;
        this._loadding.setLoadding(false);
        if(this.length==0){
          this.msg = 'Lista vacia de asistentes al evento'
        }
      }
    })
  }

  editFacilitator(facilitatorEvent:FacilitatorEvent){

    const data:DataDialog = { isUpdate:true, data:facilitatorEvent };
    const dialogRefRegister = this.dialog.open(FormFacilitatorComponent,{
      disableClose:true,
      panelClass:'dialog-class',
      data
    });

    dialogRefRegister.afterClosed().subscribe((result:boolean) => {
      if(result){
        this.getEvent(this.id_event, this._local.getStationID());
      }
    });

  }

  deleteFacilitator({id_facilitator_event, facilitator }:FacilitatorEvent){

    const deleteRef = this.dialog.open(ConfirmDialogComponent,{
      disableClose:true,
      panelClass:'dialog-class',
      data:{
        title:'Eliminar facilitador',
        message:`¿Eliminar al facilitador ${facilitator?.facilitator_name} del evento?`
      }
    });

    deleteRef.afterClosed().subscribe((result:boolean) => {
      if(result){
        this.deleteFacilitadorEvent(id_facilitator_event!);
      }
    })
  }

  deleteFacilitadorEvent(id:number){
    this._loadding.setLoadding(true);
    this._db.deleteFacilitadorToEvent(id).subscribe({
      next:({ message }) => {
        this._notify.success('Eliminación de datos', message)
        this._loadding.setLoadding(false);
        this.getEvent(this.id_event, this._local.getStationID());
      }
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormEventComponent } from '../../components/form-event/form-event.component';
import { EventProject } from '../../class/Event';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../class/Project';
import { FormProjectComponent } from '../../components/form-project/form-project.component';
import { BdService } from 'src/app/core/services/bd.service';
import { LoaddingService } from 'src/app/core/services/Loadding.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { DataDialog } from 'src/app/core/interface/DataDialog';
import { PageEvent } from '@angular/material/paginator';
import { LocalService } from 'src/app/core/services/local.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-list-events',
  templateUrl: './list-events.component.html',
  styleUrls: ['./list-events.component.css']
})
export class ListEventsComponent {

  dataSource = new MatTableDataSource([]);
  project!:Project;
  msg:string = '';
  id_project!:number;
  
  displayedColumns: string[] = [
    'id_event',
    'event_name',
    'event_topic',
    'event_region',
    'event_provincie',
    'event_district',
    'event_datetime_start',
    'action'
  ];
  
  length:number = 0;
  pageIndex:number = 0;
  pageSize:number = 10;
  startPage:number = 0;
  endPage:number = 0;

  constructor(
    private dialog:MatDialog,
    private _bd:BdService,
    public _loadding:LoaddingService,
    public _local:LocalService,
    private _notify:NotificationService,
    private router:Router,
    private routerActive:ActivatedRoute) {
      this.id_project = this.routerActive.snapshot.parent?.params['id_project'];
      this.getProject(this.id_project);
  }

  pageEvent(evn:PageEvent){

    this.endPage = evn.pageSize;
    this.startPage = evn.pageIndex * evn.pageSize;
    this.endPage = this.startPage + evn.pageSize;

    this.pageIndex = evn.pageIndex + 1;

    this.getEventsProject(this.id_project, this.pageIndex);
  }

  getProject(id:number){
    this._loadding.setLoadding(true);
    this._bd.getProject(id)
      .pipe(
        switchMap( (res) => {
          this.project = res.data;
          return this._bd.getEventsByProject(id, this.pageIndex);
        })
      )
      .subscribe({
      next:({ data }) => {
        this.dataSource.data = data.data;
        this.dataSource.data = data.data; 
        this.length = data.total;
        data.total==0?this.msg = 'Lista de proyectos vacia':'';
        this._loadding.setLoadding(false);
      }
    })
  }

  getEventsProject(id_project:number, page:number){
    this._bd.getEventsByProject(id_project, page).subscribe({
      next:({ data }) => {
        this.dataSource.data = data.data;
        this.dataSource.data = data.data; 
        this.length = data.total;
        data.total==0?this.msg = 'Lista de eventos del projecto vacia':'';
        this._loadding.setLoadding(false);
      }
    })
  }

  editEvent(eventProject:EventProject){
    
    const data:DataDialog = { isUpdate:true, data:eventProject, id_parent:this.id_project };

    const dialogRefUpdate = this.dialog.open(FormEventComponent,{
      panelClass:'dialog-class',
      data
    })

    dialogRefUpdate.afterClosed()
                  .subscribe((result:boolean) => {
                    if(result){
                      this.getEventsProject(this.id_project, this.pageIndex)
                    }
    })

  }

  openDialogDelete({ id_event }:EventProject){

    const deleteRef = this.dialog.open(ConfirmDialogComponent,{
      disableClose:true,
      panelClass:'dialog-class',
      data:{
        title:'Eliminar evento',
        message:`¿Esta seguro de eliminar el evento con id ${id_event}?`
      }
    });

    deleteRef.afterClosed().subscribe((result:boolean) => {
      if(result){
        this.deleteEvent(id_event)
      }
    })

  }

  deleteEvent(id:number){
    this._bd.deleteEvent(id).subscribe({
      next:({ message }) => {
        this.getEventsProject(this.id_project, this.pageIndex);
        this._notify.success('Eliminación de evento', message);
      }
    })
  }

  AddEventState(state:boolean){
    if(state){
      this.getEventsProject(this.id_project, this.pageIndex);
    }
  }

  goViewEvent({id_event}:EventProject){
    this.router.navigate(['../event', id_event])
  }

  searchEvent(term:string){
    this._bd.searchTable('event', term, this.id_project).subscribe({
      next:({ data }) => {
        this.dataSource.data = data.data;
        this.dataSource.data = data.data; 
        this.length = data.total;
        data.total==0?this.msg = 'Lista de eventos del projecto vacia':'';
        this._loadding.setLoadding(false);
      }
    })
  }

}

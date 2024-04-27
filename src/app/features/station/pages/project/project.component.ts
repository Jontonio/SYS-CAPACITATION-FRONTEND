import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DataDialog } from 'src/app/core/interface/DataDialog';
import { LoaddingService } from 'src/app/core/services/Loadding.service';
import { BdService } from 'src/app/core/services/bd.service';
import { LocalService } from 'src/app/core/services/local.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Project } from 'src/app/features/projects/class/Project';
import { FormEventComponent } from 'src/app/shared/projects/form-event/form-event.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  displayedColumns: string[] = ['id_project','project_cui','project_name','action'];
  dataSource = new MatTableDataSource([]);
  year:number = new Date().getFullYear();

  msg:string = '';

  length:number = 10;
  pageIndex:number = 0;
  pageSize:number = 10;
  startPage:number = 0;
  endPage:number = 0;
  
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;

  constructor(
    private titleService: Title,
    private dialog:MatDialog,
    private _notify:NotificationService,
    private _db:BdService,
    public _local:LocalService,
    public _loadding:LoaddingService,
    private router:Router
  ) { 

    if(this._db.getLocalStorage('cachePageProject')){
      this._db.cachePageProject = this._db.getLocalStorage('cachePageProject');
      this.pageIndex = this._db.cachePageProject.currentPage;
      this.year = this._db.cachePageProject.year;
      this.startPage = this._db.cachePageProject.startPage;
    }
  }
  
  ngOnInit() {
    this.titleService.setTitle('SIRDAN - proyectos');
    this.getProjects(this._local.getStationID(), this.pageIndex, this.startPage, this.year);
  }

  pageEvent(evn:PageEvent){

    this.endPage = evn.pageSize;
    this.startPage = evn.pageIndex * evn.pageSize;
    this.endPage = this.startPage + evn.pageSize;

    this.pageIndex = evn.pageIndex + 1;
    this.getProjects(this._local.getStation().id_inia_station, this.pageIndex, this.startPage, this.year);
  }

  getProjects(id_inia_station:number, page:number, startPage:number, year:number){
    this._loadding.setLoadding(true);
    this._db.getProjectsFromIniaStation(id_inia_station, page, startPage, year).subscribe({
      next:({ data }) => {
        this.dataSource.data = data.data; 
        this.length = data.total;
        data.total==0?this.msg = 'Catálogo de proyectos sin actividades agendadas':'';
        this._loadding.setLoadding(false);
      }
    })
  }

  selectedYear({ value }:MatSelectChange){
    this.year = value;
    this.pageIndex = 0;
    this.getProjects(this._local.getStation().id_inia_station, this.pageIndex, this.startPage, this.year);
  }

  goEvents({ id_project }:Project){
    // esconde la url donde cambio
    // this.router.navigateByUrl(`projects/project-id/${Id_project}`, {skipLocationChange:true})
    this.router.navigate([`./${id_project}`])
  }

  searchProject(text:string){

    this._loadding.setLoadding(true);
    
    this._db.searchTable('project', text).subscribe({
      next:({ data }) => {
        this.dataSource.data = data.data; 
        this.length = data.total;
        data.total==0?this.msg = 'Lista de proyectos vacia':'';
        this._loadding.setLoadding(false);
      }
    })
  }

  addEvent(){

    const data:DataDialog = { isUpdate:false };

    const dialogRefRegister = this.dialog.open(FormEventComponent,{
      disableClose:true,
      panelClass:'dialog-class',
      data
    });

    dialogRefRegister.afterClosed().subscribe((result:boolean) => {
      console.log(result)
    });
  }


}

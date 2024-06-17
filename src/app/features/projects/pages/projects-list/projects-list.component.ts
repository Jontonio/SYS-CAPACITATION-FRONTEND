import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NGXLogger } from 'ngx-logger';
import { Title } from '@angular/platform-browser';
import { NotificationService } from 'src/app/core/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { FormProjectComponent } from '../../components/form-project/form-project.component';
import { Project } from '../../class/Project';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { BdService } from 'src/app/core/services/bd.service';
import { LoaddingService } from 'src/app/core/services/Loadding.service';
import { MatSelectChange } from '@angular/material/select';
import { LocalService } from 'src/app/core/services/local.service';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class CustomerListComponent implements OnInit {

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
    this.titleService.setTitle('SIRDEV - projects');
    this.getProjects(this.pageIndex, this.startPage, this.year);
  }

  pageEvent(evn:PageEvent){

    this.endPage = evn.pageSize;
    this.startPage = evn.pageIndex * evn.pageSize;
    this.endPage = this.startPage + evn.pageSize;

    this.pageIndex = evn.pageIndex + 1;

    this.getProjects(this.pageIndex, this.startPage, this.year);

  }

  getProjects(page:number, startPage:number, year:number){
    this._loadding.setLoadding(true);
    this._db.getProjects(page, startPage, year).subscribe({
      next:({ data }) => {
        this.dataSource.data = data.data; 
        this.length = data.total;
        data.total==0?this.msg = 'Lista de proyectos vacia':'';
        this._loadding.setLoadding(false);
      }
    })
  }

  selectedYear({ value }:MatSelectChange){
    this.year = value;
    this.pageIndex = 0;
    this.getProjects(this.pageIndex, this.startPage, this.year);
  }

  openDialogRegisProject() {

    const dialogRefRegister = this.dialog.open(FormProjectComponent,{
      disableClose:true,
      panelClass:'dialog-class',
    });

    dialogRefRegister.afterClosed().subscribe((result:boolean) => {
      if(result){
        this.getProjects(this.pageIndex, this.startPage, this.year);
      }
    });

  }

  edit(data:Project){

    const dialogRefUpdate = this.dialog.open(FormProjectComponent,{
      disableClose:true,
      panelClass:'dialog-class',
      data
    });

    dialogRefUpdate.afterClosed().subscribe((result:boolean) => {
      if(result){
        this.getProjects(this.pageIndex, this.startPage, this.year);
      }
    });

  }

  delete({ id_project, project_cui}:Project){

    const dialogRefDelete = this.dialog.open(ConfirmDialogComponent,{
      disableClose:true,
      panelClass:'dialog-class',
      data:{
        title:'Eliminar proyecto',
        message:`¿Esta seguro de eliminar el proyecto con CUI ${project_cui}?`
      }
    });

    dialogRefDelete.afterClosed().subscribe((result:boolean) => {
      if(result){
        this.deleteProject(id_project!);
      }
    });

    
  }
  
  deleteProject(id_project:number){
    this._db.deleteProject(id_project!).subscribe({
      next:({ message }) => {
        this.getProjects(this.pageIndex, this.startPage, this.year);
        this._notify.success('Eliminación de datos', message);
      }
    })
  }

  goEvents({id_project}:Project){
    // esconde la url donde cambio
    // this.router.navigateByUrl(`projects/project-id/${Id_project}`, {skipLocationChange:true})
    this.router.navigateByUrl(`./project/${id_project}/list-events`)
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

}

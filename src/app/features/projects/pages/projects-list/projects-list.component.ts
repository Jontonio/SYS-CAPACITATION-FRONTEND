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
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

const ELEMENT_DATA: Project[] = [
  { Id_project:1, project_cui: 1552, project_name: 'MEJORAMIENTO DE LOS SERVICIOS DE INVESTIGACIÓN Y TRANSFERENCIA DE TECNOLOGÍA EN GANADERÍA ALTO ANDINA EN LAS REGIONES DE: APURIMAC, AREQUIPA, AYACUCHO, CUSCO, HUANCAVELICA, JUNÍN, MOQUEGUA, PASCO, PUNO, Y TACNA, 33 DISTRITOS. CUI N°2491159 (PROGAN)',},
  { Id_project:2, project_cui: 2252, project_name: 'Helium', },
  { Id_project:3, project_cui: 3324, project_name: 'Proyecto de crianza y fortificación de cuyes distrito de Andahuaylas.', },
  { Id_project:4, project_cui: 4252, project_name: 'Beryllium', },
  { Id_project:5, project_cui: 5539, project_name: 'Boron',},
  { Id_project:6, project_cui: 6725, project_name: 'Carbon',},
  { Id_project:7, project_cui: 7355, project_name: 'Nitrogen',},
  { Id_project:8, project_cui: 8775, project_name: 'Oxygen',},
  { Id_project:9, project_cui: 9378, project_name: 'Fluorine',},
  { Id_project:10, project_cui: 1055, project_name: 'Neon', },
];

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class CustomerListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['Id_project','project_cui','project_name','action'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private logger: NGXLogger,
    private notificationService: NotificationService,
    private titleService: Title,
    private dialog:MatDialog,
    private router:Router
  ) { }

  ngOnInit() {
    this.titleService.setTitle('angular-material-template - projects');
    this.logger.log('projects loaded');
    this.notificationService.openSnackBar('projects loaded');
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openDialogRegisProject() {

    const dialogRefRegister = this.dialog.open(FormProjectComponent,{
      disableClose:true,
      panelClass:'dialog-class',
    });

    dialogRefRegister.afterClosed().subscribe((result:any) => {
      console.log(`Dialog result: ${result}`);
    });

  }

  edit(data:Project){

    const dialogRefUpdate = this.dialog.open(FormProjectComponent,{
      disableClose:true,
      panelClass:'dialog-class',
      data
    });

    dialogRefUpdate.afterClosed().subscribe((result:any) => {
      console.log(`Dialog result: ${result}`);
    });

  }

  delete({project_cui}:Project){

    const dialogRefDelete = this.dialog.open(ConfirmDialogComponent,{
      disableClose:true,
      panelClass:'dialog-class',
      data:{
        title:'Eliminar proyecto',
        message:`¿Esta seguro de eliminar el proyecto con CUI ${project_cui}?`
      }
    });

    dialogRefDelete.afterClosed().subscribe((result:any) => {
      console.log(`Dialog result: ${result}`);
    });

  }

  goEvents({Id_project}:Project){
    // esconde la url donde cambio
    // this.router.navigateByUrl(`projects/project-id/${Id_project}`, {skipLocationChange:true})
    this.router.navigateByUrl(`projects/project-id/${Id_project}/list-events`)
  }

}

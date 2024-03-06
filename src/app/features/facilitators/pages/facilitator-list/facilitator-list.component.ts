import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';

import { NGXLogger } from 'ngx-logger';
import { NotificationService } from 'src/app/core/services/notification.service';
import { FormFacilitatorComponent } from '../../components/form-facilitator/form-facilitator.component';
import { Facilitator } from '../../class/Facilitator';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';


const ELEMENT_DATA: Facilitator[] = [
  { 
    Id_card_facilitator:10, 
    facilitator_name:'Jose', 
    facilitator_first_name:'Rojas', 
    facilitator_last_name:'Cusi',
    facilitator_charge:'Encargado',
    facilitator_profesion:'Ing. de sistemas' 
  },
  { 
    Id_card_facilitator:20, 
    facilitator_name:'Daira', 
    facilitator_first_name:'Mendoza', 
    facilitator_last_name:'Yanqui',
    facilitator_charge:'Encargada',
    facilitator_profesion:'Ing. de sistemas' 
  },
];


@Component({
  selector: 'app-facilitator-list',
  templateUrl: './facilitator-list.component.html',
  styleUrls: ['./facilitator-list.component.css']
})
export class facilitatorListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'Id_card_facilitator',
    'facilitator_name',
    'facilitator_first_name',
    'facilitator_last_name',
    'facilitator_charge',
    'facilitator_profesion',
    'action'
  ];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private logger: NGXLogger,
    private notificationService: NotificationService,
    private titleService: Title,
    private dialog:MatDialog,
    private router:Router
  ) { }

  ngOnInit() {
    this.titleService.setTitle('angular-material-template - Users');
    this.logger.log('Users loaded');
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  addFacilitator(){
    
    const dialogRefRegister = this.dialog.open(FormFacilitatorComponent,{
      disableClose:true,
      panelClass:'dialog-class',
    });

    dialogRefRegister.afterClosed().subscribe((result:any) => {
      console.log(`Dialog result: ${result}`);
    });

  }

  edit(facilitator:Facilitator){

    const dialogRefUpdate = this.dialog.open(FormFacilitatorComponent,{
      disableClose:true,
      panelClass:'dialog-class',
      data:facilitator
    });

    dialogRefUpdate.afterClosed().subscribe((result:any) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  delete({Id_card_facilitator}:Facilitator){

    const dialogRefDelete = this.dialog.open(ConfirmDialogComponent,{
      disableClose:true,
      panelClass:'dialog-class',
      data:{
        title:'Eliminar proyecto',
        message:`¿Esta seguro de eliminar al facilitador con DNI ${Id_card_facilitator}?`
      }
    });

    dialogRefDelete.afterClosed().subscribe((result:any) => {
      console.log(`Dialog result: ${result}`);
    });

  }

}

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';

import { NGXLogger } from 'ngx-logger';
import { NotificationService } from 'src/app/core/services/notification.service';
import { FormFacilitatorComponent } from '../../components/form-facilitator/form-facilitator.component';
import { Facilitator } from '../../class/Facilitator';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { BdService } from 'src/app/core/services/bd.service';
import { LoaddingService } from 'src/app/core/services/Loadding.service';

@Component({
  selector: 'app-facilitator-list',
  templateUrl: './facilitator-list.component.html',
  styleUrls: ['./facilitator-list.component.css']
})
export class facilitatorListComponent implements OnInit {

  msg:string = '';
  displayedColumns: string[] = [
    'id_index',
    'id_card_facilitator',
    'facilitator_name',
    'facilitator_first_name',
    'facilitator_last_name',
    'facilitator_charge',
    'facilitator_profesion',
    'action'
  ];
  dataSource = new MatTableDataSource([]);

  length:number = 10;
  pageIndex:number = 0;
  pageSize:number = 10;
  startPage:number = 0;
  endPage:number = 0;

  constructor(
    public _loadding: LoaddingService,
    private _notify: NotificationService,
    private titleService: Title,
    private _db:BdService,
    private dialog:MatDialog,
    private router:Router
  ) {

    if(this._db.getLocalStorage('cachePageFacilitator')){
      this._db.cachePageFacilitator = this._db.getLocalStorage('cachePageFacilitator');
      this.pageIndex = this._db.cachePageFacilitator.currentPage;
    }

  }

  ngOnInit() {
    this.titleService.setTitle('SIRDEV - Facilitador');
    this.getFacilitators(this.pageIndex);
  }

  pageEvent(evn:PageEvent){

    this.endPage = evn.pageSize;
    this.startPage = evn.pageIndex * evn.pageSize;
    this.endPage = this.startPage + evn.pageSize;

    this.pageIndex = evn.pageIndex + 1;

    this.getFacilitators(this.pageIndex);

  }

  getFacilitators(page:number){
    this._loadding.setLoadding(true);
    this._db.getFacilitators(page).subscribe({
      next:({ data }) => {
        this.dataSource.data = data.data;
        this.length = data.total;
        this._loadding.setLoadding(false);
      }
    })
  }

  addFacilitator(){
    
    const dialogRefRegister = this.dialog.open(FormFacilitatorComponent,{
      disableClose:true,
      panelClass:'dialog-class',
    });

    dialogRefRegister.afterClosed().subscribe((result:boolean) => {
      if(result){
        this.getFacilitators(this.pageIndex);
      }
    });

  }

  edit(facilitator:Facilitator){

    const dialogRefUpdate = this.dialog.open(FormFacilitatorComponent,{
      disableClose:true,
      panelClass:'dialog-class',
      data:facilitator
    });

    dialogRefUpdate.afterClosed().subscribe((result:boolean) => {
      if(result){
        this.getFacilitators(this.pageIndex);
      }
    });
  }

  delete({id_card_facilitator}:Facilitator){

    const dialogRefDelete = this.dialog.open(ConfirmDialogComponent,{
      disableClose:true,
      panelClass:'dialog-class',
      data:{
        title:'Eliminar proyecto',
        message:`¿Esta seguro de eliminar al facilitador con DNI ${id_card_facilitator}?`
      }
    });

    dialogRefDelete.afterClosed().subscribe((result:boolean) => {
      if(result){
        this._db.deleteFacilitador(id_card_facilitator!).subscribe({
          next:({message}) => {
            this._notify.success('Elimación de facilitador', message)
            this.getFacilitators(this.pageIndex);
          }
        })
      }
    });

  }

}

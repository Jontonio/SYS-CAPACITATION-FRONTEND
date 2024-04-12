import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoaddingService } from 'src/app/core/services/Loadding.service';
import { BdService } from 'src/app/core/services/bd.service';
import { LocalService } from 'src/app/core/services/local.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ModalPermissionsComponent } from '../modal-permissions/modal-permissions.component';
import { UserDB } from 'src/app/core/interface/User';

@Component({
  selector: 'app-table-user',
  templateUrl: './table-user.component.html',
  styleUrls: ['./table-user.component.css']
})
export class TableUserComponent {

  @Input() updateListRoles:boolean = false;

  displayedColumns: string[] = ['id_project','name','email','role','permitions','action'];
  dataSource = new MatTableDataSource([]);
  year:number = new Date().getFullYear();

  msg:string = '';

  length:number = 10;
  pageIndex:number = 0;
  pageSize:number = 10;
  startPage:number = 0;
  endPage:number = 0;

  constructor(
    private dialog:MatDialog,
    private _notify:NotificationService,
    private _db:BdService,
    public _local:LocalService,
    public _loadding:LoaddingService,
    private router:Router
  ) {

    this.getUsers();

  }

  pageEvent(evn:PageEvent): void {

    this.endPage = evn.pageSize;
    this.startPage = evn.pageIndex * evn.pageSize;
    this.endPage = this.startPage + evn.pageSize;

    this.pageIndex = evn.pageIndex + 1;

    this.getUsers(this.pageIndex);

  }

  getUsers(page:number = 1): void {
    this._loadding.setLoadding(true);
    this._db.getUsers(page).subscribe({
      next:({ data }) => {
        this.dataSource.data = data.data; 
        this.length = data.total;
        data.total==0?this.msg = 'Lista de proyectos vacia':'';
        this._loadding.setLoadding(false);
      }
    })
  }

  dialogPermissions(data:UserDB): void {

    const dialogPermissionsRef = this.dialog.open(ModalPermissionsComponent,{
      panelClass:'dialog-class',
      data
    })

    dialogPermissionsRef.afterClosed().subscribe((res:Boolean) => {

      if(res){
        this.getUsers(this.pageIndex);
      }
      
    })

  }

}

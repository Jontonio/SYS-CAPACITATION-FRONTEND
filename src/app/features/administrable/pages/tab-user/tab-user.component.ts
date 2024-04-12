import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormUserComponent } from '../../components/form-user/form-user.component';

@Component({
  selector: 'app-tab-user',
  templateUrl: './tab-user.component.html',
  styleUrls: ['./tab-user.component.css']
})
export class TabUserComponent {

  constructor(private matdialog:MatDialog) { }

  newUser(): void {

    const dialogUser = this.matdialog.open(FormUserComponent,{
      disableClose:true,
      panelClass:'dialog-class',
    })

    dialogUser.afterClosed().subscribe( result => {
      console.log(result)
    })

  }

}

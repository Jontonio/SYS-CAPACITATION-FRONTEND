import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { FormChargeComponent } from '../components/form-charge/form-charge.component';
import { ListChargesComponent } from '../components/list-charges/list-charges.component';

@Component({
  selector: 'app-administrable-page',
  templateUrl: './administrable-page.component.html',
  styleUrls: ['./administrable-page.component.css']
})
export class AccountPageComponent implements OnInit {

  constructor(private titleService: Title,
              private dialog:MatDialog) { }

  ngOnInit() {
    this.titleService.setTitle('angular-material-template - Account');
  }

  openDialogAddCharge(){
    const dialogRefRegister = this.dialog.open(FormChargeComponent,{
      panelClass:'dialog-class',
      disableClose:true,
      width:'500px'
    })

    dialogRefRegister.afterClosed().subscribe((result:any) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialogCharges(){
    const dialogRefCharges = this.dialog.open(ListChargesComponent,{
      panelClass:'dialog-class-b',
      width:'700px'
    })

    dialogRefCharges.afterClosed().subscribe((result:any) => {
      console.log(`Dialog result: ${result}`);
    });
  }

}

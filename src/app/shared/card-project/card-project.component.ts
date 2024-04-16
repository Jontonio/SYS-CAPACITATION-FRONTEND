import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Project } from '../../features/projects/class/Project';
import { MatDialog } from '@angular/material/dialog';
import { BdService } from 'src/app/core/services/bd.service';
import { LoaddingService } from 'src/app/core/services/Loadding.service';
import { FormProjectComponent } from '../../features/projects/components/form-project/form-project.component';
import { FormEventComponent } from '../projects/form-event/form-event.component';
import { ActivatedRoute } from '@angular/router';
import { DataDialog } from 'src/app/core/interface/DataDialog';
import { LocalService } from 'src/app/core/services/local.service';

@Component({
  selector: 'app-card-project',
  templateUrl: './card-project.component.html',
  styleUrls: ['./card-project.component.css']
})
export class CardProjectComponent implements OnChanges {

  @Input()  project!:Project;
  @Output() AddEventState = new EventEmitter<boolean>();

  showAllText:boolean = false;
  id_project:number;

  constructor(
    private dialog:MatDialog,
    private _bd:BdService,
    public _local:LocalService,
    private activeRouter:ActivatedRoute,
    public _loadding:LoaddingService) {
      this.id_project = this.activeRouter.snapshot.parent?.params['id_project'];
  }

  ngOnChanges(): void {

    if(this.project){
      this._local.setProject(this.project);
    }
    
  }

  getOneProject(){
    this._bd.getProject(this.id_project).subscribe({
      next:({ data }) => {
        this.project = data;
      }
    })
  }

  editProject(){

    const dialogRefUpdate = this.dialog.open(FormProjectComponent,{
      disableClose:true,
      panelClass:'dialog-class',
      data:this.project
    });

    dialogRefUpdate.afterClosed().subscribe((result:boolean) => {
      if(result){
        this.getOneProject();
      }
    });

  }

  addEvent(){

    const data:DataDialog = {isUpdate:false, data:this.project, id_parent:this.id_project };

    const dialogRefRegister = this.dialog.open(FormEventComponent,{
      disableClose:true,
      panelClass:'dialog-class',
      data
    });

    dialogRefRegister.afterClosed().subscribe((result:boolean) => this.AddEventState.emit(result) );
  }

}

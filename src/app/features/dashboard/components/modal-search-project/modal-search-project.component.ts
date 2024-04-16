import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Subject, debounceTime } from 'rxjs';
import { BdService } from 'src/app/core/services/bd.service';
import { EventProject } from 'src/app/features/projects/class/Event';
import { Project } from 'src/app/features/projects/class/Project';
import { MatSelectionListChange } from '@angular/material/list';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-modal-search-project',
  templateUrl: './modal-search-project.component.html',
  styleUrls: ['./modal-search-project.component.css']
})
export class ModalSearchProjectComponent implements OnInit {

  myControl = new FormControl<string | Project>('');
  options: Project[] = [];

  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  debouncer = new Subject();
  projectEvents:EventProject[] = [];
  selectedEvent!:EventProject;
  
  constructor(private _db:BdService, public dialogRef: MatDialogRef<ModalSearchProjectComponent>) { }

  ngOnInit(): void {

    this.debouncer
        .pipe(
          debounceTime(300)
        ).subscribe({
          next:(value) => {
            this.searchProject(value as string);
          }
        })
  }

  displayFn(project: Project):string {
    return project && project.project_cui.toString() ? project.project_cui.toString() : '';
  }

  searchValue(data:string){
    this.debouncer.next( data );
  }

  onOptionSelectedProject(event: MatAutocompleteSelectedEvent): void {
    const project = event.option.value as Project;
    this.projectEvents = project.events;
  }

  optionSelectedEvent(event: MatSelectionListChange): void {
    this.selectedEvent = event.options[0].value;
    this.dialogRef.close(this.selectedEvent)
  }

  searchProject(cuuid:string){
    this._db.searchProjectsBycui(cuuid).subscribe({
      next:({ data }) => this.options = data
    })
  }


}

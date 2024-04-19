import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Subject, debounceTime } from 'rxjs';
import { BdService } from 'src/app/core/services/bd.service';
import { EventProject } from 'src/app/features/projects/class/Event';
import { Project } from 'src/app/features/projects/class/Project';
import { MatSelectionListChange } from '@angular/material/list';
import { MatDialogRef } from '@angular/material/dialog';
import { CacheProjectDash } from 'src/app/features/Interface/Cache';
import { CacheService } from 'src/app/core/services/cache.service';
import { LocalService } from 'src/app/core/services/local.service';


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
  selectedProject!:Project;

  constructor(private _db:BdService,
              private _cache:CacheService, 
              private _local:LocalService,
              public dialogRef: MatDialogRef<ModalSearchProjectComponent>) { }

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
    this.selectedProject = project;
    this.projectEvents = project.events;
  }

  optionSelectedEvent(event: MatSelectionListChange): void {

    this.selectedEvent = event.options[0].value;

    const data:CacheProjectDash = { 
      titleProject: this.selectedProject.project_name,
      cuiProject:this.selectedProject.project_cui,
      id_project:this.selectedProject.id_project,
      id_event:this.selectedEvent.id_event, 
      event_topic:this.selectedEvent.event_topic,
      location:`${this.selectedEvent.event_region} - ${this.selectedEvent.event_provincie} - ${this.selectedEvent.event_district}`
    }
    this._cache.projectDash = data;
    this.dialogRef.close(data)
  }

  searchProject(cuuid:string){
    this._db.searchProjectsBycui(cuuid, this._local.getStationID()).subscribe({
      next:({ data }) => this.options = data
    })
  }


}

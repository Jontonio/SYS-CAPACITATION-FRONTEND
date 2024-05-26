import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalService } from 'src/app/core/services/local.service';

@Component({
  selector: 'app-item-menu-palette',
  templateUrl: './item-menu-palette.component.html',
  styleUrls: ['./item-menu-palette.component.css']
})
export class ItemMenuPaletteComponent {

  typesStyles: string[] = ['forest','vivid', 'natural', 'picnic', 'fire','horizon','night','flame','ocean'];
  constructor(private _local:LocalService) { }

  selectedStyle(selected:string){
    this._local.setTypeStyle(selected);
  }
}

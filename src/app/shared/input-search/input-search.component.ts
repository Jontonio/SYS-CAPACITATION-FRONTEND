import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-input-search',
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.css']
})
export class InputSearchComponent implements OnInit {

  word!:string;
  debouncer = new Subject();
  @Output() textSearch = new EventEmitter<string>();
  @Input() placeholder:string = 'Buscar...';

  constructor() { }

  ngOnInit(): void {

    this.debouncer
        .pipe( debounceTime(300) ).subscribe({
      next:(value) => this.textSearch.emit(value as string)
    })

  }

  modelChange(letter:string){
    this.debouncer.next( letter );
  }

  clear(){
    this.word = '';
    this.debouncer.next( this.word );
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showNumber'
})
export class ShowNumberPipe implements PipeTransform {

  transform(num:number| undefined): string {

    if(!num) return '';

    if(num < 10){
      return '000'+num
    }

    if(num < 1000){
      return '00'+num
    }

    return num!.toString();
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fieldEmpty'
})
export class FieldEmptyPipe implements PipeTransform {

  transform(value: string, field:string): string {
    if(!value){
      value = `Sin ${field}`;
      return value;
    }

    return value;
  }

}

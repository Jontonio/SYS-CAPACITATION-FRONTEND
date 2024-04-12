import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl'
})
export class SafeUrlPipe implements PipeTransform {

  constructor(private sanitazer:DomSanitizer){}

  transform(url:string){
    return this.sanitazer.bypassSecurityTrustResourceUrl(url);
  }

}

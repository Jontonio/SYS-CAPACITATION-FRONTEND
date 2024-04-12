import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoaddingService {

    private loadding:boolean;

    message:string;
    
    constructor() {
        this.loadding = false;
        this.message = '';
    }

    setLoadding(loadding:boolean){
        this.loadding = loadding;
    }

    getLoadding(){
        return this.loadding;
    }

    setMessage(msg:string){
        this.message = msg;
    }

    getMessage(){
        return this.message;
    }

}

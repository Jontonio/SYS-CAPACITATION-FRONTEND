import { Injectable } from "@angular/core";
import { CacheProjectDash } from "src/app/features/Interface/Cache";


@Injectable({
    providedIn:'root',
})
export class CacheService{
    
    projectDash!:CacheProjectDash;

    constructor(){

    }

    saveSessionStorage(key:string, data:string){
        sessionStorage.setItem(key, data);
    }

    removeSessionStorage(key:string){
        sessionStorage.removeItem(key);
    }

    getSessionStorage(key:string){
        return sessionStorage.getItem(key);
    }

    saveLocalStorage(key:string, data:string){
        localStorage.setItem(key, data);
    }

    removeLocalStorage(key:string){
        localStorage.removeItem(key);
    }

    getLocalStorage(key:string){
        return localStorage.getItem(key);
    }
}
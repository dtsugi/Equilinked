import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { AppConfig } from '../app/app.config';
import { Utils } from '../app/utils';
// import { } from '../model/';

@Injectable()
export class CaballoService {
    private actionUrl: string = AppConfig.API_URL + "api/Caballo/";
    private url = "";

    constructor(private _http: Http) { }   

    getAllSerializedByPropietarioId(propietarioId: number) {
        this.url = Utils.SetUrlApiGet(this.actionUrl + "GetAllSerializedByPropietarioId/", [propietarioId]);
        console.log("URL" + this.url);
        return this._http.get(this.url)
            .map(response => response.json());
    } 
}

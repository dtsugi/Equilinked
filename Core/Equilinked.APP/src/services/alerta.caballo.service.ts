import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { AppConfig } from '../app/app.config';
import { Utils } from '../app/utils';
// import { } from '../model/';

@Injectable()
export class AlertaCaballoService {
    private actionUrl: string = AppConfig.API_URL + "api/AlertaCaballo/";
    private url = "";

    constructor(private _http: Http) { }

    getAllCaballoIdByAlertaId(alertaId: number) {
        this.url = Utils.SetUrlApiGet(this.actionUrl + "GetAllCaballoIdByAlertaId/", [alertaId]);
        console.log("URL" + this.url);
        return this._http.get(this.url)
            .map(response => response.json());
    }
}

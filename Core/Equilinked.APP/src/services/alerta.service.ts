import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { AppConfig } from '../app/app.config';
import { Utils } from '../app/utils';
import {Alerta } from '../model/alerta';

@Injectable()
export class AlertaService {
    private actionUrl: string = AppConfig.API_URL + "api/Alerta/";
    private url = "";

    constructor(private _http: Http) { }

    getById(id: number) {
        this.url = Utils.SetUrlApiGet(this.actionUrl + "GetById/", [id]);
        console.log("URL" + this.url);
        return this._http.get(this.url)
            .map(response => response.json());
    }

    getAllByPropietario(propietarioId: number, filterByFuture: boolean) {
        this.url = Utils.SetUrlApiGet(this.actionUrl + "GetAllByPropietarioId/", [propietarioId, filterByFuture]);
        console.log("URL" + this.url);
        return this._http.get(this.url)
            .map(response => response.json());
    }

    getCurrentDate(year: string, month: string, day: string, culture: string): any {
        this.url = Utils.SetUrlApiGet(this.actionUrl + "GetCurrentDate/", [year, month, day, culture]);
        console.log("URL" + this.url);
        return this._http.get(this.url)
            .map(response => response.json());
    }

    getCurrentDateString(stringDate: string, culture: string) {
        this.url = Utils.SetUrlApiGet(this.actionUrl + "GetCurrentDate/", [stringDate, culture]);
        console.log("URL" + this.url);
        return this._http.get(this.url)
            .map(response => response.json());
    }

    save(alerta: Alerta): any {
        let bodyString = JSON.stringify(alerta);
        let headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
        let options = new RequestOptions({ headers: headers });
        this.url = Utils.SetUrlApiGet(this.actionUrl + "Save", []);
        console.log("URL" + this.url);
        return this._http.post(this.url, bodyString, options)
            .map(response => response.json());
    }

    delete(id: number): any {
        let bodyString = JSON.stringify(id);
        let headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
        let options = new RequestOptions({ headers: headers });
        this.url = Utils.SetUrlApiGet(this.actionUrl + "Delete", []);
        console.log("URL" + this.url);
        // return this._http.post(this.url, bodyString, options)
        //     .map(response => response.json());
        return this._http.delete(this.url + "?alertaId=" + id)
    }
}

import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { AppConfig } from '../app/app.config';
import { Utils } from '../app/utils';
// import { } from '../model/';

@Injectable()
export class ExtendedCaballoService {
    private actionUrl: string = AppConfig.API_URL + "api/ExtendedCaballo/";
    private url = "";

    constructor(private _http: Http) { }

    getAllGeneroComboBox() {
        this.url = Utils.SetUrlApiGet(this.actionUrl + "GetAllGeneroComboBox/", []);
        console.log("URL" + this.url);
        return this._http.get(this.url)
            .map(response => response.json());
    }

    getAllPelajeComboBox() {
        this.url = Utils.SetUrlApiGet(this.actionUrl + "GetAllPelajeComboBox/", []);
        console.log("URL" + this.url);
        return this._http.get(this.url)
            .map(response => response.json());
    }
}

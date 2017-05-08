import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { AppConfig } from '../app/app.config';
import { Utils } from '../app/utils';
// import { Propietario} from '../model/propietario';

@Injectable()
export class PropietarioService {
    private actionUrl: string = AppConfig.API_URL + "api/Propietario/";
    private url = "";

    constructor(private _http: Http) { }

    getSerializedById(id: number) {
        this.url = Utils.SetUrlApiGet(this.actionUrl + "GetSerializedById/", [id]);
        console.log("URL" + this.url);
        return this._http.get(this.url)
            .map(response => response.json());
    }
}

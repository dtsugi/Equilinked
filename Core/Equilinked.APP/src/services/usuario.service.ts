import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { AppConfig } from '../app/app.config';
import { Utils } from '../app/utils';
import { UserSessionEntity} from '../model/UserSessionEntity';

// import { Observable } from 'rxjs/Observable';

@Injectable()
export class UsuarioService {
    private actionUrl: string = AppConfig.API_URL + "api/usuario/";
    private url = "";

    constructor(private _http: Http) { }

    login(session: UserSessionEntity): any {        
        let bodyString = JSON.stringify(session);
        let headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
        let options = new RequestOptions({ headers: headers });
        this.url = Utils.SetUrlApiGet(this.actionUrl + "Login", []);
        console.log("URL" + this.url);
        return this._http.post(this.url, bodyString, options)
            .map(response => response.json());
    }
}

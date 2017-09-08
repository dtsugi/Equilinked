import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import {AppConfig} from '../app/app.config';
import {Utils} from '../app/utils';
import {Alimentacion} from '../model/alimentacion';

@Injectable()
export class AlimentacionService {
  private requestTimeout: number = AppConfig.REQUEST_TIMEOUT;
  private actionUrl: string = AppConfig.API_URL + "api/Alimentacion/";
  private url = "";

  constructor(private _http: Http) {
  }

  getByCaballoId(caballoId) {
    this.url = Utils.SetUrlApiGet(this.actionUrl + "GetByCaballoId/", [caballoId]);
    console.log("URL" + this.url);
    return this._http.get(this.url)
      .timeout(this.requestTimeout)
      .map(response => response.json());
  }

  save(alimentacion: Alimentacion): any {
    let bodyString = JSON.stringify(alimentacion);
    let headers = new Headers({'Content-Type': 'application/json'}); // ... Set content type to JSON
    let options = new RequestOptions({headers: headers});
    this.url = Utils.SetUrlApiGet(this.actionUrl + "Save", []);
    console.log("URL" + this.url);
    return this._http.post(this.url, bodyString, options)
      .timeout(this.requestTimeout)
      .map(response => response.json());
  }
}

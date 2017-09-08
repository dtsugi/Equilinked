import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import {AppConfig} from '../app/app.config';
import {Utils} from '../app/utils';
import {Caballo} from '../model/caballo';

@Injectable()
export class CaballoService {
  private requestTimeout: number = AppConfig.REQUEST_TIMEOUT;
  private urlCaballos: string = AppConfig.API_URL + "api/propietarios/";
  private actionUrl: string = AppConfig.API_URL + "api/Caballo/";
  private url = "";

  constructor(private _http: Http) {
  }

  getCaballosPorEstadoAsociacionEstablo(propietarioId: number, establo: boolean): Promise<Array<any>> {
    let url: string = this.urlCaballos + propietarioId + "/caballos?establo=" + establo;
    return this._http.get(url)
      .timeout(this.requestTimeout)
      .map(response => response.json() as Array<any>).toPromise();
  }

  getAllSerializedByPropietarioId(propietarioId: number) {
    this.url = Utils.SetUrlApiGet(this.actionUrl + "GetAllSerializedByPropietarioId/", [propietarioId]);
    console.log("URL" + this.url);
    return this._http.get(this.url)
      .timeout(this.requestTimeout)
      .map(response => response.json());
  }

  getAllComboBoxByPropietarioId(propietarioId: number) {
    this.url = Utils.SetUrlApiGet(this.actionUrl + "GetAllComboBoxByPropietarioId/", [propietarioId]);
    console.log("URL" + this.url);
    return this._http.get(this.url)
      .timeout(this.requestTimeout)
      .map(response => response.json());
  }

  save(caballo: Caballo): any {
    let bodyString = JSON.stringify(caballo);
    let headers = new Headers({'Content-Type': 'application/json'}); // ... Set content type to JSON
    let options = new RequestOptions({headers: headers});
    this.url = Utils.SetUrlApiGet(this.actionUrl + "Save", []);
    console.log("URL" + this.url);
    return this._http.post(this.url, bodyString, options)
      .timeout(this.requestTimeout)
      .map(response => response.json());
  }

  delete(id: number): any {
    let bodyString = JSON.stringify(id);
    let headers = new Headers({'Content-Type': 'application/json'}); // ... Set content type to JSON
    let options = new RequestOptions({headers: headers});
    this.url = Utils.SetUrlApiGet(this.actionUrl + "Delete", []);
    console.log("URL" + this.url);
    return this._http.delete(this.url + "?caballoId=" + id)
      .timeout(this.requestTimeout);
  }

  getSerializedById(caballoId: number) {
    this.url = Utils.SetUrlApiGet(this.actionUrl + "GetSerializedById/", [caballoId]);
    console.log("URL" + this.url);
    return this._http.get(this.url)
      .timeout(this.requestTimeout)
      .map(response => response.json());
  }
}

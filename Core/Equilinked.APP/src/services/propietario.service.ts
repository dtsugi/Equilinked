import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import {AppConfig} from '../app/app.config';
import {Utils} from '../app/utils';

@Injectable()
export class PropietarioService {
  private requestTimeout: number = AppConfig.REQUEST_TIMEOUT;
  private actionUrl: string = AppConfig.API_URL + "api/propietarios/";
  private url = "";

  constructor(private _http: Http) {
  }

  savePropietario(propietario: any): Promise<any> {
    let url = this.actionUrl;
    return this._http.post(url, propietario)
      .timeout(this.requestTimeout)
      .map(response => response.json())
      .toPromise();
  }

  getSerializedById(id: number) {
    this.url = Utils.SetUrlApiGet(this.actionUrl + "GetSerializedById/", [id]);
    console.log("URL" + this.url);
    return this._http.get(this.url)
      .timeout(this.requestTimeout)
      .map(response => response.json());
  }

  updatePropietario(propietario: any): Promise<any> {
    let url: string = this.actionUrl + propietario.ID;
    return this._http.put(url, propietario)
      .timeout(this.requestTimeout)
      .map(res => res.json())
      .toPromise();
  }
}

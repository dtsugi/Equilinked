import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {AppConfig} from '../app/app.config';
import {Utils} from '../app/utils';

@Injectable()
export class PropietarioService {
  private actionUrl: string = AppConfig.API_URL + "api/Propietario/";
  private url = "";

  constructor(private _http: Http) {
  }

  getSerializedById(id: number) {
    this.url = Utils.SetUrlApiGet(this.actionUrl + "GetSerializedById/", [id]);
    console.log("URL" + this.url);
    return this._http.get(this.url)
      .map(response => response.json());
  }

  updatePropietario(propietario: any): Promise<any> {
    let url: string = this.actionUrl + propietario.ID;
    return this._http.put(url, propietario)
      .map(res => res.json())
      .toPromise();
  }
}

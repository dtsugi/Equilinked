import {Injectable} from '@angular/core';
import {Http, RequestOptions, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import {AppConfig} from '../app/app.config';
import {Utils} from '../app/utils';

@Injectable()
export class AlertaCaballoService {
  private requestTimeout: number = AppConfig.REQUEST_TIMEOUT;
  private alertaUrl: string = AppConfig.API_URL + "api/propietarios/";
  private actionUrl: string = AppConfig.API_URL + "api/AlertaCaballo/";
  private url = "";

  constructor(private _http: Http) {
  }

  deleteAlertasCaballosByIds(propietarioId: number, caballoId: number, alertasIds: number[]): Promise<any> {
    let url: string = this.alertaUrl + propietarioId + "/caballos/" + caballoId + "/alertas";
    let params = new URLSearchParams();
    alertasIds.forEach(id => {
      params.append("alertasIds", id.toString());
    });
    return this._http
      .delete(url, new RequestOptions({search: params}))
      .timeout(this.requestTimeout)
      .toPromise();
  }

  getAlertasByCaballoId(propietarioId: number, caballoId: number, inicio: string, fin: string, tipos: Array<number>, cantidad: number, orden: number, todosTipos?: boolean): Promise<Array<any>> {
    let url: string = this.alertaUrl + "/" + propietarioId + "/caballos/" + caballoId + "/alertas";
    let params = new URLSearchParams();
    if (inicio != null) {
      params.set("inicio", inicio);
    }
    if (fin != null) {
      params.set("fin", fin);
    }
    if (todosTipos != null) {
      params.set("todosTipos", todosTipos ? 'true' : 'false');
    }
    if (tipos != null) {
      tipos.forEach(tipo => {
        params.append("tipos", tipo.toString());
      });
    }
    if (cantidad != null) {
      params.set("cantidad", cantidad.toString());
    }
    if (orden != null) {
      params.set("orden", orden.toString());
    }
    return this._http.get(url, new RequestOptions({search: params}))
      .timeout(this.requestTimeout)
      .map(alertas => alertas.json() as Array<any>).toPromise();
  }

  getAllCaballoIdByAlertaId(alertaId: number) {
    this.url = Utils.SetUrlApiGet(this.actionUrl + "GetAllCaballoIdByAlertaId/", [alertaId]);
    console.log("URL" + this.url);
    return this._http.get(this.url)
      .timeout(this.requestTimeout)
      .map(response => response.json());
  }
}

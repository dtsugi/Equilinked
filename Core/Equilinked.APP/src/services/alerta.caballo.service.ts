import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { AppConfig } from '../app/app.config';
import { Utils } from '../app/utils';
// import { } from '../model/';

@Injectable()
export class AlertaCaballoService {

    private alertaUrl: string = AppConfig.API_URL + "api/propietarios/";
    private actionUrl: string = AppConfig.API_URL + "api/AlertaCaballo/";
    private url = "";

    constructor(private _http: Http) { }

    deleteAlertasCaballosByIds(propietarioId: number, caballoId: number, alertasIds: number[]): Promise<any> {
        let url: string = this.alertaUrl + propietarioId + "/caballos/" + caballoId + "/alertas";
        let params = new URLSearchParams();
        alertasIds.forEach(id => {
            params.append("alertasIds", id.toString());
        });
        return this._http.delete(url, new RequestOptions({ search: params }))
            .toPromise();
    }

    getAlertasByCaballoId(propietarioId: number, caballoId: number, fecha: string, tipoAlerta: number, filtroAlerta: number, limite: number, orden: number): Promise<Array<any>> {
        let url: string = this.alertaUrl + "/" + propietarioId + "/caballos/" + caballoId + "/alertas";

        let params = new URLSearchParams();
        params.set("fecha", fecha);
        if (limite != null) {
            params.set("limite", limite.toString());
        }
        if (orden != null) {
            params.set("orden", orden.toString());
        }
        if (tipoAlerta != null) {
            params.set("tipoAlerta", tipoAlerta.toString());
        }
        if (filtroAlerta != null) {
            params.set("filtroAlerta", filtroAlerta.toString());
        }
        return this._http.get(url, new RequestOptions({ search: params }))
            .map(alertas => alertas.json() as Array<any>).toPromise();
    }

    getAllCaballoIdByAlertaId(alertaId: number) {
        this.url = Utils.SetUrlApiGet(this.actionUrl + "GetAllCaballoIdByAlertaId/", [alertaId]);
        console.log("URL" + this.url);
        return this._http.get(this.url)
            .map(response => response.json());
    }
}

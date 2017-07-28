import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { AppConfig } from '../app/app.config';
import { Utils } from '../app/utils';
import { Alerta } from '../model/alerta';

@Injectable()
export class AlertaService {
    private actionUrl: string = AppConfig.API_URL + "api/Alerta/";
    private alertaUrl: string = AppConfig.API_URL + "api/propietarios/";
    private url = "";

    constructor(private _http: Http) { }

    deleteAlertasByIds(propietarioId: number, alertasIds: number[]): Promise<any> {
        let url: string = this.alertaUrl + propietarioId + "/alertas";
        let params = new URLSearchParams();
        alertasIds.forEach(id => {
            params.append("alertasIds", id.toString());
        });
        return this._http.delete(url, new RequestOptions({ search: params }))
            .toPromise();
    }

    saveAlerta(propietarioId: number, alerta: Alerta): Promise<any> {
        let url: string = this.alertaUrl + propietarioId + "/alertas"
        return this._http.post(url, alerta)
            .toPromise();
    }

    updateAlerta(propietarioId: number, alerta: Alerta): Promise<any> {
        let url: string = this.alertaUrl + propietarioId + "/alertas/" + alerta.ID;
        return this._http.put(url, alerta)
            .toPromise();
    }

    getAlertaById(propietarioId: number, alertaId: number): Promise<any> {
        let url: string = this.alertaUrl + propietarioId + "/alertas/" + alertaId;
        return this._http.get(url).map(alerta => alerta.json()).toPromise();
    }

    getAlertasByPropietario(propietarioId: number, fecha: string, tipoAlerta: number, filtroAlerta: number, limite: number, orden: number): Promise<Array<any>> {
        let url: string = this.alertaUrl + propietarioId + "/alertas";

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
            .map(alertas => alertas.json())
            .toPromise();
    }

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

    getAllTiposAlerta() {
        this.url = Utils.SetUrlApiGet(this.actionUrl + "GetAllTiposAlerta/", []);
        console.log("URL" + this.url);
        return this._http.get(this.url)
            .map(response => response.json());
    }

    getAllByCaballoId(caballoId: number, tipoAlertasEnum: number) {
        this.url = Utils.SetUrlApiGet(this.actionUrl + "GetAllByCaballoId/", [caballoId, tipoAlertasEnum]);
        console.log("URL" + this.url);
        return this._http.get(this.url)
            .map(response => response.json());
    }

    getAllSerializedByCaballoId(caballoId: number, filterAlertaEnum: number, tipoAlertasEnum: number) {
        this.url = Utils.SetUrlApiGet(this.actionUrl + "GetAllSerializedByCaballoId/", [caballoId, filterAlertaEnum, tipoAlertasEnum]);
        console.log("URL" + this.url);
        return this._http.get(this.url)
            .map(response => response.json());
    }
}

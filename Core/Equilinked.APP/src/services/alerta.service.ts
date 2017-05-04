// import { Injectable } from '@angular/core';
// import { Http, Headers, RequestOptions } from '@angular/http';
// import 'rxjs/add/operator/map';
// import { Observable } from 'rxjs/Rx';
// import { AppConfig } from '../app/app.config';
// import { Utils } from '../app/utils';
// // import { } from '../model/';

// @Injectable()
// export class AlertasService {
//     private actionUrl: string = AppConfig.API_URL + "api/Alerta/";
//     private url = "";

//     constructor(private _http: Http) { }

//     getAllByIdCaballoTipoAlerta(idCaballo: number, tipoAlerta: number): any {
//         console.log(this.actionUrlAlerta + "/" + idCaballo + "/" + tipoAlerta);
//         return this._http.get(this.actionUrlAlerta + "/" + idCaballo + "/" + tipoAlerta)
//             .map(response => response.json());
//     }

//     getAllByIdPropetario(idPropietario, date: string, filterByFuture: boolean): any {
//         let url = this.actionUrlAlerta + "/" + idPropietario + "?date=" + date + "&filterByFuture=" + filterByFuture;
//         console.log("URL" + url);
//         return this._http.get(url)
//             .map(response => response.json());
//     }

//     getById(idNota: string): any {
//         return this._http.get(this.actionUrlAlerta + "/" + idNota)
//             .map(response => response.json());
//     }

//     getTipoAlerta() {
//         let url = this.actionUrlAlerta + "/GetTipoAlerta";
//         console.log("URL" + url);
//         return this._http.get(url)
//             .map(response => response.json());
//     }

//     // getCurrentDate(isTomorrow: boolean, culture: string): any {
//     //     let url = this.actionUrlAlerta + "/GetCurrentDate?isTomorrow=" + isTomorrow;
//     //     console.log("URL" + url);
//     //     return this._http.get(url)
//     //         .map(response => response.json());
//     // }

//     getCurrentDate(year: string, month: string, day: string, culture: string): any {
//         let url = this.actionUrlAlerta + "/GetCurrentDate?year=" + year + "&month=" + month + "&day=" + day;
//         console.log("URL" + url);
//         return this._http.get(url)
//             .map(response => response.json());
//     }

//     getCurrentDateString(date: string, culture: string): any {
//         let url = this.actionUrlAlerta + "/GetCurrentDate?stringDate=" + date;
//         console.log("URL" + url);
//         return this._http.get(url)
//             .map(response => response.json());
//     }

//     deleteByIds(listIdNota: Array<number>) {
//         let headers = new Headers({ 'Content-Type': 'application/json' });
//         let options = new RequestOptions({ headers: headers });

//         let uri = "?";
//         for (var i = 0; i < listIdNota.length; i++) {
//             uri = uri + "idList[" + i + "]=" + listIdNota[i] + "&";
//         }

//         return this._http.delete(this.actionUrlAlerta + "/DeleteAlertasByIds" + uri.slice(0, -1), options);
//     }

//     deleteById(id: number) {
//         return this._http.delete(this.actionUrlAlerta + "/" + id)
//             .map(response => response.json());
//     }

//     postNota(nota: Object): Observable<any> {
//         let headers = new Headers({ 'Content-Type': 'application/json' });
//         let options = new RequestOptions({ headers: headers });
//         let bodyString = JSON.stringify(nota);

//         return this._http.post(this.actionUrlAlerta, bodyString, options)
//             .map(res => res.json());
//     }

//     putNota(nota: Object, idNota: number): Observable<any> {
//         let headers = new Headers({ 'Content-Type': 'application/json' });
//         let options = new RequestOptions({ headers: headers });
//         let bodyString = JSON.stringify(nota);
        
//         return this._http.post(this.actionUrlAlerta + "/" + idNota, bodyString, options);
//     }
// }
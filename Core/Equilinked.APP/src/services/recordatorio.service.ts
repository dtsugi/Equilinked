import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/map";
import 'rxjs/add/operator/timeout';
import "rxjs/add/operator/toPromise";
import {AppConfig} from "../app/app.config";

@Injectable()
export class RecordatorioService {
  private requestTimeout: number = AppConfig.REQUEST_TIMEOUT;
  private urlRecordatorio: string = AppConfig.API_URL + "api/recordatorios/";
  private urlUnidadesTiempo: string = AppConfig.API_URL + "api/unidadestiempo/";

  constructor(private http: Http) {
  }

  getAllRecordatorios(): Promise<Array<any>> {
    return this.http.get(this.urlRecordatorio)
      .timeout(this.requestTimeout)
      .map(recordatorios => recordatorios.json() as Array<any>)
      .toPromise();
  }

  getAllUnidadesTiempo(): Promise<Array<any>> {
    return this.http.get(this.urlUnidadesTiempo)
      .timeout(this.requestTimeout)
      .map(unidades => unidades.json() as Array<any>)
      .toPromise();
  }
}

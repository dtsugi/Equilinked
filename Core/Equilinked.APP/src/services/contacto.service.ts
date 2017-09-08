import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/map";
import 'rxjs/add/operator/timeout';
import "rxjs/add/operator/toPromise";
import {AppConfig} from "../app/app.config";

@Injectable()
export class ContactoService {
  private requestTimeout: number = AppConfig.REQUEST_TIMEOUT;
  private urlMotivoContacto: string = AppConfig.API_URL + "api/MotivoContacto";
  private urlMensajeContacto: string = AppConfig.API_URL + "api/MensajeContacto";

  constructor(private http: Http) {
  }

  getAllMotivoContacto(): Promise<any> {
    return this.http
      .get(this.urlMotivoContacto)
      .timeout(this.requestTimeout)
      .map(motivos => motivos.json())
      .toPromise();
  }

  saveMensajeContacto(reporte: any): Promise<any> {
    return this.http.post(this.urlMensajeContacto, reporte)
      .timeout(this.requestTimeout)
      .toPromise();
  }
}

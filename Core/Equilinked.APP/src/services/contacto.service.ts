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

  saveMensajeContacto(reporte: any, file0: any, file1: any): Promise<any> {
    let formData: FormData = new FormData();
    //MotivoContacto_ID
    //Mensaje
    //Propietario_ID
    formData.append("MotivoContacto_ID", reporte.MotivoContacto_ID);
    formData.append("Mensaje", reporte.Mensaje);
    formData.append("Propietario_ID", reporte.Propietario_ID);
    if(file0) {
      formData.append("file0", file0.blob, file0.name);
    }
    if(file1){
      formData.append("file1", file1.blob, file1.name);
    }
    return this.http.post(this.urlMensajeContacto, formData)
      .timeout(this.requestTimeout)
      .toPromise();
  }
}

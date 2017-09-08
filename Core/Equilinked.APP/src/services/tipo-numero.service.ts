import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/map";
import 'rxjs/add/operator/timeout';
import "rxjs/add/operator/toPromise";
import {AppConfig} from "../app/app.config";

@Injectable()
export class TipoNumeroService {
  private requestTimeout: number = AppConfig.REQUEST_TIMEOUT;
  private urlEstablos: string = AppConfig.API_URL + "api/TipoNumero";

  constructor(private http: Http) {
  }

  getAll(): Promise<any[]> {
    let url = this.urlEstablos + "/GetAll";
    return this.http
      .get(url)
      .timeout(this.requestTimeout)
      .map(tipos => tipos.json() as any[])
      .toPromise();
  }
}

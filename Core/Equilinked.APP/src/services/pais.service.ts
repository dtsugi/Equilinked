import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import { AppConfig } from "../app/app.config";

@Injectable()
export class PaisService {

    private urlPais: string = AppConfig.API_URL + "api/paises";

    constructor(private http: Http) {
    }

    getAllPaises(): Promise<any> {
        return this.http.get(this.urlPais).map(paises => paises.json()).toPromise();
    }

    getAllEstadoProvinciaByPaisId(paisId: number): Promise<any> {
        let url = this.urlPais + "/" + paisId + "/estados";
        return this.http
            .get(url)
            .map(estados => estados.json())
            .toPromise();
    }
}
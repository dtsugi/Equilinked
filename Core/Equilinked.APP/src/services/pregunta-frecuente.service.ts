import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import { AppConfig } from "../app/app.config";

@Injectable()
export class PreguntaFrecuenteService {

    private urlPreguntasFrecuentes: string = AppConfig.API_URL + "api/PreguntasFrecuentes";

    constructor(private http: Http) {
    }

    getAll(): Promise<any[]> {
        return this.http
            .get(this.urlPreguntasFrecuentes)
            .map(tipos => tipos.json() as any[])
            .toPromise();
    }
}
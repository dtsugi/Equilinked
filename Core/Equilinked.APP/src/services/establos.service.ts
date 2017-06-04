import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import { AppConfig } from "../app/app.config";
import { Observable } from 'rxjs/Rx';

@Injectable()
export class EstablosService {

    private urlEstablos: string = AppConfig.API_URL + "api/establo";

    constructor(private http: Http) {
    }

    getEstablosByPropietarioId(propietarioId: number): Promise<any[]> {
        let url = this.urlEstablos + "/GetAllByPropietarioId/" + propietarioId;
        return this.http
            .get(url)
            .map(establos => establos.json() as any[])
            .toPromise();
    }

    filterEstablosByNombreOrDireccion(value: string, establos: any[]): any[] {
        if (value && value !== "") {
            return establos.filter(e => {
                return (e.Nombre.toUpperCase().indexOf(value.toUpperCase()) > -1)
                    || (e.Direccion.toUpperCase().indexOf(value.toUpperCase()) > -1)
            });
        }
        return establos;
    }

    filterCaballosByNombre(value: string, caballos: any[]): any[] {
        if (value && value !== "") {
            return caballos.filter(ec => {
                return ec.caballo.Nombre.toUpperCase().indexOf(value.toUpperCase()) > -1;
            });
        }
        return caballos;
    }

    saveEstablo(establo: any): Promise<any> {
        return this.http.post(this.urlEstablos, establo).toPromise();
    }
}
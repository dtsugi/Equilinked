import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
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

    getEstabloById(establoId: number): Promise<any> {
        let url = this.urlEstablos + "/GetById/" + establoId;
        return this.http
            .get(url)
            .map(establo => establo.json())
            .toPromise();
    }

    getAllEstabloCaballoByEstabloId(establoId: number): Promise<any> {
        let url = this.urlEstablos + "/GetAllEstabloCaballoByEstabloId/" + establoId;
        return this.http
            .get(url)
            .map(establoCaballos => establoCaballos.json() as any[])
            .toPromise();
    }

    filterEstablosByNombreOrDireccion(value: string, establos: any[]): any[] {
        if (value && value !== "") {
            return establos.filter(e => {
                return (e.establo.Nombre.toUpperCase().indexOf(value.toUpperCase()) > -1)
                    || (e.establo.Direccion.toUpperCase().indexOf(value.toUpperCase()) > -1)
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

    filterEstabloCaballosByNombre(value: string, establoCaballos: any[]): any[] {
        if (value && value !== "") {
            return establoCaballos.filter(ec => {
                return ec.Caballo.Nombre.toUpperCase().indexOf(value.toUpperCase()) > -1;
            });
        }
        return establoCaballos;
    }

    filterEstabloCaballosForEdition(value: string, establoCaballos: any[]): any[] {
        if (value && value !== "") {
            return establoCaballos.filter(ec => {
                return ec.caballo.Nombre.toUpperCase().indexOf(value.toUpperCase()) > -1;
            });
        }
        return establoCaballos;
    }

    saveEstablo(establo: any): Promise<any> {
        return this.http.post(this.urlEstablos, establo).toPromise();
    }

    updateEstablo(establo: any): Promise<any> {
        let url = this.urlEstablos + "/" + establo.ID;
        return this.http.put(url, establo).toPromise();
    }

    deleteEstablosByIds(ids: number[]): Promise<any> {
        console.info("Para eliminar: %o", ids);
        let url = this.urlEstablos + "/DeleteByIds";
        let params = new URLSearchParams();
        ids.forEach(id => {
            params.append("EstablosIds", id.toString());
        });
        return this.http.delete(url, new RequestOptions({ search: params }))
            .toPromise();
    }
}
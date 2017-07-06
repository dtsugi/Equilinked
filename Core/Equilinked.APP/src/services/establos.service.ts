import { Injectable } from "@angular/core";
import { Http, RequestOptions, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import { AppConfig } from "../app/app.config";

@Injectable()
export class EstablosService {

    private urlPropietarios: string = AppConfig.API_URL + "api/propietarios";
    private urlEstablos: string = AppConfig.API_URL + "api/establos";

    constructor(private http: Http) {
    }

    getEstablosByPropietarioId(propietarioId: number): Promise<any[]> {
        let url = this.urlPropietarios + "/" + propietarioId + "/establos";
        return this.http
            .get(url)
            .map(establos => establos.json() as any[])
            .toPromise();
    }

    getEstabloById(establoId: number): Promise<any> {
        let url = this.urlEstablos + "/" + establoId;
        return this.http
            .get(url)
            .map(establo => establo.json())
            .toPromise();
    }

    getCaballosByEstablo(establoId: number, filtro: number): Promise<any> {
        let url = this.urlEstablos + "/" + establoId + "/caballos";
        let params = new URLSearchParams();
        params.set("filtro", filtro.toString());
        return this.http.get(url, new RequestOptions({ search: params }))
            .map(caballos => caballos.json() as Array<any>)
            .toPromise();
    }

    getCaballosSinEstabloByPropietario(propietarioId): Promise<any> {
        let url: string = this.urlPropietarios + "/" + propietarioId + "/caballos";
        let params = new URLSearchParams();
        params.set("establo", "false");
        return this.http.get(url, new RequestOptions({ search: params }))
            .map(caballos => caballos.json() as Array<any>)
            .toPromise();
    }

    saveEstablo(establo: any): Promise<any> {
        return this.http.post(this.urlEstablos, establo).toPromise();
    }

    updateEstablo(establo: any): Promise<any> {
        let url = this.urlEstablos + "/" + establo.ID;
        return this.http.put(url, establo).toPromise();
    }

    deleteEstablo(id: number): Promise<any> {
        let url: string = this.urlEstablos + "/" + id;
        return this.http.delete(url).toPromise();
    }

    deleteEstablosByIds(ids: number[]): Promise<any> {
        let params = new URLSearchParams();
        ids.forEach(id => {
            params.append("establosIds", id.toString());
        });
        return this.http.delete(this.urlEstablos, new RequestOptions({ search: params }))
            .toPromise();
    }

    /* Verificar cuales se quedan y cuales se van! */
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
                return ec.Nombre.toUpperCase().indexOf(value.toUpperCase()) > -1;
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
}
import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Rx';
import { AppConfig } from '../app/app.config';

@Injectable()
export class GruposCaballosService {

    private endPointGruposCaballos: string = AppConfig.API_URL + "api/grupo";

    constructor(private http: Http) {
    }

    getGruposCaballosByPropietarioId(idPropietario: number): Promise<any[]> {
        let url = this.endPointGruposCaballos + "/GetAllByPropietarioId/" + idPropietario;
        return this.http.get(url)
            .map(grupos => grupos.json() as any[])
            .toPromise();
    }

    getCaballosByPropietarioId(idPropietario: number): Promise<any[]> {
        let url = this.endPointGruposCaballos + "/GetAllCaballosByPropietarioId/" + idPropietario;
        return this.http.get(url)
            .map(caballos => caballos.json() as any[])
            .toPromise();
    }

    saveGrupo(grupo: any): Promise<any> {
        return this.http.post(this.endPointGruposCaballos, grupo)
            .toPromise();
    }

    filterGrupoCaballo(value: string, caballos: any[]): any[] {
        if (value != null && value.trim() === "") {
            return caballos;
        } else {
            return caballos.filter((c) => {
                return c.Descripcion.toUpperCase().indexOf(value.toUpperCase()) > -1;
            });
        }
    }

    filterCaballo(value: string, caballos: any[]): any[] {
        if (value && value.trim() == "")
            return caballos;
        else {
            return caballos.filter((c) => {
                return ((c.caballo.Nombre.toUpperCase().indexOf(value.toUpperCase()) > -1)
                    || (c.caballo.Grupo != null && c.caballo.Grupo.Descripcion.toUpperCase().indexOf(value.toUpperCase()) > -1));
            })
        }
    }
}
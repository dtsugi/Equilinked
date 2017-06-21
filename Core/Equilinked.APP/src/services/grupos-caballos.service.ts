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

    deleteGrupoById(grupoId: number): Promise<any> {
        let url: string = this.endPointGruposCaballos + "/" + grupoId;
        return this.http.delete(url)
            .map(res => res.json())
            .toPromise();
    }

    getGrupoById(grupoId: number): Promise<any> {
        let url: string = this.endPointGruposCaballos + "/" + grupoId;
        return this.http.get(url)
            .map(grupo => grupo.json())
            .toPromise();
    }

    getCaballosByGroupId(groupId: number): Promise<any[]> {
        let url = this.endPointGruposCaballos + "/GetAllGrupoCaballoByGrupoId/" + groupId;
        return this.http.get(url)
            .map(caballos => caballos.json() as any[])
            .toPromise();
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

    updateGrupo(grupo: any): Promise<any> {
        let url = this.endPointGruposCaballos + "/" + grupo.ID;
        return this.http.put(url, grupo)
            .toPromise();
    }

    filterGruposCaballos(value: string, gruposCaballos: any[]): any[] {
        return value && value.trim() !== "" ? gruposCaballos.filter(gc => gc.Caballo.Nombre.toUpperCase().indexOf(value.toUpperCase()) > -1) : gruposCaballos;
    }

    filterGrupoCaballo(value: string, caballos: any[]): any[] {
        return value && value.trim() !== "" ? caballos.filter(c => c.Descripcion.toUpperCase().indexOf(value.toUpperCase()) > -1) : caballos;
    }

    filterCaballo(value: string, caballos: any[]): any[] {
        if (value && value !== "") {
            return caballos.filter((c) => {
                return ((c.caballo.Nombre.toUpperCase().indexOf(value.toUpperCase()) > -1)
                    || (c.caballo.Grupo != null && c.caballo.Grupo.Descripcion.toUpperCase().indexOf(value.toUpperCase()) > -1));
            });
        }
        return caballos;
    }
}
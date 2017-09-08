import {Injectable} from "@angular/core";
import {Http, RequestOptions, URLSearchParams} from "@angular/http";
import "rxjs/add/operator/map";
import 'rxjs/add/operator/timeout';
import "rxjs/add/operator/toPromise";
import {AppConfig} from "../app/app.config";

@Injectable()
export class GruposCaballosService {

  private requestTimeout: number = AppConfig.REQUEST_TIMEOUT;
  private endPointGruposCaballos: string = AppConfig.API_URL + "api/grupo";
  private urlGrupos: string = AppConfig.API_URL + "api/propietarios/";

  constructor(private http: Http) {
  }

  getCaballosByGrupoAndStatusEstablo(propietarioId: number, grupoId: number, tieneEstablo: boolean): Promise<Array<any>> {
    let url: string = this.urlGrupos + propietarioId + "/grupos/" + grupoId + "/caballos";
    let params = new URLSearchParams();
    params.set("tieneEstablo", tieneEstablo ? "true" : "false");
    return this.http.get(url, new RequestOptions({search: params}))
      .timeout(this.requestTimeout)
      .map(caballos => caballos.json() as Array<any>)
      .toPromise();
  }

  getCaballosByGruposIds(propietarioId: number, gruposIds: number[]): Promise<any> {
    let url: string = this.urlGrupos + propietarioId + "/grupos/caballos";
    let params = new URLSearchParams();
    gruposIds.forEach(id => {
      params.append("gruposIds", id.toString());
    });
    return this.http.get(url, new RequestOptions({search: params}))
      .timeout(this.requestTimeout)
      .map(caballos => caballos.json() as Array<any>)
      .toPromise();
  }

  getAllGruposByPropietarioId(propietarioId: number): Promise<any> {
    let url: string = this.urlGrupos + propietarioId + "/grupos";
    return this.http.get(url)
      .timeout(this.requestTimeout)
      .map(grupos => grupos.json())
      .toPromise();
  }

  deleteAlertasByIds(grupoId: number, ids: number[]): Promise<any> {
    let url: string = this.endPointGruposCaballos + "/" + grupoId + "/caballos";
    let params = new URLSearchParams();
    ids.forEach(id => {
      params.append("caballosIds", id.toString());
    });
    return this.http.delete(url, new RequestOptions({search: params}))
      .timeout(this.requestTimeout)
      .toPromise();
  }

  deleteGrupoById(grupoId: number): Promise<any> {
    let url: string = this.endPointGruposCaballos + "/" + grupoId;
    return this.http.delete(url)
      .timeout(this.requestTimeout)
      .map(res => res.json())
      .toPromise();
  }

  getGrupoById(grupoId: number): Promise<any> {
    let url: string = this.endPointGruposCaballos + "/" + grupoId;
    return this.http.get(url)
      .timeout(this.requestTimeout)
      .map(grupo => grupo.json())
      .toPromise();
  }

  getCaballosByGroupId(groupId: number): Promise<any[]> {
    let url = this.endPointGruposCaballos + "/GetAllGrupoCaballoByGrupoId/" + groupId;
    return this.http.get(url)
      .timeout(this.requestTimeout)
      .map(caballos => caballos.json() as any[])
      .toPromise();
  }

  getGruposCaballosByPropietarioId(idPropietario: number): Promise<any[]> {
    let url = this.endPointGruposCaballos + "/GetAllByPropietarioId/" + idPropietario;
    return this.http.get(url)
      .timeout(this.requestTimeout)
      .map(grupos => grupos.json() as any[])
      .toPromise();
  }

  getCaballosByPropietarioId(idPropietario: number): Promise<any[]> {
    let url = this.endPointGruposCaballos + "/GetAllCaballosByPropietarioId/" + idPropietario;
    return this.http.get(url)
      .timeout(this.requestTimeout)
      .map(caballos => caballos.json() as any[])
      .toPromise();
  }

  saveGrupo(grupo: any): Promise<any> {
    return this.http.post(this.endPointGruposCaballos, grupo)
      .timeout(this.requestTimeout)
      .toPromise();
  }

  updateGrupo(grupo: any): Promise<any> {
    let url = this.endPointGruposCaballos + "/" + grupo.ID;
    return this.http.put(url, grupo)
      .timeout(this.requestTimeout)
      .toPromise();
  }

  filterGruposByName(value: string, caballos: any[]): any[] {
    return value && value.trim() !== "" ? caballos.filter(c => c.Descripcion.toUpperCase().indexOf(value.toUpperCase()) > -1) : caballos;
  }

  filterCaballosByNombreOrGrupo(value: string, caballos: any[]): any[] {
    if (value && value !== "") {
      return caballos.filter(c => {
        return ((c.caballo.Nombre.toUpperCase().indexOf(value.toUpperCase()) > -1)
          || (c.caballo.Grupo != null && c.caballo.Descripcion.toUpperCase().indexOf(value.toUpperCase()) > -1));
      });
    }
    return caballos;
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

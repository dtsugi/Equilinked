import {Injectable} from "@angular/core";
import {Http, RequestOptions, URLSearchParams} from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import {AppConfig} from "../app/app.config";

@Injectable()
export class AlertaGrupoService {
  private urlAlertas: string = AppConfig.API_URL + "api/propietarios/"
  private urlAlertasGrupo: string = AppConfig.API_URL + "api/grupos/";

  constructor(private http: Http) {
  }

  deleteAlertasGrupoByIds(propietarioId: number, grupoId: number, alertasIds: number[]): Promise<any> {
    let url: string = AppConfig.API_URL + "api/propietario/" + propietarioId + "/grupos/" + grupoId + "/alertas";
    let params = new URLSearchParams();
    alertasIds.forEach(id => {
      params.append("alertasIds", id.toString());
    });
    return this.http.delete(url, new RequestOptions({search: params}))
      .toPromise();
  }

  getAlertasByGrupoId(propietarioId: number, grupoId: number, fecha: string, tipoAlerta: number, filtroAlerta: number, limite: number, orden: number): Promise<Array<any>> {
    let url: string = this.urlAlertas + propietarioId + "/grupos/" + grupoId + "/alertas";
    let params = new URLSearchParams();
    params.set("fecha", fecha);
    if (limite != null) {
      params.set("limite", limite.toString());
    }
    if (orden != null) {
      params.set("orden", orden.toString());
    }
    if (tipoAlerta != null) {
      params.set("tipoAlerta", tipoAlerta.toString());
    }
    if (filtroAlerta != null) {
      params.set("filtroAlerta", filtroAlerta.toString());
    }
    return this.http.get(url, new RequestOptions({search: params}))
      .map(alertas => alertas.json() as Array<any>).toPromise();
  }

  getAlertaById(grupoId: number, alertaId: number): Promise<any> {
    let url: string = this.urlAlertasGrupo + grupoId + "/alertas/" + alertaId;
    return this.http.get(url)
      .map(alerta => alerta.json())
      .toPromise();
  }

  getAlertasByGrupo(grupoId: number, tipoAlerta: number, tipoFiltro: number): Promise<any> {
    let url: string = this.urlAlertasGrupo + grupoId + "/alertas";
    let params = new URLSearchParams();
    if (tipoAlerta != null) {
      params.set("tipoAlerta", tipoAlerta.toString());
    }
    if (tipoFiltro != null) {
      params.set("filtroAlerta", tipoFiltro.toString());
    }
    return this.http.get(url, new RequestOptions({search: params}))
      .map(alertas => alertas.json())
      .toPromise();
  }

  saveAlerta(alertaGrupo: any): Promise<any> {
    let url: string = this.urlAlertasGrupo + alertaGrupo.Grupo_ID + "/alertas";
    return this.http.post(url, alertaGrupo).toPromise();
  }

  updateAlerta(alertaGrupo: any): Promise<any> {
    let url: string = this.urlAlertasGrupo + alertaGrupo.Grupo_ID + "/alertas/" + alertaGrupo.ID;
    return this.http.put(url, alertaGrupo).toPromise();
  }

  deleteAlerta(alertaGrupo: any): Promise<any> {
    let url: string = this.urlAlertasGrupo + alertaGrupo.Grupo_ID + "/alertas/" + alertaGrupo.ID;
    return this.http.delete(url).toPromise();
  }

  deleteAlertasByIds(grupoId: number, ids: number[]): Promise<any> {
    console.info("Para eliminar: %o", ids);
    let url: string = this.urlAlertasGrupo + grupoId + "/alertas";
    let params = new URLSearchParams();
    ids.forEach(id => {
      params.append("alertaGrupoId", id.toString());
    });
    return this.http.delete(url, new RequestOptions({search: params}))
      .toPromise();
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

  filterNota(value: string, alertasGrupo: any[]): any[] {
    if (value && value !== "") {
      return alertasGrupo.filter(a => {
        return ((a.nota.Alerta.Titulo.toUpperCase().indexOf(value.toUpperCase()) > -1)
          || (a.nota.Alerta.Descripcion.toUpperCase().indexOf(value.toUpperCase()) > -1));
      });
    }
    return alertasGrupo;
  }
}

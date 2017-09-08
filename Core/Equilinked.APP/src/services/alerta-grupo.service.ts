import {Injectable} from "@angular/core";
import {Http, RequestOptions, URLSearchParams} from "@angular/http";
import "rxjs/add/operator/map";
import 'rxjs/add/operator/timeout';
import "rxjs/add/operator/toPromise";
import {AppConfig} from "../app/app.config";

@Injectable()
export class AlertaGrupoService {
  private requestTimeout: number = AppConfig.REQUEST_TIMEOUT;
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
      .timeout(this.requestTimeout)
      .toPromise();
  }

  getAlertasByGrupoId(propietarioId: number, grupoId: number, inicio: string, fin: string, tipos: Array<number>, cantidad: number, orden: number, todosTipos?: boolean): Promise<Array<any>> {
    let url: string = this.urlAlertas + propietarioId + "/grupos/" + grupoId + "/alertas";
    let params = new URLSearchParams();
    if (inicio != null) {
      params.set("inicio", inicio);
    }
    if (fin != null) {
      params.set("fin", fin);
    }
    if (todosTipos != null) {
      params.set("todosTipos", todosTipos ? 'true' : 'false');
    }
    if (tipos != null) {
      tipos.forEach(tipo => {
        params.append("tipos", tipo.toString());
      });
    }
    if (cantidad != null) {
      params.set("cantidad", cantidad.toString());
    }
    if (orden != null) {
      params.set("orden", orden.toString());
    }
    return this.http.get(url, new RequestOptions({search: params}))
      .timeout(this.requestTimeout)
      .map(alertas => alertas.json() as Array<any>).toPromise();
  }

  getAlertaById(grupoId: number, alertaId: number): Promise<any> {
    let url: string = this.urlAlertasGrupo + grupoId + "/alertas/" + alertaId;
    return this.http.get(url)
      .timeout(this.requestTimeout)
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
      .timeout(this.requestTimeout)
      .map(alertas => alertas.json())
      .toPromise();
  }

  saveAlerta(alertaGrupo: any): Promise<any> {
    let url: string = this.urlAlertasGrupo + alertaGrupo.Grupo_ID + "/alertas";
    return this.http.post(url, alertaGrupo)
      .timeout(this.requestTimeout)
      .toPromise();
  }

  updateAlerta(alertaGrupo: any): Promise<any> {
    let url: string = this.urlAlertasGrupo + alertaGrupo.Grupo_ID + "/alertas/" + alertaGrupo.ID;
    return this.http.put(url, alertaGrupo)
      .timeout(this.requestTimeout)
      .toPromise();
  }

  deleteAlerta(alertaGrupo: any): Promise<any> {
    let url: string = this.urlAlertasGrupo + alertaGrupo.Grupo_ID + "/alertas/" + alertaGrupo.ID;
    return this.http.delete(url)
      .timeout(this.requestTimeout)
      .toPromise();
  }

  deleteAlertasByIds(grupoId: number, ids: number[]): Promise<any> {
    console.info("Para eliminar: %o", ids);
    let url: string = this.urlAlertasGrupo + grupoId + "/alertas";
    let params = new URLSearchParams();
    ids.forEach(id => {
      params.append("alertaGrupoId", id.toString());
    });
    return this.http.delete(url, new RequestOptions({search: params}))
      .timeout(this.requestTimeout)
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

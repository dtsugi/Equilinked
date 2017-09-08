import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import {AppConfig} from '../app/app.config';
import {Utils} from '../app/utils';
import {UserSessionEntity} from '../model/UserSessionEntity';

@Injectable()
export class UsuarioService {
  private requestTimeout: number = AppConfig.REQUEST_TIMEOUT;
  private actionUrl: string = AppConfig.API_URL + "api/usuario/";
  private url = "";

  constructor(private _http: Http) {
  }

  loginWithToken(session: any): Promise<any> {
    let url: string = this.actionUrl + "login/token";
    return this._http.post(url, session)
      .timeout(this.requestTimeout)
      .map(response => response.json())
      .toPromise();
  }

  login(session: UserSessionEntity): any {
    let bodyString = JSON.stringify(session);
    let headers = new Headers({'Content-Type': 'application/json'}); // ... Set content type to JSON
    let options = new RequestOptions({headers: headers});
    this.url = Utils.SetUrlApiGet(this.actionUrl + "Login", []);
    console.log("URL" + this.url);
    return this._http.post(this.url, bodyString, options)
      .timeout(this.requestTimeout)
      .map(response => response.json());
  }

  changePassword(usuarioId: number, password: string, newPassword: string): Promise<any> {
    let url: string = this.actionUrl + "ChangePassword/" + usuarioId;
    return this._http.put(url, {
      NuevaContrasena: newPassword,
      ContrasenaActual: password
    })
      .timeout(this.requestTimeout)
      .map(response => response.json())
      .toPromise();
  }

  deleteAccount(usuarioId: number, email: string, password: string): Promise<any> {
    let url = this.actionUrl + "/" + usuarioId;
    let account: any = {
      Correo: email,
      Password: password
    };
    return this._http.delete(url, new RequestOptions({body: account}))
      .timeout(this.requestTimeout)
      .map(response => response.json())
      .toPromise();
  }
}

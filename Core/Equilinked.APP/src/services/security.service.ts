import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { AppConfig } from '../app/app.config';
import { Utils, ConstantsConfig } from '../app/utils';
import { UserSessionEntity} from '../model/userSession';

@Injectable()
export class SecurityService {

    private actionUrl: string = AppConfig.API_URL + "api/{controller}/";
    private url = "";
    userSession: UserSessionEntity;

    constructor(private _http: Http) { }

    setInitialConfigSession(userSessionEntity: UserSessionEntity) {
        localStorage.setItem(ConstantsConfig.USER_ID_LS, userSessionEntity.IdUser.toString());
        localStorage.setItem(ConstantsConfig.USER_NAME_LS, userSessionEntity.UserName);
        localStorage.setItem(ConstantsConfig.USER_PASSWORD_LS, userSessionEntity.Password);
        localStorage.setItem(ConstantsConfig.USER_TOKEN_LS, userSessionEntity.Token);
        localStorage.setItem(ConstantsConfig.USER_PROPIETARIO_ID_LS, userSessionEntity.PropietarioId.toString());
    }

    getInitialConfigSession() {
        this.userSession = new UserSessionEntity();
        this.userSession.IdUser = Number(localStorage.getItem(ConstantsConfig.USER_ID_LS));
        this.userSession.UserName = localStorage.getItem(ConstantsConfig.USER_NAME_LS);
        this.userSession.Password = localStorage.getItem(ConstantsConfig.USER_PASSWORD_LS);
        this.userSession.Token = localStorage.getItem(ConstantsConfig.USER_TOKEN_LS);
        this.userSession.PropietarioId = Number(localStorage.getItem(ConstantsConfig.USER_PROPIETARIO_ID_LS));
        return this.userSession;
    }

    logout() {
        // this.userSession = this.getInitialConfigSession();
        localStorage.removeItem(ConstantsConfig.USER_ID_LS);
        localStorage.removeItem(ConstantsConfig.USER_NAME_LS);
        localStorage.removeItem(ConstantsConfig.USER_PASSWORD_LS);
        localStorage.removeItem(ConstantsConfig.USER_TOKEN_LS);
        localStorage.removeItem(ConstantsConfig.USER_PROPIETARIO_ID_LS);
    }
}

import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import { AppConfig } from "../app/app.config";

@Injectable()
export class RecomendacionService {

    private urlInvitacion: string = AppConfig.API_URL + "api/InvitacionAmigo";

    constructor(private http: Http) {
    }

    sendInvitacionAmigo(invitacion: any): Promise<any> {
        return this.http.post(this.urlInvitacion, invitacion).toPromise();
    }
}
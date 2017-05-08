import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { AppConfig } from '../app/app.config';
import { Utils } from '../app/utils';
import { } from '../model/';

@Injectable()
export class TemplateService {
    private actionUrl: string = AppConfig.API_URL + "api/{controller}/";
    private url = "";

    constructor(private _http: Http) { }    
}

import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {AppConfig} from '../app/app.config';

@Injectable()
export class TemplateService {
  private actionUrl: string = AppConfig.API_URL + "api/{controller}/";
  private url = "";

  constructor(private _http: Http) {
  }
}

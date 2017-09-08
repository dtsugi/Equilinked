import {Injectable} from "@angular/core";
import {Http, RequestOptions, URLSearchParams} from "@angular/http";
import "rxjs/add/operator/map";
import 'rxjs/add/operator/timeout';
import "rxjs/add/operator/toPromise";
import {AppConfig} from "../app/app.config";

@Injectable()
export class GooglePlacesService {

  private requestTimeout: number = AppConfig.REQUEST_TIMEOUT;

  constructor(private http: Http) {
  }

  getPlacesByAddress(address: string): Promise<any> {
    let url = AppConfig.API_GOOGLE_URL + "/place/textsearch/json";
    let params = new URLSearchParams();
    params.set("query", address);
    params.set("key", AppConfig.API_KEY_GOOGLE);
    return this.http.get(url, new RequestOptions({search: params}))
      .timeout(this.requestTimeout)
      .map(response => response.json())
      .toPromise();
  }
}

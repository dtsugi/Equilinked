import {Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class LanguageService {
  constructor(private translate: TranslateService) {
  }

  loadLabels(): Promise<any> {
    return this.translate.getTranslation(this.translate.getDefaultLang()).toPromise();
  }
}

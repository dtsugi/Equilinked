import {Component, OnInit} from "@angular/core";
import {NavParams, ViewController} from "ionic-angular";
import {LanguageService} from '../../services/language.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  template: `
    <ion-grid>
      <ion-row>
        <ion-col class="col-center equi-normal-text" *ngFor="let option of options" tappable (click)="execute(option)">
          <a class="equi-no-link" [href]="sanitize(option.type + telephone)">
            <ion-icon class="equi-button-option" name="{{option.icon}}"></ion-icon>
            <br/>
            {{option.text}}
          </a>
        </ion-col>
      </ion-row>
    </ion-grid>
  `,
  providers: [LanguageService]
})
export class EquiOpcionesTelefonoPopover implements OnInit {
  telephone: string;
  labels: any = {};
  options: Array<any>;

  constructor(private navParams: NavParams,
              private viewController: ViewController,
              private languageService: LanguageService,
              public domSanitizer: DomSanitizer) {
    this.options = new Array<any>();
  }

  ngOnInit(): void {
    this.telephone = this.navParams.get("telephone");
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
      this.options.push({
        type: "tel://",
        text: labels["PANT011_BTN_LLAM"],
        icon: "ios-call"
      });
      this.options.push({
        type: "sms://",
        text: labels["PANT011_BTN_ENMEN"],
        icon: "ios-mail-outline"
      });
    });
  }

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  execute(option: any) {
    this.viewController.dismiss();
  }
}

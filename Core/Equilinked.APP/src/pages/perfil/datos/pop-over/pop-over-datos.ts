import {App, Events} from 'ionic-angular';
import {Component} from '@angular/core';
import {AlertController, NavParams, NavController, ViewController} from 'ionic-angular';
import {SecurityService} from '../../../../services/security.service';
import {LoginPage} from '../../../login/login';
import {PerfilPage} from "../../perfil";
import {OpcionesCuentaPage} from "../opciones-cuenta/opciones-cuenta";
import {EdicionPerfilPage} from "../edicion-perfil/edicion-perfil";
import {LanguageService} from '../../../../services/language.service';
import {FotoPerfilPage} from '../foto-perfil/foto-perfil';
import {SegmentDatos} from '../segment-datos';
import {NotificacionLocalService} from '../../../../services/notificacion-local.service';

@Component({
  selector: 'pop-over-datos',
  templateUrl: 'pop-over-datos.html',
  providers: [LanguageService, SecurityService]
})
export class PopoverDatosPage {
  private navCtrlDatos: NavController;
  private perfilPage: PerfilPage;
  private segmentDatos: SegmentDatos;
  labels: any = {};

  constructor(private app: App,
              private alertController: AlertController,
              private events: Events,
              private notificacionLocalService: NotificacionLocalService,
              public navCtrl: NavController,
              public navParams: NavParams,
              private _securityService: SecurityService,
              public viewController: ViewController,
              private languageService: LanguageService) {
    languageService.loadLabels().then(labels => this.labels = labels);
  }

  ngOnInit() {
    this.navCtrlDatos = this.navParams.get("navController");
    this.perfilPage = this.navParams.get("perfilPage");
    this.segmentDatos = this.navParams.get("segmenDatos");
    console.info(this.segmentDatos ? "segmentadots si tiene" : "segmen no tiene");
  }

  editAccount(): void {
    this.viewController.dismiss();
    this.navCtrlDatos.push(EdicionPerfilPage, {perfilDatosPage: this.perfilPage});
  }

  showOptionsAccount(): void {
    this.viewController.dismiss();
    this.navCtrlDatos.push(OpcionesCuentaPage, {navCtrlMenu: this.navCtrl});
  }

  changePhoto(): void {
    this.viewController.dismiss();
    let photo: string = this.segmentDatos.getPhotoBase64();
    console.info("El string que se enviara es:" + photo);
    this.navCtrlDatos.push(FotoPerfilPage, {photoBase64: photo});
  }

  logout() {
    this.viewController.dismiss();
    let alert = this.alertController.create({
      subTitle: this.labels["PANT026_ALT_MSGCESA"],
      buttons: [
        {
          text: this.labels["PANT026_BTN_CAN"],
          role: "cancel"
        },
        {
          text: this.labels["PANT026_BTN_ACE"],
          handler: () => {
            try {
              this.events.publish("interval-badge:clear");
              this.notificacionLocalService.removeAllLocalNotificacions();
              this._securityService.logout();
              this.app.getRootNav().setRoot(LoginPage);
            } catch (ex) {
              console.log("Error logout: " + JSON.stringify(ex));
            }
          }
        }
      ]
    });
    alert.present();
  }
}

import { Component } from '@angular/core';
import { AlertController, NavParams, NavController, ViewController } from 'ionic-angular';
import { CommonService } from '../../../../services/common.service';
import { SecurityService } from '../../../../services/security.service';
import { LoginPage } from '../../../login/login';
import { PerfilPage } from "../../perfil";
import { OpcionesCuentaPage } from "../opciones-cuenta/opciones-cuenta";
import { EdicionPerfilPage } from "../edicion-perfil/edicion-perfil";
import { LanguageService } from '../../../../services/language.service';

@Component({
    selector: 'pop-over-datos',
    templateUrl: 'pop-over-datos.html',
    providers: [LanguageService, CommonService, SecurityService]
})
export class PopoverDatosPage {

    private navCtrlDatos: NavController;
    private perfilPage: PerfilPage;
    labels: any = {};

    constructor(
        private alertController: AlertController,
        public navCtrl: NavController,
        public navParams: NavParams,
        private _commonService: CommonService,
        private _securityService: SecurityService,
        public viewController: ViewController,
        private languageService: LanguageService
    ) {
        languageService.loadLabels().then(labels => this.labels = labels);
    }

    ngOnInit() {
        this.navCtrlDatos = this.navParams.get("navController");
        this.perfilPage = this.navParams.get("perfilPage");
    }

    editAccount(): void {
        this.viewController.dismiss();
        this.navCtrlDatos.push(EdicionPerfilPage, { perfilDatosPage: this.perfilPage });
    }

    showOptionsAccount(): void {
        this.viewController.dismiss();
        this.navCtrlDatos.push(OpcionesCuentaPage, { navCtrlMenu: this.navCtrl });
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
                        this._securityService.logout();
                        this.navCtrl.setRoot(LoginPage);
                        this.navCtrl.push(LoginPage);
                    }
                }
            ]
        });
        alert.present();
    }
}
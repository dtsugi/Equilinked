import { Component } from '@angular/core';
import { AlertController, NavParams, NavController, ViewController } from 'ionic-angular';
import { CommonService } from '../../../../services/common.service';
import { SecurityService } from '../../../../services/security.service';
import { LoginPage } from '../../../login/login';
import { PerfilPage } from "../../perfil";
import { OpcionesCuentaPage } from "../opciones-cuenta/opciones-cuenta";
import { EdicionPerfilPage } from "../edicion-perfil/edicion-perfil";

@Component({
    selector: 'pop-over-datos',
    templateUrl: 'pop-over-datos.html',
    providers: [CommonService, SecurityService]
})
export class PopoverDatosPage {

    private navCtrlDatos: NavController;
    private perfilPage: PerfilPage;

    constructor(
        private alertController: AlertController,
        public navCtrl: NavController,
        public navParams: NavParams,
        private _commonService: CommonService,
        private _securityService: SecurityService,
        public viewController: ViewController
    ) {
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
            subTitle: "Cerrar sesión",
            buttons: [
                {
                    text: "Cancelar",
                    role: "cancel"
                },
                {
                    text: "Aceptar",
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
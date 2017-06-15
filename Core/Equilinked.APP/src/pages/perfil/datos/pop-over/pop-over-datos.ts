import { Component } from '@angular/core';
import { AlertController, NavParams, NavController, ViewController } from 'ionic-angular';
import { CommonService } from '../../../../services/common.service';
import { SecurityService } from '../../../../services/security.service';
import { LoginPage } from '../../../login/login';
import { OpcionesCuentaPage } from "../opciones-cuenta/opciones-cuenta";

@Component({
    selector: 'pop-over-datos',
    templateUrl: 'pop-over-datos.html',
    providers: [CommonService, SecurityService]
})
export class PopoverDatosPage {

    private navCtrlDatos: NavController;
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
    }

    showOptionsAcount(): void {
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
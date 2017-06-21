import { Component } from "@angular/core";
import { AlertController, Events, NavParams, NavController, ViewController } from "ionic-angular";
import { CommonService } from "../../../../../../services/common.service";
import { GruposCaballosService } from "../../../../../../services/grupos-caballos.service";
import { CambioNombrePage } from "../cambio-nombre/cambio-nombre";

@Component({
    templateUrl: "opciones-ficha.html",
    providers: [CommonService, GruposCaballosService]
})
export class OpcionesFichaGrupo {

    private navCtrlGrupo: NavController;
    private grupo: any;

    constructor(
        private alertController: AlertController,
        private events: Events,
        private gruposCaballosService: GruposCaballosService,
        private navController: NavController,
        private navParams: NavParams,
        private commonService: CommonService,
        private viewController: ViewController
    ) {
        this.grupo = {};
    }

    ngOnInit() {
        this.navCtrlGrupo = this.navParams.get("navCtrlGrupo");
        this.grupo = this.navParams.get("grupo");
    }

    editName(): void {
        this.viewController.dismiss();
        this.navCtrlGrupo.push(CambioNombrePage, { grupo: this.grupo });
    }

    private deleteGrupoHandler(): Function {
        return () => {
            this.commonService.showLoading("Procesando...");
            this.gruposCaballosService.deleteGrupoById(this.grupo.ID)
                .then(res => {
                    this.commonService.hideLoading();
                    this.navCtrlGrupo.pop().then(() => {
                        this.events.publish("grupo:deleted");
                    });
                }).catch(err => {
                    this.commonService.ShowErrorHttp(err, "Error al eliminar el grupo");
                });
        };
    }

    delete() {
        this.viewController.dismiss();
        let alert = this.alertController.create({
            subTitle: "Se eliminará este grupo",
            buttons: [
                {
                    text: "Cancelar",
                    role: "cancel"
                },
                {
                    text: "Aceptar",
                    handler: this.deleteGrupoHandler()
                }
            ]
        });
        alert.present();
    }
}
import { Component } from "@angular/core";
import { AlertController, Events, NavParams, NavController, ViewController } from "ionic-angular";
import { CommonService } from "../../../../services/common.service";
import { CaballoService } from "../../../../services/caballo.service";
import { CambioNombreCaballoPage } from "../cambio-nombre/cambio-nombre";

@Component({
    templateUrl: "opciones-caballo.html",
    providers: [CommonService, CaballoService]
})
export class OpcionesCaballoPopover {

    private navCtrlCaballo: NavController;
    private caballo: any;

    constructor(
        private alertController: AlertController,
        private events: Events,
        private caballoService: CaballoService,
        private navController: NavController,
        private navParams: NavParams,
        private commonService: CommonService,
        private viewController: ViewController
    ) {
        this.caballo = {};
    }

    ngOnInit(): void {
        this.navCtrlCaballo = this.navParams.get("navCtrlCaballo");
        this.caballo = this.navParams.get("caballo");
    }

    editName(): void {
        this.viewController.dismiss();

        let caballo: any = JSON.parse(JSON.stringify(this.caballo)); //mandamos un clon si no se modifica el actual
        this.navCtrlCaballo.push(CambioNombreCaballoPage, { caballo: caballo });
    }

    delete() {
        this.viewController.dismiss();
        this.alertController.create({
            subTitle: "Se eliminará el caballo",
            buttons: [
                { text: "Cancelar", role: "cancel" },
                { text: "Aceptar", handler: this.deleteCaballoHandler() }
            ]
        }).present();
    }

    private deleteCaballoHandler(): Function {
        return () => {
            this.commonService.showLoading("Procesando...");
            this.caballoService.delete(this.caballo.ID)
                .toPromise()
                .then(res => {
                    this.commonService.hideLoading();
                    this.events.publish("caballos:refresh");
                    this.navCtrlCaballo.pop().then(() => {
                        this.commonService.ShowInfo("El caballo fue eliminado");
                    })
                }).catch(err => {
                    this.commonService.ShowErrorHttp(err, "Error al eliminar el caballo");
                });
        };
    }


}
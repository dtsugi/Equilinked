import { Component } from "@angular/core";
import { AlertController, Events, NavParams, NavController, ViewController } from "ionic-angular";
import { CommonService } from "../../../../../../../../services/common.service";
import { EstablosService } from "../../../../../../../../services/establos.service";
import { AdminEstablosPage } from "../../../../../../../perfil/establos/admin-establo/admin-establo";

@Component({
    templateUrl: "popover-establo.html",
    providers: [CommonService, EstablosService]
})
export class PopoverOpcionesEstablo {

    private REFRESH_LIST_EVENT_NAME: string = "ubicaciones:refresh";
    private REFRESH_ITEM_EVENT_NAME: string = "ubicacion:refresh";

    private navCtrlEstablo: any;
    private establo: any;

    constructor(
        private alertController: AlertController,
        private establosService: EstablosService,
        private events: Events,
        public navController: NavController,
        public navParams: NavParams,
        private commonService: CommonService,
        public viewController: ViewController
    ) {
    }

    ngOnInit() {
        this.navCtrlEstablo = this.navParams.get("navCtrlEstablo");
        this.establo = this.navParams.get("establo");
    }

    deleteEstablo(): void {
        this.viewController.dismiss();

        this.alertController.create({
            title: "Alerta!",
            message: "Se eliminará el establo",
            buttons: [
                {
                    text: "Cancelar",
                    role: "cancel"
                },
                {
                    text: "Aceptar",
                    handler: () => {
                        this.establosService.deleteEstablo(this.establo.ID)
                            .then(() => {
                                this.events.publish("ubicaciones:refresh"); //Refrescamos las ubicaciones
                                this.navCtrlEstablo.pop(); //hacia atras!
                            }).catch(err => {
                                this.commonService.ShowErrorHttp(err, "Error al eliminar el establo");
                            });
                    }
                }
            ]
        }).present();
    }

    editEstablo(): void {
        console.info("Se editara el establo", this.establo.ID);
        this.viewController.dismiss();
        let params: any = {
            establo: JSON.parse(JSON.stringify(this.establo)),
            showConfirmSave: true,
            eventRefreshList: this.REFRESH_LIST_EVENT_NAME,
            eventRefreshItem: this.REFRESH_ITEM_EVENT_NAME
        };
        this.navCtrlEstablo.push(AdminEstablosPage, params);
    }

    /*
    editAccount(): void {
        this.viewController.dismiss();
        this.navCtrlDatos.push(EdicionPerfilPage, { perfilDatosPage: this.perfilPage });
    }*/


}
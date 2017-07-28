import { Component } from "@angular/core";
import { AlertController, Events, NavParams, NavController, ViewController } from "ionic-angular";
import { CommonService } from "../../../../../../../../services/common.service";
import { EstablosService } from "../../../../../../../../services/establos.service";
import { AdminEstablosPage } from "../../../../../../../perfil/establos/admin-establo/admin-establo";
import { LanguageService } from '../../../../../../../../services/language.service';

@Component({
    templateUrl: "popover-establo.html",
    providers: [LanguageService, CommonService, EstablosService]
})
export class PopoverOpcionesEstablo {

    private REFRESH_LIST_EVENT_NAME: string = "ubicaciones:refresh";
    private REFRESH_ITEM_EVENT_NAME: string = "ubicacion:refresh";

    private navCtrlEstablo: any;
    private establo: any;
    labels: any = {};


    constructor(
        private alertController: AlertController,
        private establosService: EstablosService,
        private events: Events,
        public navController: NavController,
        public navParams: NavParams,
        private commonService: CommonService,
        public viewController: ViewController,
        private languageService: LanguageService
    ) {
        languageService.loadLabels().then(labels => this.labels = labels);
    }

    ngOnInit() {
        this.navCtrlEstablo = this.navParams.get("navCtrlEstablo");
        this.establo = this.navParams.get("establo");
    }

    deleteEstablo(): void {
        this.viewController.dismiss();

        this.alertController.create({
            message: this.labels["PANT016_ALT_MSELI"],
            buttons: [
                {
                    text: this.labels["PANT016_BTN_CAN"],
                    role: "cancel"
                },
                {
                    text: this.labels["PANT016_BTN_ACEP"],
                    handler: () => {
                        this.establosService.deleteEstablo(this.establo.ID)
                            .then(() => {
                                this.events.publish("establos:refresh");//Lista de establos perfil usuario
                                this.events.publish("grupo-ubicaciones:refresh"); //Refrescamos las ubicaciones

                                this.navCtrlEstablo.pop(); //hacia atras!
                            }).catch(err => {
                                this.commonService.ShowErrorHttp(err, this.labels["PANT016_MSG_ERRELI"]);
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
}
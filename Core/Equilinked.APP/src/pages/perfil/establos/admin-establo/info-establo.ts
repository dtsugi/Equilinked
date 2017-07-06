import { Component, OnDestroy, OnInit } from "@angular/core";
import { Events, NavController, NavParams, ToastController } from "ionic-angular";
import { AdminEstablosPage } from "./admin-establo";
import { EdicionEstabloCaballosPage } from "./edicion-caballos";
import { EstablosService } from "../../../../services/establos.service";
import { CommonService } from "../../../../services/common.service";

@Component({
    templateUrl: "./info-establo.html",
    providers: [CommonService, EstablosService],
    styles: [`
        .icon-hidden {
            visibility: hidden;
        }
    `]
})
export class InfoEstabloPage implements OnDestroy, OnInit {

    private REFRESH_LIST_EVENT_NAME: string = "establos:refresh";
    private REFRESH_ITEM_EVENT_NAME: string = "establo:refresh";
    private establoId: number;

    establo: any;

    constructor(
        private events: Events,
        private commonService: CommonService,
        private establosService: EstablosService,
        private navController: NavController,
        private navParams: NavParams
    ) {
    }

    ngOnInit(): void {
        this.establoId = this.navParams.get("establoId");
        this.getInfoEstablo(true);
        this.addEvents();
    }

    ngOnDestroy(): void {
        this.removeEvents();
    }

    getInfoEstablo(showLoading: boolean): void {
        if (showLoading) {
            this.commonService.showLoading("Procesando..");
        }
        this.establosService.getEstabloById(this.establoId)
            .then(establo => {
                this.establo = establo;
                if (showLoading) {
                    this.commonService.hideLoading();
                }
            }).catch(err => {
                console.error(err);
                this.commonService.ShowErrorHttp(err, "Error obteniendo los establos del propietario");
            });
    }

    edit(): void {
        let params: any = {
            establo: JSON.parse(JSON.stringify(this.establo)),
            showConfirmSave: false,
            eventRefreshList: this.REFRESH_LIST_EVENT_NAME,
            eventRefreshItem: this.REFRESH_ITEM_EVENT_NAME
        };
        this.navController.push(AdminEstablosPage, params);
    }

    viewCaballos(): void {
        let params: any = {
            establo: JSON.parse(JSON.stringify(this.establo)),
            eventRefreshItem: this.REFRESH_ITEM_EVENT_NAME
        };
        this.navController.push(EdicionEstabloCaballosPage, params);
    }

    private addEvents(): void {
        this.events.subscribe("establo:refresh", () => {
            this.getInfoEstablo(false);
        });
    }

    private removeEvents(): void {
        this.events.unsubscribe("establo:refresh");
    }
}
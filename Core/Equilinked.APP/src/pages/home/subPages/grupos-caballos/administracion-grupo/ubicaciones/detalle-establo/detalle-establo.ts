import { Component, OnDestroy, OnInit } from "@angular/core";
import { Events, NavController, NavParams, PopoverController } from "ionic-angular";
import { EstablosService } from "../../../../../../../services/establos.service";
import { CommonService } from "../../../../../../../services/common.service";
import { PopoverOpcionesEstablo } from "./popover-establo/popover-establo";
import { EdicionEstabloCaballosPage } from "../../../../../../perfil/establos/admin-establo/edicion-caballos";

@Component({
    templateUrl: "./detalle-establo.html",
    providers: [CommonService, EstablosService],
    styles: [`
        .icon-hidden {
            visibility: hidden;
        }
    `]
})
export class DetalleEstabloPage implements OnDestroy, OnInit {

    private REFRESH_LIST_EVENT_NAME: string = "ubicaciones:refresh";
    private REFRESH_ITEM_EVENT_NAME: string = "ubicacion:refresh";
    private establoId: number;

    grupo: any;
    establo: any;

    constructor(
        private events: Events,
        private commonService: CommonService,
        private establosService: EstablosService,
        private navController: NavController,
        private navParams: NavParams,
        private popoverController: PopoverController
    ) {
    }

    ngOnInit(): void {
        this.establoId = this.navParams.get("establoId");
        this.grupo = this.navParams.get("grupo");
        this.getInfoEstablo(true);
        this.addEvents();
    }

    ngOnDestroy(): void {
        this.removeEvents();
    }

    showOptions(ev: any): void {
        let params: any = {
            navCtrlEstablo: this.navController,
            establo: this.establo
        };
        let popover = this.popoverController.create(PopoverOpcionesEstablo, params);
        popover.present({
            ev: ev
        });
    }

    editCaballos(): void {
        let params: any = {
            establo: JSON.parse(JSON.stringify(this.establo)),
            grupo: this.grupo,
            eventRefreshItem: this.REFRESH_ITEM_EVENT_NAME,
            eventRefreshList: this.REFRESH_LIST_EVENT_NAME
        };
        this.navController.push(EdicionEstabloCaballosPage, params);
    }

    private getInfoEstablo(showLoading: boolean): void {
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


    private addEvents(): void {
        this.events.subscribe("ubicacion:refresh", () => {
            this.getInfoEstablo(false);
        });
    }

    private removeEvents(): void {
        this.events.unsubscribe("ubicacion:refresh");
    }
}
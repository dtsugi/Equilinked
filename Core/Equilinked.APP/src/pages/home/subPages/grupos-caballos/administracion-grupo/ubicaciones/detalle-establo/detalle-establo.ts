import { Component, OnDestroy, OnInit } from "@angular/core";
import { Events, NavController, NavParams, PopoverController } from "ionic-angular";
import { EstablosService } from "../../../../../../../services/establos.service";
import { CommonService } from "../../../../../../../services/common.service";
import { PopoverOpcionesEstablo } from "./popover-establo/popover-establo";
import { EdicionEstabloCaballosPage } from "../../../../../../perfil/establos/admin-establo/edicion-caballos";
import { LanguageService } from '../../../../../../../services/language.service';

@Component({
    templateUrl: "./detalle-establo.html",
    providers: [LanguageService, CommonService, EstablosService],
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
    labels: any = {};

    constructor(
        private events: Events,
        private commonService: CommonService,
        private establosService: EstablosService,
        private navController: NavController,
        private navParams: NavParams,
        private popoverController: PopoverController,
        private languageService: LanguageService
    ) {
        languageService.loadLabels().then(labels => this.labels = labels);
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
            this.commonService.showLoading(this.labels["PANT016_ALT_PRO"]);
        }
        this.establosService.getEstabloById(this.establoId)
            .then(establo => {
                this.establo = establo;
                if (showLoading) {
                    this.commonService.hideLoading();
                }
            }).catch(err => {
                console.error(err);
                this.commonService.ShowErrorHttp(err, this.labels["PANT016_MSG_ERRUB"]);
            });
    }

    private addEvents(): void {
        this.events.subscribe("grupo-ubicacion:refresh", () => {
            this.getInfoEstablo(false);
        });
    }

    private removeEvents(): void {
        this.events.unsubscribe("grupo-ubicacion:refresh");
    }
}
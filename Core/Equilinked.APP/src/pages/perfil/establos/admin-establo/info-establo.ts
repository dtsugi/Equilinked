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
        this.registredEvents();
    }

    ngOnDestroy(): void {
        this.unregistredEvents();
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
            establo: JSON.parse(JSON.stringify(this.establo))
        };
        this.navController.push(AdminEstablosPage, params);
    }

    viewCaballos(): void {
        let params: any = {
            establo: JSON.parse(JSON.stringify(this.establo)),
            infoEstabloPage: this
        };
        this.navController.push(EdicionEstabloCaballosPage, params);
    }

    private registredEvents(): void {
        this.events.subscribe("establo:refresh", () => {
            this.getInfoEstablo(false);
        });
    }

    private unregistredEvents(): void {
        this.events.unsubscribe("establo:refresh");
    }
}
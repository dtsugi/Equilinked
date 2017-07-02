import { Component, OnDestroy, OnInit } from "@angular/core";
import { Events, NavController, NavParams } from "ionic-angular";
import { EstablosService } from "../../../../../../../services/establos.service";
import { CommonService } from "../../../../../../../services/common.service";

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


    private registredEvents(): void {
        this.events.subscribe("establo:refresh", () => {
            this.getInfoEstablo(false);
        });
    }

    private unregistredEvents(): void {
        this.events.unsubscribe("establo:refresh");
    }
}
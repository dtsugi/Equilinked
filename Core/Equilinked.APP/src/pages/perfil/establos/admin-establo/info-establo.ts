import { Component, OnInit } from "@angular/core";
import { NavController, NavParams, ToastController } from "ionic-angular";
import { ListadoEstablosPage } from "../establos";
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
export class InfoEstabloPage implements OnInit {

    private establoId: number;
    private establosPage: ListadoEstablosPage;

    establo: any;

    constructor(
        private commonService: CommonService,
        private establosService: EstablosService,
        private navController: NavController,
        private navParams: NavParams
    ) {
    }

    ngOnInit(): void {
        this.establoId = this.navParams.get("establoId");
        this.establosPage = this.navParams.get("establosPage");
        this.getInfoEstablo(true);
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
            establosPage: this.establosPage,
            infoEstabloPage: this
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
}
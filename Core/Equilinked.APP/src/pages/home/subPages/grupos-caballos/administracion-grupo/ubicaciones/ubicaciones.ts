import { Component, OnDestroy, OnInit } from "@angular/core";
import { Events, NavController, NavParams } from "ionic-angular";
import { CommonService } from "../../../../../../services/common.service";
import { DetalleEstabloPage } from "./detalle-establo/detalle-establo";

@Component({
    templateUrl: "./ubicaciones.html",
    providers: [CommonService]
})
export class UbicacionesGrupoPage implements OnDestroy, OnInit {

    private grupo: any;

    ubicaciones: Array<any>;

    constructor(
        private commonService: CommonService,
        private events: Events,
        private navController: NavController,
        private navParams: NavParams
    ) {
        this.ubicaciones = new Array<any>();
    }

    ngOnInit(): void {
        this.grupo = this.navParams.get("grupo");
        this.getListUbicaciones(true);
        this.registredEvents();
    }

    ngOnDestroy(): void {
        this.unregistredEvents();
    }

    goBack(): void {
        this.navController.pop();
    }

    view(ubicacion: any): void {
        this.navController.push(DetalleEstabloPage, { establoId: ubicacion.ID });
    }

    private getListUbicaciones(loading: boolean): void {
        if (loading)
            this.commonService.showLoading("Procesando..");

        this.ubicaciones = [
            { Nombre: "Establo 01", Caballos: 2, ID: 42 },
            { Nombre: "Establo ABC", Caballos: 10, ID: 54 },
            { Nombre: "Establo A1B2C3", Caballos: 4, ID: 59 }
        ];

        if (loading)
            this.commonService.hideLoading();

        //this.commonService.ShowErrorHttp(err, "Error al actualizar el nombre del grupo");
    }

    private registredEvents(): void {
        this.events.subscribe("ubicaciones:refresh", () => {
            this.getListUbicaciones(false);
        });
    }

    private unregistredEvents(): void {
        this.events.unsubscribe("ubicaciones:refresh");
    }
}
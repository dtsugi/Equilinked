import { Component, OnInit } from "@angular/core";
import { NavController, NavParams, ViewController } from "ionic-angular";
import { AdminEstablosPage } from "../../../../perfil/establos/admin-establo/admin-establo";
import { LanguageService } from '../../../../../services/language.service';

@Component({
    templateUrl: "./opciones-ubicacion.html",
    providers: [LanguageService]
})
export class OpcionesUbicacionModal implements OnInit {

    private navCtrl: NavController;
    private establo: any;
    labels: any = {};
    opciones: Array<any>;

    constructor(
        private navController: NavController,
        private navParams: NavParams,
        private viewController: ViewController,
        private languageService: LanguageService
    ) {
        this.opciones = new Array<any>();
        languageService.loadLabels().then(labels => this.labels = labels);
    }

    ngOnInit(): void {
        this.navCtrl = this.navParams.get("navCtrl");
        this.establo = this.navParams.get("establo");

        this.opciones.push({
            icon: "ios-home",
            texto: "Editar datos del establo",
            page: AdminEstablosPage,
            params: { showConfirmSave: false, establo: this.establo }
        });

        this.opciones.push({
            icon: "add-circle",
            texto: "Agregar establo nuevo",
            page: AdminEstablosPage,
            params: { showConfirmSave: false }
        });
    }

    cancel(): void {
        this.viewController.dismiss();
    }

    selectOption(opcion: any): void {
        this.viewController.dismiss();
        if (opcion.page) {
            this.navCtrl.push(opcion.page, opcion.params);
        }
    }
}
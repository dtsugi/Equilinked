import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Events, NavController, NavParams } from "ionic-angular";
import { CommonService } from "../../../../services/common.service";
import { CaballoService } from "../../../../services/caballo.service";

@Component({
    templateUrl: "./cambio-nombre.html",
    providers: [CaballoService, CommonService]
})
export class CambioNombreCaballoPage implements OnInit {

    private caballo: any;

    constructor(
        private caballoService: CaballoService,
        private commonService: CommonService,
        private events: Events,
        private navController: NavController,
        private navParams: NavParams
    ) {
    }

    ngOnInit(): void {
        this.caballo = this.navParams.get("caballo");
    }

    goBack(): void {
        this.navController.pop();
    }

    save(): void {
        this.commonService.showLoading("Procesando..");
        this.caballoService.save(this.caballo)
            .toPromise()
            .then(resp => {
                this.commonService.hideLoading();
                this.events.publish("caballos:refresh"); //Refresco la pantalla de caballos
                this.navController.pop().then(() => {
                    this.commonService.ShowInfo("Nombre del caballo modificado");
                });
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, "Error al actualizar el nombre del caballo");
            });
    }
}
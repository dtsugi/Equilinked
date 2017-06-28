import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Events, NavController, NavParams, ToastController } from "ionic-angular";
import { CommonService } from "../../../../../../services/common.service";
import { GruposCaballosService } from "../../../../../../services/grupos-caballos.service";

@Component({
    templateUrl: "./cambio-nombre.html",
    providers: [CommonService, GruposCaballosService]
})
export class CambioNombrePage implements OnInit {

    private grupo: any;

    constructor(
        private commonService: CommonService,
        private events: Events,
        private formBuilder: FormBuilder,
        private gruposCaballosService: GruposCaballosService,
        private navController: NavController,
        private navParams: NavParams,
        public toastController: ToastController
    ) {
    }

    ngOnInit(): void {
        this.grupo = this.navParams.get("grupo");
    }

    goBack(): void {
        this.navController.pop();
    }

    save(): void {
        this.commonService.showLoading("Procesando..");
        this.gruposCaballosService.updateGrupo(this.grupo)
            .then(resp => {
                this.events.publish("grupo:refresh"); //Refresco la pantalla de grupo seleccionado
                this.events.publish("grupos:refresh"); //Refresco la lista de grupos existentes
                this.commonService.hideLoading();
                this.navController.pop();
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, "Error al actualizar el nombre del grupo");
            });
    }
}
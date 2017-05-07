import { Component, OnInit } from "@angular/core";
import { NavController, ToastController } from "ionic-angular";
import { CommonService } from '../../../../services/common.service';
import { GruposCaballosService } from "../../../../services/grupos-caballos.service";
import { AdminGruposCaballosPage } from "../../admin-grupos-caballos/admin-grupos-caballos";

@Component({
    selector: "grupos-caballos",
    templateUrl: "./grupos-caballos.html",
    providers: [CommonService, GruposCaballosService]
})
export class GruposCaballos implements OnInit {

    private PROPIETARIO_ID: number = 2; //Id propietario para usuario admin

    grupos = [];
    gruposRespaldo = [];
    constructor(private commonService: CommonService,
        private navController: NavController,
        private toastController: ToastController,
        private gruposCaballosService: GruposCaballosService) {
    }

    ngOnInit(): void {
        this.getGruposCaballos();
    }

    getGruposCaballos(): void {
        this.commonService.showLoading("Procesando..");
        this.gruposCaballosService.getGruposCaballosByPropietarioId(this.PROPIETARIO_ID)
            .then(grupos => {
                console.info(grupos);
                this.gruposRespaldo = grupos;
                this.grupos = grupos;
                this.commonService.hideLoading();
            })
            .catch(err => {
                console.error(err);
                this.commonService.hideLoading();
                this.commonService.ShowToast(this.toastController, this.commonService.TOAST_POSITION.bottom, "Error al cargar los grupos", 2000);
            });
    }

    filter(evt: any): void {
        this.grupos = this.gruposCaballosService.filterGrupoCaballo(evt.target.value, this.gruposRespaldo);
    }

    seleccionarGrupo(grupo): void {
        console.info(JSON.stringify(grupo));
    }

    newGrupo(): void {
        this.navController.push(AdminGruposCaballosPage, { gruposCaballos: this });
    }
}
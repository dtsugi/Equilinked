import { Component, OnInit } from "@angular/core";
import { NavController, NavParams, ToastController } from "ionic-angular";
import { FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
//import { CaballosService } from "../../../services/caballos.service";
import { GruposCaballosService } from '../../../services/grupos-caballos.service';
import { Caballo } from '../../../model/caballo';
import { Grupo } from "../../../model/grupo";
import { GruposCaballos } from "../subPages/grupos-caballos/grupos-caballos";

@Component({
    selector: "admin-grupos-caballos",
    templateUrl: "./admin-grupos-caballos.html",
    providers: [CommonService, GruposCaballosService]
})
export class AdminGruposCaballosPage implements OnInit {

    private PROPIETARIO_ID: number = 2;

    caballosRespaldo: Array<any>;
    grupo: Grupo;
    caballos: Array<any>;
    grupoCaballosForm: any;

    constructor(
        private formBuilder: FormBuilder,
        private commonService: CommonService,
        private navController: NavController,
        private navParams: NavParams,
        private gruposCaballosService: GruposCaballosService,
        public toastController: ToastController
    ) {
        this.grupo = new Grupo();
    }

    ngOnInit(): void {
        this.getAllCaballosByPropietario();
        this.grupoCaballosForm = this.formBuilder.group({
            Descripcion: [this.grupo.Descripcion, Validators.required]
        });
    }

    filter(evt: any): void {
        this.caballos = this.gruposCaballosService.filterCaballo(evt.target.value, this.caballosRespaldo);
    }

    countCaballos(): number {
        return this.caballos.filter(c => c.seleccion).length;
    }

    save(): void {
        let grupo = {
            Caballo: this.caballos.filter(c => c.seleccion).map(c => c.caballo),
            Descripcion: this.grupoCaballosForm.value.Descripcion,
            Propietario_ID: this.PROPIETARIO_ID
        };

        this.commonService.showLoading("Procesando..");
        this.gruposCaballosService.saveGrupo(grupo).then(resp => {
            console.info(resp);
            let gc: GruposCaballos = this.navParams.get("gruposCaballos");
            gc.getGruposCaballos();
            this.commonService.hideLoading();
            this.navController.pop();
        }).catch(err => {
            console.error(err);
            this.commonService.hideLoading();
        });
    }

    private getAllCaballosByPropietario(): void {
        this.commonService.showLoading("Procesando..");
        this.gruposCaballosService.getCaballosByPropietarioId(this.PROPIETARIO_ID)
            .then(caballos => {
                console.info("Los caballos:");
                console.info(caballos);
                this.commonService.hideLoading();
                this.caballosRespaldo = caballos.map(c => {
                    return { caballo: c, seleccion: false };
                });
                this.caballos = this.caballosRespaldo;
            })
            .catch(err => {
                console.error(err);
                this.commonService.hideLoading();
                this.commonService.ShowToast(this.toastController, this.commonService.TOAST_POSITION.bottom, "Error al cargar los caballos", 2000);
            });
    }
}
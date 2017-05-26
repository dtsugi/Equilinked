import { Component, OnInit } from "@angular/core";
import { NavController, NavParams, ToastController } from "ionic-angular";
import { FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { SecurityService } from "../../../services/security.service";
import { GruposCaballosService } from "../../../services/grupos-caballos.service";
import { CaballoService } from '../../../services/caballo.service';
import { Grupo } from "../../../model/grupo";
import { GruposCaballos } from "../subPages/grupos-caballos/grupos-caballos";
import { UserSessionEntity } from "../../../model/userSession";

@Component({
    selector: "admin-grupos-caballos",
    templateUrl: "./admin-grupos-caballos.html",
    providers: [CaballoService, CommonService, GruposCaballosService, SecurityService]
})
export class AdminGruposCaballosPage implements OnInit {

    caballos: Array<any>;
    caballosRespaldo: Array<any>;
    grupo: Grupo;
    grupoCaballosForm: any;
    session: UserSessionEntity;

    constructor(
        private caballoService: CaballoService,
        private commonService: CommonService,
        private formBuilder: FormBuilder,
        private gruposCaballosService: GruposCaballosService,
        private navController: NavController,
        private navParams: NavParams,
        private securityService: SecurityService,
        public toastController: ToastController
    ) {
        this.grupo = new Grupo();
    }

    ngOnInit(): void {
        this.session = this.securityService.getInitialConfigSession();
        this.grupoCaballosForm = this.formBuilder.group({
            Descripcion: [this.grupo.Descripcion, Validators.required]
        });
        this.getAllCaballosByPropietario();
    }

    selectAll(): void {
        let selectAll: boolean = this.countCaballos() !== this.caballosRespaldo.length;
        this.caballosRespaldo.forEach(c => {
            c.seleccion = selectAll;
        });
    }

    filter(evt: any): void {
        this.caballos = this.gruposCaballosService.filterCaballo(evt.target.value, this.caballosRespaldo);
    }

    save(): void {
        let grupo = {
            Caballo: this.caballos.filter(c => c.seleccion).map(c => c.caballo),
            Descripcion: this.grupoCaballosForm.value.Descripcion,
            Propietario_ID: this.session.PropietarioId,
            GrupoDefault: false
        };

        this.commonService.showLoading("Procesando..");
        this.gruposCaballosService.saveGrupo(grupo).then(resp => {
            this.commonService.hideLoading();
            let gc: GruposCaballos = this.navParams.get("gruposCaballosPage");
            this.navController.pop();
            gc.getGruposCaballos();
        }).catch(err => {
            this.commonService.ShowErrorHttp(err, "Error al guardar el grupo");
        });
    }

    private countCaballos(): number {
        return this.caballosRespaldo.filter(c => c.seleccion).length;
    }

    private getAllCaballosByPropietario(): void {
        this.commonService.showLoading("Procesando..");
        this.caballoService.getAllSerializedByPropietarioId(this.session.PropietarioId)
            .subscribe(caballos => {
                this.commonService.hideLoading();
                this.caballosRespaldo = caballos.map(c => {
                    return { caballo: c, seleccion: false };
                });
                this.caballos = this.caballosRespaldo;
            }, error => {
                this.commonService.ShowErrorHttp(error, "Error consultando los caballos");
            });
    }
}
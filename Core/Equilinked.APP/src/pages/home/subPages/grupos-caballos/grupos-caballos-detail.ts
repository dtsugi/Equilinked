import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { NavController, NavParams, ToastController } from "ionic-angular";
import { CommonService } from "../../../../services/common.service";
import { GruposCaballosService } from "../../../../services/grupos-caballos.service";
import { SecurityService } from "../../../../services/security.service";
import { CaballoService } from "../../../../services/caballo.service";
import { UserSessionEntity } from "../../../../model/userSession";

@Component({
    selector: "grupos-caballos-detail",
    templateUrl: "./grupos-caballos-detail.html",
    styles: [".text-center {text-align: center;}"],
    providers: [CaballoService, CommonService, GruposCaballosService, SecurityService]
})
export class GruposCaballosDetailPage implements OnInit {

    //Para la lista de caballos que pertecen al grupo
    private gruposCaballos: Array<any>;
    private gruposCaballosRespaldo: Array<any>;


    //Para la lista de caballos de selección en la edición
    private caballos: Array<any>;
    private caballosRespaldo: Array<any>;

    private grupo: any;
    private grupoCaballosForm: any;
    private modoEdicion: boolean; //Para habilitar el div de edición
    private session: UserSessionEntity;

    private loadData: boolean = false;

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
        this.modoEdicion = false;
        this.gruposCaballosRespaldo = [];
        this.caballos = [];
    }

    ngOnInit(): void {
        this.session = this.securityService.getInitialConfigSession();
        this.grupo = this.navParams.get("grupo"); //seteamos el grupo que seleccionaron
        this.listCaballosByGrupo(); //Listamos los caballos del grupo
    }

    goBack(): void {
        this.navController.pop();
    }

    selectAll(): void {
        let selectAll: boolean = this.countCaballos() !== this.caballosRespaldo.length;
        this.caballosRespaldo.forEach(c => {
            c.seleccion = selectAll;
        });
    }

    filterGrupoCaballo(evt: any): void {
        this.gruposCaballos = this.gruposCaballosService.filterGruposCaballos(evt.target.value, this.gruposCaballosRespaldo);
    }

    filterCaballos(evt: any): void {
        this.caballos = this.gruposCaballosService.filterCaballo(evt.target.value, this.caballosRespaldo);
    }

    editGrupos(): void {
        this.commonService.showLoading("Procesando..");
        this.grupoCaballosForm = this.formBuilder.group({
            Descripcion: [this.grupo.Descripcion, Validators.required]
        });
        this.gruposCaballosService.getCaballosByPropietarioId(this.session.PropietarioId)
            .then(caballos => {
                let keysCaballos = this.gruposCaballosRespaldo.map(gc => gc.Caballo.ID);
                this.caballosRespaldo = caballos.map(c => {
                    return {
                        caballo: c,
                        seleccion: keysCaballos.indexOf(c.ID) > -1
                    };
                });
                this.caballos = this.caballosRespaldo;
                this.commonService.hideLoading();
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, "Error consultando los caballos del propietario");
            });
        this.modoEdicion = true;//Habilitamos la vista!
    }

    save(): void {
        this.grupo.Descripcion = this.grupoCaballosForm.value.Descripcion;
        this.grupo.Caballo = this.caballos.filter(c => c.seleccion).map(c => c.caballo);

        this.commonService.showLoading("Procesando..");
        this.gruposCaballosService.updateGrupo(this.grupo)
            .then(resp => {
                return this.gruposCaballosService.getCaballosByGroupId(this.grupo.ID);
            }).then(gruposCaballos => {
                this.grupo.GrupoCaballo = gruposCaballos;
                this.listCaballosByGrupo(); //Refrescamos la lista de caballos del grupo!
                this.commonService.hideLoading();
                this.modoEdicion = false; //Habilitamos la vista de detalle!
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, "Error al actualizar el grupo");
            });
    }

    private listCaballosByGrupo(): void {
        this.commonService.showLoading("Procesando..");
        this.gruposCaballosService.getCaballosByGroupId(this.grupo.ID)
            .then(caballos => { 
                this.gruposCaballosRespaldo = caballos;
                this.gruposCaballos = caballos;
                this.loadData = true;
                this.commonService.hideLoading();
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, "Error consultando los caballos del grupo");
            });
    }

    private countCaballos(): number {
        return this.caballosRespaldo.filter(c => c.seleccion).length;
    }
}
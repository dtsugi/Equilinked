import { Component, OnInit } from "@angular/core";
import { Events, NavController, NavParams } from "ionic-angular";
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { AlertaGrupoService } from "../../../../../../../services/alerta-grupo.service";
import { GruposCaballosService } from "../../../../../../../services/grupos-caballos.service";
import { CommonService } from "../../../../../../../services/common.service";
import { SeleccionCaballosPage } from "../../seleccion-caballos/seleccion-caballos";
import moment from "moment";

@Component({
    templateUrl: "edicion-nota.html",
    providers: [AlertaGrupoService, CommonService, GruposCaballosService]
})
export class EdicionNotaPage implements OnInit {

    private grupoId: number;
    private tipoAlerta: number;

    alertaGrupo: any;
    notaForm: FormGroup;

    constructor(
        private alertaGrupoService: AlertaGrupoService,
        private gruposCaballosService: GruposCaballosService,
        private commonService: CommonService,
        private events: Events,
        private navController: NavController,
        private navParams: NavParams
    ) {
    }

    ngOnInit(): void {
        this.grupoId = this.navParams.get("grupoId");
        this.tipoAlerta = this.navParams.get("tipoAlerta");
        this.alertaGrupo = this.navParams.get("alertaGrupo");

        this.initForm();
        if (!this.alertaGrupo.ID) {
            this.setCaballosForNota(); //asignarle los caballos del grupo
        }
    }

    goBack(): void {
        this.navController.pop();
    }

    selectCaballos(): void {
        let params: any = {
            grupoId: this.grupoId,
            alertaGrupo: this.alertaGrupo
        };
        this.navController.push(SeleccionCaballosPage, params);
    }

    save(): void {
        let alerta: any = this.alertaGrupo.Alerta;

        alerta.Titulo = this.notaForm.value.Titulo;
        alerta.Descripcion = this.notaForm.value.Descripcion;
        alerta.FechaNotificacion = this.notaForm.value.FechaNotificacion + " " + this.notaForm.value.HoraNotificacion + ":00";
        alerta.HoraNotificacion = this.notaForm.value.HoraNotificacion;
        alerta.Ubicacion = this.notaForm.value.Ubicacion;
        alerta.AlertaGrupal = true;

        this.commonService.showLoading("Procesando...");
        let res: any;
        if (!this.alertaGrupo.ID) {
            res = this.alertaGrupoService.saveAlerta(this.alertaGrupo);
        } else {
            res = this.alertaGrupoService.updateAlerta(this.alertaGrupo);
        }
        res.then(() => {
            this.commonService.hideLoading();
            if (this.alertaGrupo.ID) {
                this.events.publish("nota:refresh"); //Refrescamos el detalle de la nota seleccionada
            }
            this.events.publish("notas:refresh"); //Refrscamos la lista de notas del grupo
            this.navController.pop();
        }).catch(err => {
            this.commonService.ShowErrorHttp(err, "Error al guardar");
        });
    }

    private initForm(): void {
        let fecha: any = !this.alertaGrupo.Alerta.ID ? moment() : moment(this.alertaGrupo.Alerta.FechaNotificacion);
        this.alertaGrupo.Alerta.FechaNotificacion = fecha.format("YYYY-MM-DD");

        this.notaForm = new FormGroup({
            Titulo: new FormControl(this.alertaGrupo.Alerta.Titulo, [Validators.required]),
            Descripcion: new FormControl(this.alertaGrupo.Alerta.Descripcion, [Validators.required]),
            FechaNotificacion: new FormControl(this.alertaGrupo.Alerta.FechaNotificacion, [Validators.required]),
            HoraNotificacion: new FormControl(this.alertaGrupo.Alerta.HoraNotificacion, [Validators.required]),
            Ubicacion: new FormControl(this.alertaGrupo.Alerta.Ubicacion, [Validators.required])
        });
    }

    private setCaballosForNota(): void {
        this.commonService.showLoading("Procesando...");

        this.gruposCaballosService.getCaballosByGroupId(this.grupoId)
            .then(caballosGrupo => {
                this.alertaGrupo.Alerta.AlertaCaballo = caballosGrupo.map(cg => {
                    return {
                        Caballo_ID: cg.Caballo.ID
                    };
                });
                this.alertaGrupo.AllCaballos = true;
                this.commonService.hideLoading();
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, "Error al listar caballos del grupo");
            });
    }
}
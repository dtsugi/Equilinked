import { Component, OnInit } from "@angular/core";
import { Events, NavController, NavParams } from "ionic-angular";
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { AlertaGrupoService } from "../../../../../../../services/alerta-grupo.service";
import { GruposCaballosService } from "../../../../../../../services/grupos-caballos.service";
import { CommonService } from "../../../../../../../services/common.service";
import { SeleccionCaballosPage } from "../../seleccion-caballos/seleccion-caballos";
import { ConstantsConfig, Utils } from "../../../../../../../app/utils"
import moment from "moment";

@Component({
    templateUrl: "edicion-alerta.html",
    providers: [AlertaGrupoService, CommonService, GruposCaballosService]
})
export class EdicionAlertaPage implements OnInit {

    private grupoId: number;
    private tipoAlerta: number;
    alertaGrupo: any;
    labels: any;

    alertaForm: FormGroup;

    constructor(
        private alertaGrupoService: AlertaGrupoService,
        private gruposCaballosService: GruposCaballosService,
        private commonService: CommonService,
        private events: Events,
        private navController: NavController,
        private navParams: NavParams
    ) {
        this.labels = {};
    }

    ngOnInit(): void {
        this.grupoId = this.navParams.get("grupoId");
        this.tipoAlerta = this.navParams.get("tipoAlerta");
        this.alertaGrupo = this.navParams.get("alertaGrupo");

        this.applyLabels();
        this.initForm();
        if (!this.alertaGrupo.ID) {
            this.setCaballosForAlerta(); //asignarle los caballos del grupo
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

        alerta.FechaNotificacion = this.alertaForm.value.FechaNotificacion + " " + this.alertaForm.value.HoraNotificacion + ":00";
        alerta.HoraNotificacion = this.alertaForm.value.HoraNotificacion;
        alerta.NombreProfesional = this.alertaForm.value.NombreProfesional;
        alerta.Descripcion = this.alertaForm.value.Descripcion;
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
                this.events.publish("alerta:refresh"); //Refrescamos el detalle de la alerta seleccionada
            }
            this.events.publish("alertas:refresh"); //Refrescamos la lista de alertas
            this.navController.pop(); //pa atras!
        }).catch(err => {
            this.commonService.ShowErrorHttp(err, "Error al guardar");
        });
    }

    private initForm(): void {
        let fecha: any = !this.alertaGrupo.Alerta.ID ? moment() : moment(this.alertaGrupo.Alerta.FechaNotificacion);
        this.alertaGrupo.Alerta.FechaNotificacion = fecha.format("YYYY-MM-DD");

        this.alertaForm = new FormGroup({
            NombreProfesional: new FormControl(this.alertaGrupo.Alerta.NombreProfesional, [Validators.required]),
            FechaNotificacion: new FormControl(this.alertaGrupo.Alerta.FechaNotificacion, [Validators.required]),
            HoraNotificacion: new FormControl(this.alertaGrupo.Alerta.HoraNotificacion, [Validators.required]),
            Descripcion: new FormControl(this.alertaGrupo.Alerta.Descripcion, [Validators.required])
        });
    }

    private applyLabels(): void {
        switch (this.tipoAlerta) {
            case ConstantsConfig.ALERTA_TIPO_DENTISTA:
                this.labels.profesional = "dentista";
                break;
            case ConstantsConfig.ALERTA_TIPO_HERRAJE:
                this.labels.profesional = "herrero";
                break;
            case ConstantsConfig.ALERTA_TIPO_DESPARACITACION:
                this.labels.profesional = "aplicante";
                break;
        }
    }

    private setCaballosForAlerta(): void {
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
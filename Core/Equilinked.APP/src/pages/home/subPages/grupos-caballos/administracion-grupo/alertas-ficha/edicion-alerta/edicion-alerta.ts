import { Component, OnInit } from "@angular/core";
import { AlertController, ModalController, Events, NavController, NavParams } from "ionic-angular";
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { AlertaService } from "../../../../../../../services/alerta.service";
import { AlertaGrupoService } from "../../../../../../../services/alerta-grupo.service";
import { GruposCaballosService } from "../../../../../../../services/grupos-caballos.service";
import { SecurityService } from "../../../../../../../services/security.service";
import { CommonService } from "../../../../../../../services/common.service";
import { RecordatorioService } from '../../../../../../../services/recordatorio.service';
import { UserSessionEntity } from "../../../../../../../model/userSession";
import { EquiModalCaballos } from "../../../../../../../utils/equi-modal-caballos/equi-modal-caballos";
import { EquiModalRecordatorio } from "../../../../../../../utils/equi-modal-recordatorio/equi-modal-recordatorio";
import { ConstantsConfig, Utils } from "../../../../../../../app/utils"
import moment from "moment";
import { LanguageService } from '../../../../../../../services/language.service';

@Component({
    templateUrl: "edicion-alerta.html",
    providers: [LanguageService, AlertaService, AlertaGrupoService, CommonService, GruposCaballosService, RecordatorioService, SecurityService]
})
export class EdicionAlertaPage implements OnInit {

    private session: UserSessionEntity;
    private grupoId: number;
    private tipoAlerta: number;

    labels: any = {};
    alerta: any;
    recordatorios: Array<any>;
    alertaForm: FormGroup;

    constructor(
        private alertController: AlertController,
        private alertaService: AlertaService,
        private alertaGrupoService: AlertaGrupoService,
        private gruposCaballosService: GruposCaballosService,
        private commonService: CommonService,
        private events: Events,
        private modalController: ModalController,
        private navController: NavController,
        private navParams: NavParams,
        private recordatorioService: RecordatorioService,
        private securityService: SecurityService,
        private languageService: LanguageService
    ) {
        languageService.loadLabels().then(labels => this.labels = labels);
        this.recordatorios = new Array<any>();
        this.labels = {};
    }

    ngOnInit(): void {
        this.session = this.securityService.getInitialConfigSession();
        this.grupoId = this.navParams.get("grupoId");
        this.tipoAlerta = this.navParams.get("tipoAlerta");
        this.alerta = this.navParams.get("alerta");

        this.initForm();
        this.getRecordatorios();
    }

    goBack(): void {
        this.navController.pop();
    }

    viewRecordatorios(): void {
        let inputs: Array<any> = this.recordatorios.map(r => {
            return { type: "radio", label: r.Descripcion, value: r }
        });
        this.alertController.create({
            inputs: inputs,
            buttons: [
                { text: this.labels["PANT020_BTN_CAN"], role: "cancel" },
                { text: this.labels["PANT020_BTN_ACE"], handler: this.callbackViewRecordatorios }
            ]
        }).present();
    }

    removeRecordatorio(): void {
        this.alerta.AlertaRecordatorio = new Array<any>();
    }

    selectCaballos(): void {
        let params: any = {
            caballosInput: this.alerta.AlertaCaballo.map(ac => {
                return { ID: ac.Caballo_ID };
            }),
            funcionCaballos: this.gruposCaballosService.getCaballosByGroupId(this.grupoId)
        };

        let modal = this.modalController.create(EquiModalCaballos, params);
        modal.onDidDismiss(this.callbackAddCaballos);
        modal.present();
    }

    save(): void {
        let alerta: any = this.alerta;

        alerta.FechaNotificacion = this.alertaForm.value.FechaNotificacion + " " + this.alertaForm.value.HoraNotificacion + ":00";
        alerta.HoraNotificacion = this.alertaForm.value.HoraNotificacion;
        alerta.NombreProfesional = this.alertaForm.value.NombreProfesional;
        alerta.Descripcion = this.alertaForm.value.Descripcion;
        alerta.Activa = this.alertaForm.value.Activa;
        alerta.AlertaGrupal = true;

        this.commonService.showLoading(this.labels["PANT020_BTN_PRO"]);
        let res: any;
        if (!this.alerta.ID) {
            res = this.alertaService.saveAlerta(this.session.PropietarioId, this.alerta);
        } else {
            res = this.alertaService.updateAlerta(this.session.PropietarioId, this.alerta);
        }
        res.then(() => {
            this.commonService.hideLoading();
            if (this.alerta.ID) {
                this.events.publish("alerta:refresh"); //Refrescamos el detalle de la alerta seleccionada
            }
            this.events.publish("notificaciones:refresh");//Actualimamos area de ontificaciones
            this.events.publish("alertas:refresh"); //Refrescamos la lista de alertas
            this.navController.pop(); //pa atras!
        }).catch(err => {
            this.commonService.ShowErrorHttp(err, this.labels["PANT020_MSG_ERRGU"]);
        });
    }

    private initForm(): void {
        if (this.alerta.ID) {
            if (this.alerta.AlertaRecordatorio) {
                this.alerta.AlertaRecordatorio.forEach(a => {
                    this.buildLabelRecordatorio(a);
                });
            }
        }

        let fecha: any = !this.alerta.ID ? moment() : moment(new Date(this.alerta.FechaNotificacion));
        this.alerta.FechaNotificacion = fecha.format("YYYY-MM-DD");
        this.alerta.HoraNotificacion = fecha.format("HH:mm");
        this.alertaForm = new FormGroup({
            NombreProfesional: new FormControl(this.alerta.NombreProfesional, [Validators.required]),
            FechaNotificacion: new FormControl(this.alerta.FechaNotificacion, [Validators.required]),
            HoraNotificacion: new FormControl(this.alerta.HoraNotificacion, [Validators.required]),
            Descripcion: new FormControl(this.alerta.Descripcion, [Validators.required]),
            Activa: new FormControl(this.alerta.Activa)
        });
    }

    private getRecordatorios(): void {
        this.commonService.showLoading(this.labels["PANT020_BTN_PRO"]);
        this.recordatorioService.getAllRecordatorios()
            .then(recordatorios => {
                this.recordatorios = recordatorios;
                if (!this.alerta.ID) {
                    this.getCaballosDefaultGrupo();
                } else {
                    this.commonService.hideLoading();
                }
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, this.labels["PANT020_MSG_ERRCAR"]);
            });
    }

    private getCaballosDefaultGrupo(): void {
        this.gruposCaballosService.getCaballosByGroupId(this.grupoId)
            .then(caballosGrupo => {
                this.alerta.AlertaCaballo = caballosGrupo.map(c => {
                    return {
                        Caballo_ID: c.ID
                    };
                });
                this.alerta.AllCaballos = true;
                this.commonService.hideLoading();
            }).catch(err => {
                this.commonService.ShowErrorHttp(err, this.labels["PANT020_MSG_ERRCAR"]);
            });
    }

    callbackAddCaballos = (caballos) => {
        let alertaCaballo: any;
        let mapAlertaCaballo: Map<number, any> = new Map<number, any>();

        for (let ac of this.alerta.AlertaCaballo) {
            mapAlertaCaballo.set(ac.Caballo_ID, ac);
        }
        if (caballos) {
            this.alerta.AlertaCaballo = new Array<any>();
            for (let c of caballos) {
                alertaCaballo = mapAlertaCaballo.has(c.ID) ? mapAlertaCaballo.get(c.ID) : { Caballo_ID: c.ID };
                this.alerta.AlertaCaballo.push(alertaCaballo);
            }
        }
    }

    callbackViewRecordatorios = (data) => {
        let recordatorio: any;
        if (data.UnidadTiempo) {
            recordatorio = {
                ValorTiempo: data.ValorTiempo,
                UnidadTiempo_ID: data.UnidadTiempo_ID,
                UnidadTiempo: data.UnidadTiempo
            };
            this.addRecordatorio(recordatorio);
        } else {
            let params: any = {
                funcionUnidadesTiempo: this.recordatorioService.getAllUnidadesTiempo()
            };
            let modal = this.modalController.create(EquiModalRecordatorio, params);
            modal.onDidDismiss(recordatorioPersonalizado => {
                if (recordatorioPersonalizado) {
                    this.addRecordatorio(recordatorioPersonalizado);//lo agregamos a la alerta
                }
            });
            modal.present(); //Abrir!
        }
    }

    private addRecordatorio(recordatorio: any): void {
        this.buildLabelRecordatorio(recordatorio);
        this.alerta.AlertaRecordatorio.push(recordatorio);
    }

    private buildLabelRecordatorio(recordatorio: any): void {
        recordatorio.Descripcion = recordatorio.ValorTiempo + " " + recordatorio.UnidadTiempo.Descripcion;
        recordatorio.UnidadTiempo = null;
    }
}
import { Component, OnDestroy, OnInit } from "@angular/core";
import { AlertController, Events, ModalController, NavController, NavParams } from "ionic-angular";
import { AlertaService } from "../../../services/alerta.service";
import { CaballoService } from "../../../services/caballo.service";
import { GruposCaballosService } from "../../../services/grupos-caballos.service";
import { CommonService } from "../../../services/common.service";
import { RecordatorioService } from "../../../services/recordatorio.service";
import { SecurityService } from "../../../services/security.service";
import { Alerta } from "../../../model/alerta";
import { UserSessionEntity } from "../../../model/userSession";
import { ConstantsConfig } from "../../../app/utils";
import { EquiModalCaballos } from "../../../utils/equi-modal-caballos/equi-modal-caballos";
import { EquiModalGrupos } from "../../../utils/equi-modal-grupos/equi-modal-grupos";
import { EquiModalRecordatorio } from "../../../utils/equi-modal-recordatorio/equi-modal-recordatorio";
import moment from "moment";

@Component({
    templateUrl: "edicion-notificacion.html",
    providers: [AlertaService, CaballoService, CommonService, GruposCaballosService, RecordatorioService, SecurityService]
})
export class EdicionNotificacionGeneralPage implements OnDestroy, OnInit {

    private session: UserSessionEntity;
    
    alerta: Alerta;
    tiposAlerta: Array<any>;
    recordatorios: Array<any>;

    constructor(
        private alertController: AlertController,
        private alertaService: AlertaService,
        private events: Events,
        private caballoService: CaballoService,
        private commonService: CommonService,
        private gruposCaballosService: GruposCaballosService,
        private modalController: ModalController,
        public navController: NavController,
        public navParams: NavParams,
        private recordatorioService: RecordatorioService,
        private securityService: SecurityService
    ) {
        this.alerta = new Alerta();
        this.tiposAlerta = new Array<any>();
    }

    ngOnInit(): void {
        this.session = this.securityService.getInitialConfigSession();
        this.alerta = this.navParams.get("alerta");
        if (!this.alerta) {
            this.alerta = new Alerta();
        } else {
            let di = new Date(this.alerta.FechaNotificacion);
            this.alerta.FechaNotificacion = moment(di).format("YYYY-MM-DD");

            if (this.alerta.Tipo == ConstantsConfig.ALERTA_TIPO_EVENTOS) {
                let df = new Date(this.alerta.FechaFinal);
                this.alerta.FechaFinal = moment(df).format("YYYY-MM-DD");
                this.alerta.HoraFinal = moment(df).format("HH:mm:ss");
            }
            if (this.alerta.AlertaRecordatorio) {
                this.alerta.AlertaRecordatorio.forEach(a => {
                    this.buildLabelRecordatorio(a);
                });
            }
        }
        this.loadPage();//Cargar todo lo que necesita la pantalla
    }

    ngOnDestroy(): void {
    }

    goBack(): void {
        this.navController.pop();
    }

    changeTipoAlerta(evt: any): void {
        this.alerta = new Alerta();
        this.alerta.Propietario_ID = this.session.PropietarioId;
        this.alerta.Tipo = evt;//Asignar el tipo elegido
        this.alerta.FechaNotificacion = moment().format("YYYY-MM-DD");
        this.alerta.HoraNotificacion = moment().format("HH:mm:ss");
    }

    viewRecordatorios(): void {
        let inputs: Array<any> = this.recordatorios.map(r => {
            return { type: "radio", label: r.Descripcion, value: r }
        });
        this.alertController.create({
            inputs: inputs,
            buttons: [
                { text: "Cancelar", role: "cancel" },
                { text: "Aceptar", handler: this.callbackViewRecordatorios() }
            ]
        }).present(); //abrete ZeZaMoOo!!
    }

    removeRecordatorio(): void {
        this.alerta.AlertaRecordatorio = new Array<any>();
    }

    addCaballos(): void {
        let params: any = {
            caballosInput: this.alerta.AlertaCaballo.map(ac => {
                return { ID: ac.Caballo_ID };
            }),
            funcionCaballos: this.caballoService
                .getAllSerializedByPropietarioId(this.session.PropietarioId)
                .toPromise()
        };

        let modal = this.modalController.create(EquiModalCaballos, params);
        modal.onDidDismiss(this.callbackAddCaballos());
        modal.present(); //Abrir!
    }

    addGrupos(): void {
        let params: any = {
            gruposInput: this.alerta.AlertaGrupo.map(ag => {
                return { ID: ag.Grupo_ID };
            }),
            funcionGrupos: this.gruposCaballosService
                .getAllGruposByPropietarioId(this.session.PropietarioId)
        };

        let modal = this.modalController.create(EquiModalGrupos, params);
        modal.onDidDismiss(this.callbackAddGrupos());
        modal.present();
    }

    /*Se requiere un ajuste posterior para menejar correctamente la hora */
    save(): void {
        console.info("Save!!!");
        console.log(this.alerta);
        this.alerta.FechaNotificacion = this.alerta.FechaNotificacion + " " + this.alerta.HoraNotificacion;
        if (this.alerta.Tipo == ConstantsConfig.ALERTA_TIPO_EVENTOS) {
            this.alerta.FechaFinal = this.alerta.FechaFinal + " " + this.alerta.HoraFinal;
        }

        switch (this.alerta.Tipo) { //El titulo por el momento fijo
            case ConstantsConfig.ALERTA_TIPO_DENTISTA:
                this.alerta.Titulo = "Visita con dentista";
                break;
            case ConstantsConfig.ALERTA_TIPO_HERRAJE:
                this.alerta.Titulo = "Visita con herrero";
                break;
            case ConstantsConfig.ALERTA_TIPO_DESPARACITACION:
                this.alerta.Titulo = "Visita con aplicante";
                break;
        }

        let promise;
        if (this.alerta.ID) {
            promise = this.alertaService.updateAlerta(this.session.PropietarioId, this.alerta);
        } else {
            promise = this.alertaService.saveAlerta(this.session.PropietarioId, this.alerta);
        }

        this.commonService.showLoading("Procesando...");
        promise.then(() => {
            this.commonService.hideLoading();
            this.navController.pop().then(() => {
                if (this.alerta.ID) {
                    this.events.publish("notificacion:refresh");
                }
                this.events.publish("notificaciones:refresh");
            });
        }).catch(err => {
            this.commonService.ShowErrorHttp(err, "Ocurrió un error al guardar");
        });
    }

    private callbackViewRecordatorios(): Function {
        return (data) => {
            console.info("Aceptaron el dialogo de recordatorios");
            console.info(data);
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
                    this.addRecordatorio(recordatorioPersonalizado);//lo agregamos a la alerta
                });
                modal.present(); //Abrir!
            }
        };
    }

    private addRecordatorio(recordatorio: any): void {
        this.buildLabelRecordatorio(recordatorio);
        this.alerta.AlertaRecordatorio.push(recordatorio);
    }

    private buildLabelRecordatorio(recordatorio: any): void {
        recordatorio.Descripcion = recordatorio.ValorTiempo + " " + recordatorio.UnidadTiempo.Descripcion;
        recordatorio.UnidadTiempo = null;
    }

    private callbackAddCaballos(): Function {
        return (caballos) => {
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
        };
    }

    private callbackAddGrupos(): Function {
        return (grupoos) => {
            let mapAlertaGrupo: Map<number, any> = new Map<number, any>();
            for (let ag of this.alerta.AlertaGrupo) {
                mapAlertaGrupo.set(ag.Grupo_ID, ag);
            }
            if (grupoos) { //Actualizo los grupos seleccionados a la alerta
                let alertaGrupo: any;
                let gruposIds: Array<number> = new Array<number>();

                this.alerta.AlertaGrupo = new Array<any>();
                grupoos.forEach(g => {
                    alertaGrupo = mapAlertaGrupo.has(g.ID) ? mapAlertaGrupo.get(g.ID) : { Grupo_ID: g.ID };
                    this.alerta.AlertaGrupo.push(alertaGrupo);

                    if (!mapAlertaGrupo.has(g.ID)) {
                        gruposIds.push(g.ID);
                    }
                });

                //Ahora hay que asignar a la selección los caballos de los grupos que han sido seleccioandos
                if (gruposIds.length > 0) {
                    this.gruposCaballosService.getCaballosByGruposIds(this.session.PropietarioId, gruposIds)
                        .then(caballos => { //Ahora hay que agregar los caballos que no están
                            let idsCaballos: Array<any> = this.alerta.AlertaCaballo.map(ag => ag.Caballo_ID);
                            let nuevosCaballos: Array<any> = caballos.filter(c => idsCaballos.indexOf(c.ID) == -1)
                                .map(c => { return { Caballo_ID: c.ID }; });
                            if (nuevosCaballos.length > 0) {
                                this.alerta.AlertaCaballo.push.apply(this.alerta.AlertaCaballo, nuevosCaballos);//Agrega a la lista existen los nuevos caballos
                            }
                        }).catch(err => {
                            this.commonService.ShowErrorHttp(err, "Error obteniendo los caballos de los grupos seleccionados");
                        });
                }
            }
        };
    }

    private loadPage(): void {
        this.commonService.showLoading("Procesando...");
        this.loadTiposAlerta().then(tiposAlerta => {
            this.tiposAlerta = tiposAlerta;
            return this.recordatorioService.getAllRecordatorios();
        }).then(recordatorios => {
            this.recordatorios = recordatorios;

            this.commonService.hideLoading();
        }).catch(err => {
            this.commonService.ShowErrorHttp(err, "Ocurrió un error al cargar la pantalla");
        });
    }

    private loadTiposAlerta(): Promise<Array<any>> {
        return new Promise((resolve, reject) => {
            let tiposAlerta: Array<any> = [
                { tipo: ConstantsConfig.ALERTA_TIPO_EVENTOS, descripcion: "Eventos" },
                { tipo: ConstantsConfig.ALERTA_TIPO_HERRAJE, descripcion: "Herraje" },
                { tipo: ConstantsConfig.ALERTA_TIPO_DESPARACITACION, descripcion: "Desparasitaciones" },
                { tipo: ConstantsConfig.ALERTA_TIPO_DENTISTA, descripcion: "Dentista" },
                { tipo: ConstantsConfig.ALERTA_TIPO_NOTASVARIAS, descripcion: "Nota" }
            ]
            resolve(tiposAlerta);
        });
    }
}
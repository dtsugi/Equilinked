import {Component, OnInit} from "@angular/core";
import {AlertController, ModalController, Events, NavController, NavParams} from "ionic-angular";
import {Validators, FormGroup, FormControl} from "@angular/forms";
import {AlertaService} from "../../../../../../../services/alerta.service";
import {AlertaGrupoService} from "../../../../../../../services/alerta-grupo.service";
import {GruposCaballosService} from "../../../../../../../services/grupos-caballos.service";
import {SecurityService} from "../../../../../../../services/security.service";
import {CommonService} from "../../../../../../../services/common.service";
import {RecordatorioService} from '../../../../../../../services/recordatorio.service';
import {NotificacionLocalService} from '../../../../../../../services/notificacion-local.service';
import {UserSessionEntity} from "../../../../../../../model/userSession";
import {EquiModalCaballos} from "../../../../../../../utils/equi-modal-caballos/equi-modal-caballos";
import {EquiModalRecordatorio} from "../../../../../../../utils/equi-modal-recordatorio/equi-modal-recordatorio";
import moment from "moment";
import {LanguageService} from '../../../../../../../services/language.service';
import {Utils} from '../../../../../../../app/utils';

@Component({
  templateUrl: "edicion-nota.html",
  providers: [LanguageService, AlertaService, AlertaGrupoService, CommonService, GruposCaballosService, RecordatorioService, SecurityService]
})
export class EdicionNotaPage implements OnInit {
  private session: UserSessionEntity;
  private grupoId: number;
  private alertaResp: any;
  labels: any = {};
  recordatorios: Array<any>;
  alerta: any;
  notaForm: FormGroup;

  constructor(private alertController: AlertController,
              private alertaService: AlertaService,
              private gruposCaballosService: GruposCaballosService,
              private commonService: CommonService,
              private events: Events,
              private modalController: ModalController,
              private navController: NavController,
              private navParams: NavParams,
              private notificacionLocalService: NotificacionLocalService,
              private recordatorioService: RecordatorioService,
              private securityService: SecurityService,
              private languageService: LanguageService) {
    languageService.loadLabels().then(labels => this.labels = labels);
  }

  ngOnInit(): void {
    this.session = this.securityService.getInitialConfigSession();
    this.grupoId = this.navParams.get("grupoId");
    this.alerta = this.navParams.get("alerta");
    this.initForm();
    this.getRecordatorios();
  }

  goBack(): void {
    this.navController.pop();
  }

  viewRecordatorios(): void {
    let inputs: Array<any> = this.recordatorios.map(r => {
      return {type: "radio", label: r.Descripcion, value: r}
    });
    this.alertController.create({
      inputs: inputs,
      buttons: [
        {text: this.labels["PANT020_BTN_CAN"], role: "cancel"},
        {text: this.labels["PANT020_BTN_ACE"], handler: this.callbackViewRecordatorios}
      ]
    }).present();
  }

  removeRecordatorio(): void {
    this.alerta.AlertaRecordatorio = new Array<any>();
  }

  selectCaballos(): void {
    let self = this;
    let params: any = {
      caballosInput: this.alerta.AlertaCaballo.map(ac => {
        return {ID: ac.Caballo_ID};
      }),
      functionFilter: function (parameters) {
        return self.gruposCaballosService.getCaballosByGroupId(self.grupoId, parameters)
      }
    };
    let modal = this.modalController.create(EquiModalCaballos, params);
    modal.onDidDismiss(this.callbackAddCaballos);
    modal.present();
  }

  save(): void {
    let alerta: any = this.alerta;
    alerta.Titulo = this.notaForm.value.Titulo;
    alerta.Descripcion = this.notaForm.value.Descripcion;
    alerta.FechaNotificacion = this.notaForm.value.FechaNotificacion + " " + this.notaForm.value.HoraNotificacion;
    alerta.HoraNotificacion = this.notaForm.value.HoraNotificacion;
    alerta.Ubicacion = this.notaForm.value.Ubicacion;
    alerta.Activa = this.notaForm.value.Activa;
    alerta.AlertaGrupal = true;
    this.commonService.showLoading(this.labels["PANT020_BTN_PRO"]);
    let res: any;
    if (!this.alerta.ID) {
      res = this.alertaService.saveAlerta(this.session.PropietarioId, this.alerta);
    } else {
      res = this.alertaService.updateAlerta(this.session.PropietarioId, this.alerta);
    }
    res.then((idnotificacion) => {
      let alertaAct = null, alertaAnt = null;
      if (this.alerta.ID) {
        alertaAct = this.alerta;
        alertaAnt = this.alertaResp;
      } else {
        this.alerta.ID = idnotificacion;
        alertaAct = this.alerta;
      }
      try {
        this.notificacionLocalService.saveLocalNotificacionAlert(alertaAct, alertaAnt);
        this.commonService.hideLoading();
        this.navController.pop().then(() => {
          this.events.publish("nota:refresh"); //Refrescamos el detalle de la nota seleccionada
          this.events.publish("notas:refresh"); //Refrscamos la lista de notas del grupo
          this.events.publish("notificacion:refresh");//para refrescar el detalle de la pantalla alertas
          this.events.publish("notificaciones:refresh");//refrescar
          this.events.publish("calendario:alerta:refresh");//refrescar alerta seleccionada en calendario
          this.events.publish("calendario:refresh");//refrescar alertas calendario
        });
      } catch (err) {
        console.log("Error al guardar notificacion local:" + JSON.stringify(err));
        this.commonService.ShowErrorHttp(err, this.labels["PANT038_MSG_ERRGU"]);
      }
    }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels["PANT020_MSG_ERRGU"]);
    });
  }

  private initForm(): void {
    if (this.alerta.ID) {
      this.alertaResp = JSON.parse(JSON.stringify(this.alerta));
      if (this.alerta.AlertaRecordatorio) {
        this.alerta.AlertaRecordatorio.forEach(a => {
          this.buildLabelRecordatorio(a);
        });
      }
    }
    let fecha: any = !this.alerta.ID ? moment() : Utils.getMomentFromAlertDate(this.alerta.FechaNotificacion);
    this.alerta.FechaNotificacion = fecha.format("YYYY-MM-DD");
    this.alerta.HoraNotificacion = fecha.format("HH:mm");
    this.notaForm = new FormGroup({
      Titulo: new FormControl(this.alerta.Titulo, [Validators.required]),
      Descripcion: new FormControl(this.alerta.Descripcion, [Validators.required]),
      FechaNotificacion: new FormControl(this.alerta.FechaNotificacion, [Validators.required]),
      HoraNotificacion: new FormControl(this.alerta.HoraNotificacion, [Validators.required]),
      Ubicacion: new FormControl(this.alerta.Ubicacion, [Validators.required]),
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
    this.gruposCaballosService.getCaballosByGroupId(this.grupoId, null)
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
        alertaCaballo = mapAlertaCaballo.has(c.ID) ? mapAlertaCaballo.get(c.ID) : {Caballo_ID: c.ID};
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
    //recordatorio.UnidadTiempo = null;
  }
}

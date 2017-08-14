import {Component} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {NavController, NavParams} from 'ionic-angular';
import {Utils} from '../../../app/utils'
import {CommonService} from '../../../services/common.service';
import {AlertaService} from '../../../services/alerta.service';
import {CaballoService} from '../../../services/caballo.service';
import {SecurityService} from '../../../services/security.service';
import {AlertaCaballoService} from '../../../services/alerta.caballo.service';
import {Alerta} from '../../../model/alerta';
import {UserSessionEntity} from '../../../model/userSession';
import {NotificacionesPage} from '../notificaciones';

@Component({
  templateUrl: 'notificaciones-edit.html',
  providers: [CommonService, AlertaService, CaballoService, SecurityService, AlertaCaballoService]
})
export class NotificacionesEditPage {
  alertaEntity: Alerta;
  isUpdate: boolean = false;
  isFromNotas: boolean = false;
  disableFromNotas: boolean = false;
  showId: boolean = false;
  selectCaballos = [];
  tiposAlertaList = [];
  formNotificaciones: any;
  session: UserSessionEntity;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              private _commonService: CommonService,
              private _alertaService: AlertaService,
              private _caballoService: CaballoService,
              private _securityService: SecurityService,
              private _alertaCaballoService: AlertaCaballoService) {
  }

  ngOnInit() {
    this.alertaEntity = new Alerta();
    this.session = this._securityService.getInitialConfigSession();
    if (this._commonService.IsValidParams(this.navParams, ["alertaEntity", "isFromNotas", "isUpdate", "callbackController"])) {
      this.alertaEntity = this.navParams.get("alertaEntity");
      this.isFromNotas = this.navParams.get("isFromNotas");
      this.isUpdate = this.navParams.get("isUpdate");
      if (this.alertaEntity.ID > 0) {
        console.log("ID:", this.alertaEntity.ID);
        this.getAllCaballosRelacionados(this.alertaEntity.ID);
      }
      this.disableFromNotas = this.isFromNotas;
      if (!this.isUpdate) {
        this.alertaEntity.FechaNotificacion = Utils.getDateNow().ToString();
      }
    }
    // this.alertaEntity = this.navParams.data.alerta;
    // if (this.alertaEntity != undefined) {
    //     this.isUpdate = true;
    // }
    // else {
    //     this.isUpdate = false;
    //     this.alertaEntity.FechaNotificacion = Utils.getDateNow().ToString();
    // }
    this.getTiposAlerta();
    this.getAllCaballo();
    this.initForm();
  }

  initForm() {
    console.log("ALERTA:", this.alertaEntity);
    this.formNotificaciones = this.formBuilder.group({
      Id: [this.alertaEntity.ID],
      Titulo: [this.alertaEntity.Titulo, Validators.required],
      FechaNotificacion: [this.alertaEntity.FechaNotificacion, Validators.required],
      HoraNotificacion: [this.alertaEntity.HoraNotificacion, Validators.required],
      Tipo: [this.alertaEntity.Tipo, Validators.required],
      Activa: [this.alertaEntity.Activa],
      Descripcion: [this.alertaEntity.Descripcion, Validators.required],
      CaballosList: [(this.alertaEntity.CaballosList)],
      AlertaGrupal: [false]
    });
  }

  getAllCaballo() {
    this._caballoService.getAllComboBoxByPropietarioId(this.session.PropietarioId)
      .subscribe(res => {
        console.log(res);
        this.selectCaballos = res;
        this.reloadForm();
      }, error => {
        console.log(error);
        this._commonService.ShowErrorHttp(error, "Error cargando los caballos");
      });
  }

  getTiposAlerta() {
    this._alertaService.getAllTiposAlerta()
      .subscribe(res => {
        console.log(res);
        this.tiposAlertaList = res;
        this.reloadForm();
      }, error => {
        console.log(error);
        this._commonService.ShowErrorHttp(error, "Error cargando los tipos de alertas");
      });
  }

  saveNotificacion() {
    if (this.isUpdate) {
      this._commonService.showLoading("Modificando..");
    } else {
      this._commonService.showLoading("Guardando..");
    }
    console.log(this.formNotificaciones.value);
    this._alertaService.save(this.formNotificaciones.value)
      .subscribe(res => {
        console.log(res);
        this._commonService.hideLoading();
        this._commonService.ShowInfo("El registro se modifico exitosamente");
        this.updateCallbackController();
        if (this.isFromNotas) {
          this.navCtrl.pop();
          // this.navCtrl.popTo(NotificacionesViewPage,
          // { notificacionSelected: this.formNotificaciones.value },
          // null,NotificacionesViewPage.apply(this,'myCallbackFunction'));
        } else {
          if (this.isUpdate) {
            this.navCtrl.pop();
          } else {
            this.navCtrl.push(NotificacionesPage);
          }
        }
      }, error => {
        console.log(error);
        this._commonService.hideLoading();
        this._commonService.ShowInfo("Error al modificar el registro");
      });
  }

  getAllCaballosRelacionados(alertaId: number) {
    this._alertaCaballoService.getAllCaballoIdByAlertaId(alertaId)
      .subscribe(res => {
        console.log(res);
        this.alertaEntity.CaballosList = res;
        this.reloadForm();
      }, error => {
        console.log(error);
        this._commonService.ShowErrorHttp(error, "Error cargando los caballos relacionados a la notificacion");
      });
  }

  reloadForm() {
    this.initForm();
  }

  updateCallbackController() {
    let callbackController = this.navParams.get("callbackController");
    callbackController.reloadController();
  }
}

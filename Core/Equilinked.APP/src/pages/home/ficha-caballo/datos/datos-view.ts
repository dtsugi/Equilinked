import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Events, NavController, NavParams} from 'ionic-angular';
import {CommonService} from '../../../../services/common.service';
import {SecurityService} from '../../../../services/security.service';
import {CaballoService} from '../../../../services/caballo.service';
import {ExtendedCaballoService} from '../../../../services/extended.caballo.service';
import {Caballo} from '../../../../model/caballo';
import {AdminCaballosInsertPage} from '../../admin-caballos/admin-caballos-insert';
import moment from "moment";
import {LanguageService} from '../../../../services/language.service';

@Component({
  templateUrl: 'datos-view.html',
  providers: [LanguageService, CommonService, SecurityService, CaballoService, ExtendedCaballoService]
})
export class DatosViewPage implements OnInit, OnDestroy {
  labels: any = {};
  form: any;
  idCaballo: number;
  nombreCaballo: string = "";
  caballoEntity: Caballo;
  generoList = [];
  pelajeList = [];
  protectores = [];
  paises = [];
  age: string;

  constructor(private events: Events,
              public navCtrl: NavController,
              public navParams: NavParams,
              private _commonService: CommonService,
              private _caballoService: CaballoService,
              private _extendedCaballoService: ExtendedCaballoService,
              private formBuilder: FormBuilder,
              private languageService: LanguageService) {
    this.age = "";
  }

  ngOnInit(): void {
    console.info("En el onInit");
    this.caballoEntity = new Caballo();
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
      this.initForm();
      if (this._commonService.IsValidParams(this.navParams, ["idCaballoSelected", "nombreCaballoSelected"])) {
        this.idCaballo = this.navParams.get("idCaballoSelected");
        this.nombreCaballo = this.navParams.get("nombreCaballoSelected");
        this.getPelajeList();
        this.getGeneroList();
        this.getAllProtectores();
        this.getAllPaises();
        this.getCaballo(this.idCaballo);
      }
    });
    this.addEvents(); //Registrsamos eventos
  }

  ngOnDestroy(): void {
    this.removeEvents(); //Elimimos los eventos
  }

  initForm() {
    console.log("CABALLO:", this.caballoEntity);
    this.form = this.formBuilder.group({
      Nombre: [this.caballoEntity.Nombre],
      NombrePropietario: [this.caballoEntity.NombrePropietario],
      Genero_ID: [this.caballoEntity.Genero_ID],
      Pelaje_ID: [this.caballoEntity.Pelaje_ID],
      FechaNacimiento: [this.caballoEntity.FechaNacimiento],
      NombreMadre: [this.caballoEntity.GenealogiaCaballo.Madre],
      NombrePadre: [this.caballoEntity.GenealogiaCaballo.Padre],
      NombreCriador: [this.caballoEntity.CriadorCaballo.Nombre],
      PaisCriador: [this.caballoEntity.CriadorCaballo.Pais_ID],
      ADN: [this.caballoEntity.ADN],
      NumeroChip: [this.caballoEntity.NumeroChip],
      NumeroId: [this.caballoEntity.NumeroId],
      Marcas: [this.caballoEntity.Marcas],
      EstadoFEN: [this.caballoEntity.EstadoFEN],
      NumeroFEN: [this.caballoEntity.NumeroFEN],
      EstadoFEI: [this.caballoEntity.EstadoFEI],
      NumeroFEI: [this.caballoEntity.NumeroFEI],
      Protector_ID: [this.caballoEntity.Protector_ID],
      Observaciones: [this.caballoEntity.Observaciones],
      Embocadura: [this.caballoEntity.Embocadura],
      ExtrasDeCabezada: [this.caballoEntity.ExtrasDeCabezada],
      NombreResponsable: [this.caballoEntity.ResponsableCaballo.Nombre],
      TelefonoResponsable: [this.caballoEntity.ResponsableCaballo.Telefono],
      CorreoResponsable: [this.caballoEntity.ResponsableCaballo.CorreoElectronico]
    });
    this.calculateAge(this.caballoEntity.FechaNacimiento);//Ajustar la edad!
  }

  private getCaballo(caballoId) {
    this._caballoService.getSerializedById(caballoId)
      .toPromise()
      .then(caballo => {
        console.log(caballo);
        this.caballoEntity = caballo;
        this.nombreCaballo = this.caballoEntity.Nombre;
        this.initForm();
      }).catch(err => {
      this._commonService.ShowErrorHttp(err, this.labels["PANT004_MSG_CACAERR"]);
    });
  }

  private calculateAge(dateSelected: string): void {
    let date = moment(dateSelected);
    this.age = "";
    if (moment().isAfter(date)) {
      let years: number = moment().diff(date, "years");
      let months: number = moment().diff(date, "months");
      months = months - (years * 12);
      this.age = (years > 1 ? years + " " + this.labels["PANT004_LBL_NAAN"] : (years == 1 ? "1 " + this.labels["PANT004_LBL_NAAN"] : ""));
      this.age = this.age + (months > 1 ? " " + months + " " + this.labels["PANT004_LBL_NAME"] : (months == 1 ? " 1 " + this.labels["PANT004_LBL_NAME"] : ""));
    }
    console.info(this.age);
  }

  private getGeneroList() {
    this._extendedCaballoService.getAllGeneroComboBox()
      .subscribe(res => {
        console.log(res);
        this.generoList = res;
      }, error => {
        console.error(error);
      });
  }

  private getPelajeList() {
    this._extendedCaballoService.getAllPelajeComboBox()
      .subscribe(res => {
        console.log(res);
        this.pelajeList = res;
      }, error => {
      });
  }

  private getAllProtectores(): void {
    this._extendedCaballoService.getAllProtector()
      .then(protectores => {
        this.protectores = protectores;
      }).catch(err => {
      console.error(err);
    });
  }

  private getAllPaises(): void {
    this._extendedCaballoService.getAllPaises()
      .then(paises => {
        this.paises = paises;
      }).catch(err => {
      console.error(err);
    });
  }

  edit() {
    this.navCtrl.push(AdminCaballosInsertPage, {
      caballoEntity: JSON.parse(JSON.stringify(this.caballoEntity)),
      isUpdate: true
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  private addEvents(): void { //Por este evento le haré llegar el nuevo nombre al caballo!
    this.events.subscribe("caballo:refresh", () => {
      this.getCaballo(this.caballoEntity.ID);
    });
  }

  private removeEvents(): void {
    this.events.unsubscribe("caballo:refresh");
  }
}

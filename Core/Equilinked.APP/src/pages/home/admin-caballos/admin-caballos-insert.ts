import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Events, ModalController, NavController, NavParams } from 'ionic-angular';
import { Utils } from '../../../app/utils'
import { CommonService } from '../../../services/common.service';
import { SecurityService } from '../../../services/security.service';
import { CaballoService } from '../../../services/caballo.service';
import { ExtendedCaballoService } from '../../../services/extended.caballo.service';
import { PropietarioService } from '../../../services/propietario.service';
import { Caballo } from '../../../model/caballo';
import { UserSessionEntity } from '../../../model/userSession';
import moment from "moment";
import { LanguageService } from '../../../services/language.service';
import { SeleccionFotosModal } from "./seleccion-fotos/seleccion-fotos-modal";

@Component({
    templateUrl: 'admin-caballos-insert.html',
    providers: [LanguageService, CommonService, SecurityService, CaballoService, PropietarioService, ExtendedCaballoService]
})
export class AdminCaballosInsertPage {
    labels: any = {};
    form: any;
    caballoEntity: Caballo;
    generoList = [];
    pelajeList = [];
    protectores = [];
    paises = [];
    session: UserSessionEntity;
    isUpdate: boolean = false;
    age: string;

    constructor(
        private events: Events,
        public navCtrl: NavController,
        public navParams: NavParams,
        private propietarioService: PropietarioService,
        private _commonService: CommonService,
        private _securityService: SecurityService,
        private _caballoService: CaballoService,
        private _extendedCaballoService: ExtendedCaballoService,
        private formBuilder: FormBuilder,
        private modalController: ModalController,
        private languageService: LanguageService
    ) {
        this.age = "";
        languageService.loadLabels().then(labels => this.labels = labels);
    }

    ngOnInit() {
        this.caballoEntity = new Caballo();
        this.session = this._securityService.getInitialConfigSession();
        if (this._commonService.IsValidParams(this.navParams, ["caballoEntity", "isUpdate"])) {
            this.caballoEntity = this.navParams.get("caballoEntity");
            this.isUpdate = this.navParams.get("isUpdate");
            if (!this.isUpdate) {
                this.caballoEntity.FechaNacimiento = moment().toISOString();
                this.caballoEntity.Propietario_ID = this.session.PropietarioId;
            }
        }
        this.getAllProtectores();
        this.getPelajeList();
        this.getGeneroList();
        this.getAllPaises();
        this.initForm();
    }

    initForm() {
        console.log("CABALLO:", this.caballoEntity);
        this.form = this.formBuilder.group({
            Nombre: [this.caballoEntity.Nombre, Validators.required],
            NombrePropietario: [this.caballoEntity.NombrePropietario],
            Genero_ID: [this.caballoEntity.Genero_ID, Validators.required],
            Pelaje_ID: [this.caballoEntity.Pelaje_ID, Validators.required],
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
        if (!this.caballoEntity.ID) {
            this.getInfoPropietario(); //Obtener info del propietario para autocompletar "nombre propietario"
        }
    }

    calculateAge(dateSelected: string): void {
        let date = moment(dateSelected);
        this.age = "";
        if (moment().isAfter(date)) {
            let years: number = moment().diff(date, "years");
            let months: number = moment().diff(date, "months");
            months = months - (years * 12);
            this.age = (years > 1 ? years + " " + this.labels["PANT004_LBL_NAAN"] : (years == 1 ? "1 " + this.labels["PANT004_LBL_NAAN"] : ""));
            this.age = this.age + (months > 1 ? months + " " + this.labels["PANT004_LBL_NAME"] : (months == 1 ? "1 " + this.labels["PANT004_LBL_NAME"] : ""));
        }
        console.info(this.age);
    }

    selectImage(): void {
        this.modalController.create(SeleccionFotosModal).present();
    }

    private getGeneroList() {
        this._extendedCaballoService.getAllGeneroComboBox()
            .subscribe(res => {
                console.log(res);
                this.generoList = res;
                //this.reloadForm();
            }, error => {
                console.log(error);
            });
    }

    private getPelajeList() {
        this._extendedCaballoService.getAllPelajeComboBox()
            .subscribe(res => {
                console.log(res);
                this.pelajeList = res;
                //this.reloadForm();
            }, error => {
                console.log(error);
            });
    }

    private getAllProtectores(): void {
        this._extendedCaballoService.getAllProtector()
            .then(protectores => {
                this.protectores = protectores;
            }).catch(err => {
                console.log(err);
            });
    }

    private getAllPaises(): void {
        this._extendedCaballoService.getAllPaises()
            .then(paises => {
                this.paises = paises;
            }).catch(err => {
                console.log(err);
            });
    }

    save() {
        this._commonService.showLoading(this.labels["PANT004_ALT_PRO"]);
        this.buildEntity(this.caballoEntity, this.form.value); //se pasan por referencia!

        this._caballoService.save(this.caballoEntity)
            .subscribe(res => {
                console.log(res);
                this.events.publish("caballo:refresh");
                this.events.publish("caballo-ficha:refresh");
                this.events.publish("caballos:refresh");
                this.events.publish("grupo-ubicaciones:refresh");//Cuando se llega desde esta pantalla

                this.events.publish("caballos-grupo:refresh");//Lista de caballos del grupo
                this.events.publish("grupo-caballos-sin-ubicacion:refresh");//Cuando viene de la lista de caballos sin ubicacion

                this.events.publish("establo-caballos:refresh");//Lista de caballos del establo

                this._commonService.hideLoading();
                this.navCtrl.pop().then(() => {
                    this._commonService.ShowInfo(this.labels["PANT004_MSG_GUOK"]);
                })
            }, error => {
                console.log(error);
                this._commonService.hideLoading();
                this._commonService.ShowInfo(this.labels["PANT004_MSG_GUERR"]);
            });
    }

    goBack() {
        this.navCtrl.pop();
    }

    private buildEntity(entity: Caballo, valuesForm: any): void {
        entity.Nombre = valuesForm["Nombre"];
        entity.NombrePropietario = valuesForm["NombrePropietario"];
        entity.Genero_ID = valuesForm["Genero_ID"];
        entity.Pelaje_ID = valuesForm["Pelaje_ID"];
        entity.FechaNacimiento = valuesForm["FechaNacimiento"];
        entity.GenealogiaCaballo.Madre = valuesForm["NombreMadre"];
        entity.GenealogiaCaballo.Padre = valuesForm["NombrePadre"];
        entity.CriadorCaballo.Nombre = valuesForm["NombreCriador"];
        entity.CriadorCaballo.Pais_ID = valuesForm["PaisCriador"];
        entity.ADN = valuesForm["ADN"];
        entity.NumeroChip = valuesForm["NumeroChip"];
        entity.NumeroId = valuesForm["NumeroId"];
        entity.Marcas = valuesForm["Marcas"];
        entity.EstadoFEN = valuesForm["EstadoFEN"];
        entity.NumeroFEN = valuesForm["NumeroFEN"];
        entity.EstadoFEI = valuesForm["EstadoFEI"];
        entity.NumeroFEI = valuesForm["NumeroFEI"];
        entity.Protector_ID = valuesForm["Protector_ID"];
        entity.Observaciones = valuesForm["Observaciones"];
        entity.Embocadura = valuesForm["Embocadura"];
        entity.ExtrasDeCabezada = valuesForm["ExtrasDeCabezada"];
        entity.ResponsableCaballo.Nombre = valuesForm["NombreResponsable"];
        entity.ResponsableCaballo.Telefono = valuesForm["TelefonoResponsable"];
        entity.ResponsableCaballo.CorreoElectronico = valuesForm["CorreoResponsable"];
    }

    private getInfoPropietario(): void {
        this.propietarioService.getSerializedById(this.session.PropietarioId)
            .toPromise()
            .then(propietario => {
                this.caballoEntity.NombrePropietario = propietario.Nombre;
                this.form.patchValue({ NombrePropietario: propietario.Nombre });
            }).catch(err => {
                console.error(err);
            });
    }
}
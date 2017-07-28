import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Events, NavController, NavParams } from 'ionic-angular';
import { Utils } from '../../../../app/utils'
import { CommonService } from '../../../../services/common.service';
import { CaballoService } from '../../../../services/caballo.service';
import { SecurityService } from '../../../../services/security.service';
import { Caballo } from '../../../../model/caballo';
import { UserSessionEntity } from '../../../../model/userSession';
import { FichaCaballoPage } from '../../ficha-caballo/ficha-caballo-home';
import { AdminCaballosInsertPage } from '../../admin-caballos/admin-caballos-insert';
import { LanguageService } from '../../../../services/language.service';

@Component({
  selector: 'caballos-ind',
  templateUrl: 'caballosInd.html',
  providers: [CommonService, LanguageService, CaballoService, SecurityService]
})
export class CaballosInd implements OnDestroy, OnInit {

  private caballoIdSelected: number;

  caballos: Array<Caballo>;
  caballosList: Array<Caballo>;
  session: UserSessionEntity;
  isDeleting: boolean = false;
  tmpCaballoIdSelected: number = 0;

  labels: any = {};

  constructor(
    private events: Events,
    public navCtrl: NavController,
    public navParams: NavParams,
    private _commonService: CommonService,
    private _caballoService: CaballoService,
    private _securityService: SecurityService,
    private languageService: LanguageService
  ) {
    languageService.loadLabels().then(labels => this.labels = labels);
    this.caballoIdSelected = 0; //No hay
  }


  ngOnInit(): void {
    console.log("CABALLOS IND");
    this.session = this._securityService.getInitialConfigSession();
    this.caballosList = new Array<Caballo>();
    this.loadcaballos(true);
    this.addEvents(); //Registrar el listener para escuchar cuando se debe refrescar la pantalla
  }

  ngOnDestroy(): void {
    this.removeEvents(); //Eliminar listener
  }

  // CARGA DE CABALLOS
  loadcaballos(loading: boolean): void {
    if (loading)
      this._commonService.showLoading(this.labels["PANT002_ALT_PRO"]);

    this._caballoService.getAllSerializedByPropietarioId(this.session.PropietarioId)
      .subscribe(res => {
        if (loading)
          this._commonService.hideLoading();

        this.caballosList = res;
        this.caballos = res;
      }, error => {
        console.log(error);
        this._commonService.ShowErrorHttp(error, this.labels["PANT002_MSG_ERRCA"]);
      });
  }

  // BÚSQUEDA EN LISTADO
  findCaballos(ev: any) {
    let value: string = ev.target.value;
    if (value && value !== null) {
      this.caballosList = this.caballos.filter(caballo => {
        return caballo.Nombre.toUpperCase().indexOf(value.toUpperCase()) > -1;
      });
    } else {
      this.caballosList = this.caballos;
    }
  }

  // NAVEGACIÓN A FICHA DE CABALLO
  goToFicha(caballoSelected: Caballo): void {
    /* Flag para determinar que no se este eliminando al mismo tiempo */
    if (!this.isDeleting) {
      this.caballoIdSelected = caballoSelected.ID; //guardo el ID
      this.navCtrl.push(FichaCaballoPage, {
        caballoSelected: caballoSelected
      });
    }
  }

  // NAVEGACIÓN A NUEVA FICHA DE CABALLO
  goInsertCaballo(): void {
    this.navCtrl.push(AdminCaballosInsertPage, {
      caballoEntity: new Caballo(),
      isUpdate: false,
      callbackController: this
    });
  }

  deleteCaballo(caballoId: number) {
    console.log("ELIMINANDO ID:", caballoId);
    this.isDeleting = true;
    this._commonService.showLoading(this.labels["PANT002_ALT_PRO"]);
    this._caballoService.delete(caballoId)
      .subscribe(res => {
        this._commonService.hideLoading();
        this.loadcaballos(true);
        this.isDeleting = false;
      }, error => {
        this._commonService.ShowErrorHttp(error, this.labels["PANT002_MSG_ERRELI"]);
        this.isDeleting = false;
      });
  }

  confirmDeleteCaballo(caballoId: number) {
    this.tmpCaballoIdSelected = caballoId;
    this.isDeleting = true;
    let buttons = [];
    buttons.push(this._commonService.NewButtonAlert(0, this.labels["PANT002_BTN_CAN"], this));
    buttons.push(this._commonService.NewButtonAlert(1, this.labels["PANT002_BTN_ACE"], this));
    this._commonService.ShowConfirmAlert(this.labels["PANT002_ALT_TIELI"], this.labels["PANT002_ALT_MSGELI"], buttons)
  }

  _callbackConfirmAlert(buttonIdClicked) {
    if (buttonIdClicked === 1) {
      this.deleteCaballo(this.tmpCaballoIdSelected);
    } else {
      this.isDeleting = false;
    }
  }

  private addEvents(): void {
    this.events.subscribe("caballos:refresh", () => {
      this.loadcaballos(false);
    });
  }

  private removeEvents(): void {
    this.events.unsubscribe("caballos:refresh");
  }

}
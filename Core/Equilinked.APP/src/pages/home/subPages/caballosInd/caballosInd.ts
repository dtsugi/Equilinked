
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, NavParams} from 'ionic-angular';
import {Utils} from '../../../../app/utils'
import { CommonService } from '../../../../services/common.service';
import { CaballoService } from '../../../../services/caballo.service';
import { SecurityService} from '../../../../services/security.service';
import { Caballo } from '../../../../model/caballo';
import { UserSessionEntity } from '../../../../model/userSession';
import { FichaCaballoPage} from '../../ficha-caballo/ficha-caballo-home';
import { AdminCaballosInsertPage} from '../../admin-caballos/admin-caballos-insert';


@Component({
  selector: 'caballos-ind',
  templateUrl: 'caballosInd.html',
  providers: [CommonService, CaballoService, SecurityService]
})
export class CaballosInd {
  caballos: Array<Caballo>;
  caballosList: Array<Caballo>;
  session: UserSessionEntity;
  isDeleting: boolean = false;
  tmpCaballoIdSelected: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _commonService: CommonService,
    private _caballoService: CaballoService,
    private _securityService: SecurityService) {
  }

  ngOnInit() {
    console.log("CABALLOS IND");
    this.session = this._securityService.getInitialConfigSession();
    this.caballosList = new Array<Caballo>();
    this.loadcaballos();
  }

  // CARGA DE CABALLOS
  loadcaballos(): void {
    this._commonService.showLoading("Procesando..");
    this._caballoService.getAllSerializedByPropietarioId(this.session.PropietarioId)
      .subscribe(res => {
        console.log(res);
        this._commonService.hideLoading();
        this.caballosList = res;
      }, error => {
        console.log(error);
        this._commonService.hideLoading();
        this._commonService.ShowErrorHttp(error, "Error consultando los caballos");
      });
  }

  // BÚSQUEDA EN LISTADO
  findCaballos(ev: any) {
    // this.caballosList = this._caballosService.findCaballos(ev.target.value, this.caballos);
  }

  // OBTENER NOMBRE DEL GRUPO DE CABALLO, SI LO POSEE
  // getDescGrupoCaballo(caballo: Caballo): string {
  //   if (caballo.Grupo != null)
  //     return caballo.Grupo.Descripcion;
  //   else
  //     return null;
  // }

  // NAVEGACIÓN A FICHA DE CABALLO
  goToFicha(caballoSelected: Caballo): void {
    /* Flag para determinar que no se este eliminando al mismo tiempo */
    if (!this.isDeleting) {
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
    this._commonService.showLoading("Eliminando..");
    this._caballoService.delete(caballoId)
      .subscribe(res => {
        this._commonService.hideLoading();
        console.log(res);
        this.reloadController();
        this.isDeleting = false;
      }, error => {
        this._commonService.ShowErrorHttp(error, "Error al eliminar el caballo");
        this.isDeleting = false;
      });
  }

  confirmDeleteCaballo(caballoId: number) {
    this.tmpCaballoIdSelected = caballoId;
    this.isDeleting = true;
    let buttons = [];
    buttons.push(this._commonService.NewButtonAlert(0, "Cancelar", this));
    buttons.push(this._commonService.NewButtonAlert(1, "Aceptar", this));
    this._commonService.ShowConfirmAlert("Eliminar caballo", "¿ Está seguro de eliminar toda la información asociada a este caballo ?", buttons)
  }

  _callbackConfirmAlert(buttonIdClicked) {
    if (buttonIdClicked === 1) {
      this.deleteCaballo(this.tmpCaballoIdSelected);
    } else {
      this.isDeleting = false;
    }
  }

  reloadController() {
    this.loadcaballos();
  }
}
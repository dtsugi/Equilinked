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


@Component({
  selector: 'caballos-ind',
  templateUrl: 'caballosInd.html',
  providers: [CommonService, CaballoService, SecurityService]
})
export class CaballosInd implements OnDestroy, OnInit {

  private caballoIdSelected: number;

  caballos: Array<Caballo>;
  caballosList: Array<Caballo>;
  session: UserSessionEntity;
  isDeleting: boolean = false;
  tmpCaballoIdSelected: number = 0;

  constructor(
    private events: Events,
    public navCtrl: NavController,
    public navParams: NavParams,
    private _commonService: CommonService,
    private _caballoService: CaballoService,
    private _securityService: SecurityService) {
    this.caballoIdSelected = 0; //No hay
  }

  ngOnInit(): void {
    console.log("CABALLOS IND");
    this.session = this._securityService.getInitialConfigSession();
    this.caballosList = new Array<Caballo>();
    this.loadcaballos();
    this.addEvents(); //Registrar el listener para escuchar cuando se debe refrescar la pantalla
  }

  ngOnDestroy(): void {
    this.removeEvents(); //Eliminar listener
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
    this._commonService.showLoading("Eliminando..");
    this._caballoService.delete(caballoId)
      .subscribe(res => {
        this._commonService.hideLoading();
        console.log(res);
        this.loadcaballos();
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

  private loadCaballosAndfindCaballoById(idCaballo: any) {
    this._caballoService.getAllSerializedByPropietarioId(this.session.PropietarioId)
      .subscribe(res => {
        this.caballosList = res;

        //Buscamos el caballo para enviarlo a la pantalla de "ficha de caballo"
        let caballoList = this.caballosList.filter(c => c.ID == idCaballo);
        if (caballoList.length > 0) {
          this.events.publish("caballo:change", caballoList[0]);
        } else { //Eliminaron el caballo que queriamos enviar
          this.caballoIdSelected = 0;
        }
      }, error => {
        this._commonService.ShowErrorHttp(error, "Error consultando los caballos");
      });
  }

  private addEvents(): void {
    this.events.subscribe("caballos:refresh", () => {
      console.info("Intando refrescar lista de caballos!");
      this.loadCaballosAndfindCaballoById(this.caballoIdSelected); //Refrescamos e intentamos enviar el nuevo caballo para refrescar el nombre de la tarjeta
    });
  }

  private removeEvents(): void {
    this.events.unsubscribe("caballos:refresh");
  }

}
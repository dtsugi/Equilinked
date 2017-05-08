
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, NavParams} from 'ionic-angular';
import {Utils} from '../../../../app/utils'
import { CommonService } from '../../../../services/common.service';
import { CaballoService } from '../../../../services/caballo.service';
import { SecurityService} from '../../../../services/security.service';
import { Caballo } from '../../../../model/caballo';
import { UserSessionEntity } from '../../../../model/userSession';
// import { AdminCaballoPage } from '../../adminCaballo/adminCaballo';
// import { FichaCaballo } from '../../fichaCaballo/fichaCaballo';

@Component({
  selector: 'caballos-ind',
  templateUrl: 'caballosInd.html',
  providers: [CommonService, CaballoService, SecurityService]
})
export class CaballosInd {
  caballos: Array<Caballo>;
  caballosList: Array<Caballo>;
  session: UserSessionEntity;

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
  goToFicha(anIdCaballo: number): void {
    // let caballoSeleccionado = this.caballosList.filter((caballo) => {
    //   return (caballo.ID == anIdCaballo);
    // })[0];
    // this.navController.push(FichaCaballo, {
    //   unCaballo: caballoSeleccionado
    // });
  }

  // NAVEGACIÓN A NUEVA FICHA DE CABALLO
  goToNuevaFicha(): void {
    // this.navController.push(AdminCaballoPage);
  }
}
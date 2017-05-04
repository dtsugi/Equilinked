import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular'
import { CommonService } from '../../../../services/common.service';
// import { FichaCaballo } from '../../fichaCaballo/fichaCaballo';
import { Caballo } from '../../../../model/caballo';
// import { CaballosService } from '../../../../services/caballos.service';
// import { AdminCaballoPage } from '../../adminCaballo/adminCaballo';

@Component({
  selector: 'caballos-ind',
  templateUrl: 'caballosInd.html',
  providers: [CommonService]
})
export class CaballosInd {
  caballos: Array<Caballo>;
  caballosList: Array<Caballo>;

  constructor() { }
}
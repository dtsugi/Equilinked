import {Component, OnInit} from "@angular/core";
import {ModalController, NavParams, ViewController} from "ionic-angular";
import {CommonService} from "../../../../../services/common.service";
import {CaballoService} from '../../../../../services/caballo.service';
import {EstablosService} from "../../../../../services/establos.service";
import {UserSessionEntity} from "../../../../../model/userSession";
import {LanguageService} from '../../../../../services/language.service';
import {EquiModalFiltroCaballos} from '../../../../../utils/equi-modal-filtro-caballos/filtro-caballos-modal';

@Component({
  templateUrl: "./caballos-establo-modal.html",
  providers: [LanguageService, CaballoService, CommonService, EstablosService]
})
export class CaballosEstabloModal implements OnInit {
  private session: UserSessionEntity;
  private establo: any;
  //Caballos que se listan en esta pantalla...
  private caballosRespaldo: any[];
  caballos: any[];
  labels: any = {};
  showSpinner: boolean;
  isFilter: boolean;
  private mapCaballos: Map<number, any>;
  private parametersFilter: Map<string, string>;

  constructor(private commonService: CommonService,
              private establosService: EstablosService,
              private modalController: ModalController,
              public navParams: NavParams,
              public viewController: ViewController,
              private languageService: LanguageService) {
    this.mapCaballos = new Map();
    this.caballos = [];
    this.isFilter = false;
    this.showSpinner = true;
  }

  ngOnInit(): void {
    this.session = this.navParams.get("session");
    this.establo = this.navParams.get("establo");
    this.establo.Caballo.forEach(c => {
      this.mapCaballos.set(c.ID, c);
    });
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
      this.listCaballos();
    });
  }

  close(): void {
    this.viewController.dismiss();
  }

  accept(): void {
    this.establo.Caballo = this.caballosRespaldo.filter(c => c.seleccion).map(c => c.caballo);
    this.viewController.dismiss();
  }

  filter(evt: any) {
    this.isFilter = false;
    this.caballosRespaldo.forEach(cab => {
      cab.caballo.NombreFilter = cab.caballo.Nombre;
    });
    let value: string = evt ? evt.target.value : null;
    if (value) {
      this.caballos = this.caballosRespaldo.filter(cab => {
        let indexMatchCaballo = cab.caballo.Nombre.toUpperCase().indexOf(value.toUpperCase());
        if (indexMatchCaballo > -1) {
          let textReplace = cab.caballo.Nombre.substring(indexMatchCaballo, indexMatchCaballo + value.length);
          cab.caballo.NombreFilter = cab.caballo.Nombre.replace(textReplace, '<span class="equi-text-black">' + textReplace + '</span>');
        }
        this.isFilter = true;
        return indexMatchCaballo > -1;
      });
    } else {
      this.caballos = this.caballosRespaldo;
    }
    console.info(this.caballos);
  }

  openAvancedFilter(): void {
    let modal = this.modalController.create(EquiModalFiltroCaballos, {parameters: this.parametersFilter});
    modal.onDidDismiss(result => {
      if (result && result.parameters) {
        if (result.parameters.size > 0) {
          this.parametersFilter = result.parameters;
        } else {
          this.parametersFilter = null;
        }
        this.listCaballos();
      }
    });
    modal.present();
  }

  selectCaballo(c: any): void {
    c.seleccion = !c.seleccion;
    if (c.seleccion) {
      this.mapCaballos.set(c.caballo.ID, c.caballo);
    } else {
      this.mapCaballos.delete(c.caballo.ID);
    }
  }

  selectAll(): void {
    let countSeleted = this.caballosRespaldo.filter(c => c.seleccion).length;
    let selectAll: boolean = countSeleted !== this.caballosRespaldo.length;
    this.caballosRespaldo.forEach(c => {
      c.seleccion = selectAll;
      let hasCaballo = this.mapCaballos.has(c.caballo.ID);
      if (selectAll) {
        if (!hasCaballo)
          this.mapCaballos.set(c.caballo.ID, c.caballo);
      } else {
        this.mapCaballos.delete(c.caballo.ID);
      }
    });
  }

  private listCaballos(): void {
    if (this.establo.ID) {
      this.listCaballosWithWithoutEstabloById();//Libres con seleccionados
    } else {
      this.listFreeCaballosByPropietarioId();//Los libres del establo
    }
  }

  private listFreeCaballosByPropietarioId(): void {
    this.establosService.getCaballosSinEstabloByPropietario(this.session.PropietarioId, this.parametersFilter)
      .then(caballos => {
        this.caballosRespaldo = caballos.map(c => {
          return {
            seleccion: this.mapCaballos.has(c.ID),
            caballo: this.mapCaballos.has(c.ID) ? this.mapCaballos.get(c.ID) : c
          }
        });
        this.filter(null);
        this.showSpinner = false;
      }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels["PANT034_MSG_ERRCAB"]);
      this.showSpinner = false;
    });
  }

  private listCaballosWithWithoutEstabloById(): void {
    this.establosService.getCaballosByEstablo(this.establo.ID, 1, this.parametersFilter)
      .then(caballos => {
        this.caballosRespaldo = caballos.map(c => {
          return {
            seleccion: this.mapCaballos.has(c.ID),
            caballo: this.mapCaballos.has(c.ID) ? this.mapCaballos.get(c.ID) : c
          }
        });
        this.filter(null);
        this.showSpinner = false;
      }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels["PANT034_MSG_ERRCAB"]);
      this.showSpinner = false;
    });
  }
}

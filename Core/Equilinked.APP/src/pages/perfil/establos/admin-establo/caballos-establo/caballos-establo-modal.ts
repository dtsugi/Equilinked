import {Component, OnInit} from "@angular/core";
import {NavParams, ViewController} from "ionic-angular";
import {CommonService} from "../../../../../services/common.service";
import {CaballoService} from '../../../../../services/caballo.service';
import {EstablosService} from "../../../../../services/establos.service";
import {UserSessionEntity} from "../../../../../model/userSession";
import {LanguageService} from '../../../../../services/language.service';

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

  constructor(private commonService: CommonService,
              private establosService: EstablosService,
              public navParams: NavParams,
              public viewController: ViewController,
              private languageService: LanguageService) {
    languageService.loadLabels().then(labels => this.labels = labels);
    this.caballos = [];
    this.showSpinner = true;
  }

  ngOnInit(): void {
    this.session = this.navParams.get("session");
    this.establo = this.navParams.get("establo");
    if (this.establo.ID) {
      this.listCaballosWithWithoutEstabloById();//Libres con seleccionados
    } else {
      this.listFreeCaballosByPropietarioId();//Los libres del establo
    }
  }

  close(): void {
    this.establo.Caballo = this.caballosRespaldo.filter(c => c.seleccion).map(c => c.caballo);
    this.viewController.dismiss();
  }

  filter(evt: any) {
    this.caballos = this.establosService.filterCaballosByNombre(evt.target.value, this.caballosRespaldo);
  }

  selectAll(): void {
    let countSeleted = this.caballosRespaldo.filter(c => c.seleccion).length;
    let selectAll: boolean = countSeleted !== this.caballosRespaldo.length;
    this.caballosRespaldo.forEach(c => {
      c.seleccion = selectAll;
    });
  }

  private listFreeCaballosByPropietarioId(): void {
    this.establosService.getCaballosSinEstabloByPropietario(this.session.PropietarioId)
      .then(caballos => {
        let mapCaballos: Map<number, any> = new Map<number, any>();
        this.establo.Caballo.forEach(ec => {
          mapCaballos.set(ec.ID, ec);
        });
        this.caballosRespaldo = caballos.map(c => {
          return {
            seleccion: mapCaballos.has(c.ID),
            caballo: mapCaballos.has(c.ID) ? mapCaballos.get(c.ID) : c
          }
        });
        this.caballos = this.caballosRespaldo;
        this.showSpinner = false;
      }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels["PANT034_MSG_ERRCAB"]);
      this.showSpinner = false;
    });
  }

  private listCaballosWithWithoutEstabloById(): void {
    this.establosService.getCaballosByEstablo(this.establo.ID, 1)
      .then(caballos => {
        let mapCaballos: Map<number, any> = new Map<number, any>();
        this.establo.Caballo.forEach(c => {
          mapCaballos.set(c.ID, c);
        });
        this.caballosRespaldo = caballos.map(c => {
          return {
            seleccion: mapCaballos.has(c.ID),
            caballo: mapCaballos.has(c.ID) ? mapCaballos.get(c.ID) : c
          }
        });
        this.caballos = this.caballosRespaldo;
        this.showSpinner = false;
      }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels["PANT034_MSG_ERRCAB"]);
      this.showSpinner = false;
    });
  }
}

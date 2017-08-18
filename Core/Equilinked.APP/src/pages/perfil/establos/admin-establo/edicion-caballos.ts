import {Component, OnDestroy, OnInit} from "@angular/core";
import {Events, NavController, NavParams} from "ionic-angular";
import {FichaCaballoPage} from "../../../home/ficha-caballo/ficha-caballo-home";
import {CommonService} from "../../../../services/common.service";
import {EstablosService} from "../../../../services/establos.service";
import {LanguageService} from '../../../../services/language.service';
import {SecurityService} from "../../../../services/security.service";
import {UserSessionEntity} from "../../../../model/userSession";

@Component({
  templateUrl: "./edicion-caballos.html",
  providers: [LanguageService, CommonService, EstablosService, SecurityService]
})
export class EdicionEstabloCaballosPage implements OnInit, OnDestroy {
  private establoCaballosRespaldo: Array<any>;
  private establoCaballosEdicionResp: Array<any>;
  private session: UserSessionEntity;
  establoCabllos: Array<any>;
  establoCaballosEdicion: Array<any>;
  labels: any = {};
  establo: any;
  grupo: any;
  modoEdicion: boolean;
  loading: boolean;

  constructor(private commonService: CommonService,
              private establosService: EstablosService,
              private events: Events,
              private navController: NavController,
              private navParams: NavParams,
              private languageService: LanguageService,
              private securityService: SecurityService) {
    this.loading = true;
    this.modoEdicion = false;
    this.establoCabllos = new Array<any>();
  }

  ngOnInit(): void {
    this.session = this.securityService.getInitialConfigSession();
    this.establo = this.navParams.get("establo");
    this.grupo = this.navParams.get("grupo");
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
      this.listCaballos(); //Listamos los caballos del establo
    });
    this.addEvents();
  }

  ngOnDestroy(): void {
    this.removeEvents();
  }

  goBack(): void {
    this.navController.pop();
  }

  edit(): void {
    this.modoEdicion = true;
    this.listCaballosByPropietario(); //Listamos los caballos disponibles
  }

  viewDetail(caballo: any): void {
    this.navController.push(FichaCaballoPage, {
      caballoSelected: caballo
    });
  }

  selectAll(): void {
    let countSeleted = this.establoCaballosEdicion.filter(ec => ec.seleccion).length;
    let selectAll: boolean = countSeleted !== this.establoCaballosEdicionResp.length;
    this.establoCaballosEdicionResp.forEach(ec => {
      ec.seleccion = selectAll
    })
  }

  filterCaballos(evt: any): void {
    this.establoCabllos = this.establosService.filterEstabloCaballosByNombre(
      evt.target.value, this.establoCaballosRespaldo
    );
  }

  filterCaballosForEdition(evt: any): void {
    this.establoCaballosEdicion = this.establosService.filterEstabloCaballosForEdition(
      evt.target.value, this.establoCaballosEdicionResp
    );
  }

  save(): void {
    this.establo.Caballo = this.establoCaballosEdicionResp
      .filter(ec => ec.seleccion)
      .map(ec => ec.caballo);
    this.commonService.showLoading(this.labels["PANT035_ALT_PRO"]);
    this.establosService.updateEstablo(this.establo)
      .then(() => {
        this.events.publish("caballo-ubicacion:refresh");//Detalle establo de ubicacion de caballo
        this.events.publish("caballo-ficha:refresh");//Ficha de opciones de caballo
        this.events.publish("caballos:refresh");//Lista de caballos
        //establos
        this.events.publish("establos:refresh"); //Pantalla de establos
        this.events.publish("establo:refresh");//Detalle de establo
        //grupos
        this.events.publish("grupo-ubicacion:refresh");//pantalla de detalle de establo en ubicaciones grupo
        this.events.publish("grupo-ubicaciones:refresh");//Lista de establos en ubicaciones de grupo
        this.listCaballosByEstabloId(); //Refresco la lista actual
        this.modoEdicion = false;
        this.commonService.hideLoading();
      }).catch(err => {
      console.error(err);
      this.commonService.ShowErrorHttp(err, this.labels["PANT035_MSG_ERRACT"]);
    });
  }

  private listCaballosByPropietario(): void {
    let mapEstabloCaballos: Map<number, any> = new Map<number, any>();
    this.establoCaballosRespaldo.forEach(ec => {
      mapEstabloCaballos.set(ec.ID, ec);
    });
    this.loading = true;
    this.establosService.getCaballosByEstablo(this.establo.ID, 1)
      .then(caballos => {
        this.loading = false;
        this.establoCaballosEdicion = caballos.map(c => {
          return {
            seleccion: mapEstabloCaballos.has(c.ID),
            caballo: mapEstabloCaballos.has(c.ID) ?
              mapEstabloCaballos.get(c.ID) : c
          };
        });
        this.establoCaballosEdicionResp = this.establoCaballosEdicion;
      }).catch(err => {
      console.error(err);
      this.loading = false;
      this.commonService.ShowInfo(this.labels["PANT035_MSG_ERRCA"]);
    });
  }

  private listCaballos(): void {
    if (this.grupo) {
      this.listCaballosByGrupo();
    } else {
      this.listCaballosByEstabloId();
    }
  }

  private listCaballosByGrupo(): void {
    this.loading = true;
    this.establosService.getCaballosByEstabloAndGrupo(this.session.PropietarioId, this.establo.ID, this.grupo.ID)
      .then(caballos => {
        this.establoCabllos = caballos;
        this.establoCaballosRespaldo = caballos;
        this.loading = false;
      }).catch(err => {
      console.error(err);
      this.commonService.ShowInfo(this.labels["PANT035_MSG_ERRCA"]);
      this.loading = false;
    });
  }

  private listCaballosByEstabloId(): void {
    this.loading = true;
    this.establosService.getCaballosByEstablo(this.establo.ID, 2)
      .then(establoCaballos => {
        this.establoCabllos = establoCaballos;
        this.establoCaballosRespaldo = establoCaballos;
        this.loading = false;
      }).catch(err => {
      console.error(err);
      this.loading = false;
      this.commonService.ShowInfo(this.labels["PANT035_MSG_ERRCA"]);
    });
  }

  private addEvents(): void {
    this.events.subscribe("establo-caballos:refresh", () => {
      this.listCaballos();
    });
  }

  private removeEvents(): void {
    this.events.unsubscribe("establo-caballos:refresh")
  }
}

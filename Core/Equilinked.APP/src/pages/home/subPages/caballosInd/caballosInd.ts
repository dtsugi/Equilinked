import {Component, OnDestroy, OnInit} from '@angular/core';
import {Events, NavController, NavParams} from 'ionic-angular';
import {CommonService} from '../../../../services/common.service';
import {CaballoService} from '../../../../services/caballo.service';
import {SecurityService} from '../../../../services/security.service';
import {Caballo} from '../../../../model/caballo';
import {UserSessionEntity} from '../../../../model/userSession';
import {FichaCaballoPage} from '../../ficha-caballo/ficha-caballo-home';
import {AdminCaballosInsertPage} from '../../admin-caballos/admin-caballos-insert';
import {LanguageService} from '../../../../services/language.service';

@Component({
  selector: 'caballos-ind',
  templateUrl: 'caballosInd.html',
  providers: [CommonService, LanguageService, CaballoService, SecurityService]
})
export class CaballosInd implements OnDestroy, OnInit {
  private caballoIdSelected: number;
  loading: boolean;
  caballos: Array<Caballo>;
  caballosList: Array<Caballo>;
  session: UserSessionEntity;
  isDeleting: boolean = false;
  labels: any = {};

  constructor(private events: Events,
              public navCtrl: NavController,
              public navParams: NavParams,
              private _commonService: CommonService,
              private _caballoService: CaballoService,
              private _securityService: SecurityService,
              private languageService: LanguageService) {
    this.loading = true;
    this.caballoIdSelected = 0; //No hay
    languageService.loadLabels().then(labels => this.labels = labels);
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
    this.loading = true;
    this._caballoService.getAllSerializedByPropietarioId(this.session.PropietarioId)
      .subscribe(res => {
        this.loading = false;
        this.caballosList = res;
        this.caballos = res;
      }, error => {
        console.log(error);
        this.loading = false;
        this._commonService.ShowInfo(this.labels["PANT002_MSG_ERRCA"]);
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

  private addEvents(): void {
    this.events.subscribe("caballos:refresh", () => {
      this.loadcaballos();
    });
  }

  private removeEvents(): void {
    this.events.unsubscribe("caballos:refresh");
  }
}

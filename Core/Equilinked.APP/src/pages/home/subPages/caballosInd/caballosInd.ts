import {Component, OnDestroy, OnInit} from '@angular/core';
import {Events, NavController, NavParams, ModalController} from 'ionic-angular';
import {CommonService} from '../../../../services/common.service';
import {CaballoService} from '../../../../services/caballo.service';
import {SecurityService} from '../../../../services/security.service';
import {Caballo} from '../../../../model/caballo';
import {UserSessionEntity} from '../../../../model/userSession';
import {FichaCaballoPage} from '../../ficha-caballo/ficha-caballo-home';
import {AdminCaballosInsertPage} from '../../admin-caballos/admin-caballos-insert';
import {LanguageService} from '../../../../services/language.service';
import {EquiModalFiltroCaballos} from '../../../../utils/equi-modal-filtro-caballos/filtro-caballos-modal';
import {Utils} from '../../../../app/utils';

@Component({
  selector: 'caballos-ind',
  templateUrl: 'caballosInd.html',
  providers: [CommonService, LanguageService, CaballoService, SecurityService]
})
export class CaballosInd implements OnDestroy, OnInit {
  private caballoIdSelected: number;
  private parametersFilter: Map<string, string>;
  loading: boolean;
  caballos: Array<Caballo>;
  caballosList: Array<Caballo>;
  session: UserSessionEntity;
  isDeleting: boolean = false;
  labels: any = {};
  isFilter: boolean;

  constructor(private events: Events,
              public navCtrl: NavController,
              public navParams: NavParams,
              private _commonService: CommonService,
              private _caballoService: CaballoService,
              private _securityService: SecurityService,
              private modalController: ModalController,
              private languageService: LanguageService) {
    this.loading = true;
    this.isFilter = false;
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
    this._caballoService.getAllSerializedByPropietarioId(this.session.PropietarioId, this.parametersFilter)
      .subscribe(res => {
        this.loading = false;
        this.caballos = res;
        this.findCaballos(null);
      }, error => {
        console.log(error);
        this.loading = false;
        this._commonService.ShowInfo(this.labels["PANT002_MSG_ERRCA"]);
      });
  }

  // BÚSQUEDA EN LISTADO
  findCaballos(ev: any) {
    this.isFilter = false;
    this.caballos.forEach(caballo => {
      caballo.NombreFilter = caballo.Nombre;
      caballo.EstabloFilter = caballo.Establo ? caballo.Establo.Nombre : null;
    });
    let value: string = ev ? ev.target.value : null;
    if (value) {
      this.caballosList = this.caballos.filter(caballo => {
        let indexMatchCaballo = caballo.Nombre.toUpperCase().indexOf(value.toUpperCase());
        let indexMatchEstablo = caballo.Establo ? (caballo.Establo.Nombre.toUpperCase().indexOf(value.toUpperCase())) : -1;
        if (indexMatchCaballo > -1) {
          let textReplace = caballo.Nombre.substring(indexMatchCaballo, indexMatchCaballo + value.length);
          caballo.NombreFilter = caballo.Nombre.replace(textReplace, '<span class="equi-text-black">' + textReplace + '</span>');
        }
        if (caballo.Establo && indexMatchEstablo > -1) {
          let textReplace = caballo.Establo.Nombre.substring(indexMatchEstablo, indexMatchEstablo + value.length);
          caballo.EstabloFilter = caballo.Establo.Nombre.replace(textReplace, '<span class="equi-text-black">' + textReplace + '</span>');
        }
        this.isFilter = true;
        return indexMatchCaballo > -1 || indexMatchEstablo > -1;
      });
    } else {
      this.caballosList = this.caballos;
    }
  }

  openAvancedFilter(): void {
    let modal = this.modalController.create(EquiModalFiltroCaballos, {parameters: this.parametersFilter});
    modal.onDidDismiss(result => {
      console.info(result);
      if (result && result.parameters) {
        console.info(result.parameters.size);
        if (result.parameters.size > 0) {
          this.parametersFilter = result.parameters;
        } else {
          this.parametersFilter = null;
        }
        this.loadcaballos();//refrescamos
      }
    });
    modal.present();
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

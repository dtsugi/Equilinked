import {Component, OnInit} from "@angular/core";
import {Events, ModalController, NavController, NavParams} from "ionic-angular";
import {CaballoService} from "../../../../../../../services/caballo.service";
import {CommonService} from "../../../../../../../services/common.service";
import {GruposCaballosService} from "../../../../../../../services/grupos-caballos.service";
import {SecurityService} from "../../../../../../../services/security.service";
import {UserSessionEntity} from "../../../../../../../model/userSession";
import {LanguageService} from '../../../../../../../services/language.service';
import {EquiModalFiltroCaballos} from '../../../../../../../utils/equi-modal-filtro-caballos/filtro-caballos-modal';

@Component({
  templateUrl: "./edicion-caballos.html",
  providers: [CaballoService, CommonService, LanguageService, GruposCaballosService, SecurityService]
})
export class EdicionCaballosGrupoPage implements OnInit {
  private mapCaballosGrupo: Map<number, any>;
  private grupo: any;
  private session: UserSessionEntity;
  private caballosGrupoRespaldo: Array<any>;
  caballosGrupo: Array<any>;
  loading: boolean;
  isFilter: boolean;
  private parametersFilter: Map<string, string>;

  constructor(private caballoService: CaballoService,
              private commonService: CommonService,
              private events: Events,
              private modalController: ModalController,
              private gruposCaballosService: GruposCaballosService,
              private navController: NavController,
              private navParams: NavParams,
              private securityService: SecurityService) {
    this.loading = true;
    this.isFilter = false;
    this.caballosGrupoRespaldo = new Array<any>();
    this.caballosGrupo = new Array<any>();
    this.mapCaballosGrupo = new Map();
  }

  ngOnInit(): void {
    this.session = this.securityService.getInitialConfigSession();
    this.grupo = this.navParams.get("grupo");
    this.grupo.GrupoCaballo.forEach(cg => {
      this.mapCaballosGrupo.set(cg.Caballo_ID, cg);
    });
    this.getCaballosForGrupo();
  }

  goBack(): void {
    this.navController.pop();
  }

  filter(evt: any): void {
    this.isFilter = false;
    this.caballosGrupoRespaldo.forEach(cab => {
      cab.caballo.NombreFilter = cab.caballo.Nombre;
      cab.caballo.EstabloFilter = cab.caballo.Establo ? cab.caballo.Establo.Nombre : null;
    });
    let value: string = evt ? evt.target.value : null;
    if (value) {
      this.caballosGrupo = this.caballosGrupoRespaldo.filter(cab => {
        let indexMatchCaballo = cab.caballo.Nombre.toUpperCase().indexOf(value.toUpperCase());
        let indexMatchEstablo = cab.caballo.Establo ? (cab.caballo.Establo.Nombre.toUpperCase().indexOf(value.toUpperCase())) : -1;
        if (indexMatchCaballo > -1) {
          let textReplace = cab.caballo.Nombre.substring(indexMatchCaballo, indexMatchCaballo + value.length);
          cab.caballo.NombreFilter = cab.caballo.Nombre.replace(textReplace, '<span class="equi-text-black">' + textReplace + '</span>');
        }
        if (cab.caballo.Establo && indexMatchEstablo > -1) {
          let textReplace = cab.caballo.Establo.Nombre.substring(indexMatchEstablo, indexMatchEstablo + value.length);
          cab.caballo.EstabloFilter = cab.caballo.Establo.Nombre.replace(textReplace, '<span class="equi-text-black">' + textReplace + '</span>');
        }
        this.isFilter = true;
        return indexMatchCaballo > -1 || indexMatchEstablo > -1;
      });
    } else {
      this.caballosGrupo = this.caballosGrupoRespaldo;
    }
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
        this.getCaballosForGrupo();
      }
    });
    modal.present();
  }

  selectCaballo(ca: any): void {
    ca.seleccion = !ca.seleccion;
    if (this.mapCaballosGrupo.has(ca.caballo.ID)) {
      this.mapCaballosGrupo.delete(ca.caballo.ID);
    } else {
      this.mapCaballosGrupo.set(ca.caballo.ID, ca.grupoCaballo);
    }
  }

  selectAll(): void {
    let countSeleted = this.caballosGrupoRespaldo.filter(ec => ec.seleccion).length;
    let selectAll: boolean = countSeleted !== this.caballosGrupoRespaldo.length;
    this.caballosGrupoRespaldo.forEach(cg => {
      cg.seleccion = selectAll;
      let hasMap = this.mapCaballosGrupo.has(cg.caballo.ID);
      if (selectAll) {
        if (!hasMap) {
          this.mapCaballosGrupo.set(cg.caballo.ID, cg.grupoCaballo);
        }
      } else {
        this.mapCaballosGrupo.delete(cg.caballo.ID);
      }
    });
  }

  save(): void {
    this.grupo.GrupoCaballo.forEach(gc => {
      if (this.mapCaballosGrupo.has(gc.Caballo_ID)) {
        this.mapCaballosGrupo.get(gc.Caballo_ID).ID = gc.ID;
      }
    });
    this.grupo.GrupoCaballo = Array.from(this.mapCaballosGrupo.values());
    this.commonService.showLoading("");
    this.gruposCaballosService.updateGrupo(this.grupo)
      .then(() => {
        this.events.publish("caballos-grupo:refresh");//Refresco las asignaciones de caballos
        this.events.publish("grupo:refresh"); //Refresco los detalles del grupo
        this.events.publish("grupos:refresh"); //Refresco la lista de grupos
        this.commonService.hideLoading();
        this.navController.pop();
      }).catch(err => {
      console.error(err);
    });
  }

  private getCaballosForGrupo(): void {
    this.loading = true;
    this.caballoService.getAllSerializedByPropietarioId(this.session.PropietarioId, this.parametersFilter)
      .toPromise()
      .then(caballos => {
        this.caballosGrupoRespaldo = caballos.map(c => {
          return {
            caballo: c,
            seleccion: this.mapCaballosGrupo.has(c.ID),
            grupoCaballo: this.mapCaballosGrupo.has(c.ID) ?
              this.mapCaballosGrupo.get(c.ID) : {Caballo_ID: c.ID}
          }
        });
        this.filter(null);
        this.loading = false;
      }).catch(err => {
      console.error(err);
      this.loading = false;
    });
  }
}

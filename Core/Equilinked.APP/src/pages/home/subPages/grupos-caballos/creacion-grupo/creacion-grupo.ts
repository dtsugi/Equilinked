import {Component, OnInit} from "@angular/core";
import {Events, ModalController, NavController} from "ionic-angular";
import {FormBuilder, Validators} from "@angular/forms";
import {CommonService} from "../../../../../services/common.service";
import {SecurityService} from "../../../../../services/security.service";
import {GruposCaballosService} from "../../../../../services/grupos-caballos.service";
import {CaballoService} from "../../../../../services/caballo.service";
import {Grupo} from "../../../../../model/grupo";
import {UserSessionEntity} from "../../../../../model/userSession";
import {LanguageService} from '../../../../../services/language.service';
import {EquiModalFiltroCaballos} from '../../../../../utils/equi-modal-filtro-caballos/filtro-caballos-modal';

@Component({
  templateUrl: "./creacion-grupo.html",
  providers: [LanguageService, CaballoService, CommonService, GruposCaballosService, SecurityService]
})
export class CreacionGrupoPage implements OnInit {
  labels: any = {};
  caballos: Array<any>;
  caballosRespaldo: Array<any>;
  grupo: Grupo;
  grupoCaballosForm: any;
  session: UserSessionEntity;
  isFilter: boolean;
  caballosIds: Array<number>;
  private parametersFilter: Map<string, string>;

  constructor(private caballoService: CaballoService,
              private commonService: CommonService,
              private events: Events,
              private modalController: ModalController,
              private formBuilder: FormBuilder,
              private gruposCaballosService: GruposCaballosService,
              public navController: NavController,
              private securityService: SecurityService,
              private languageService: LanguageService) {
    this.grupo = new Grupo();
    this.caballosIds = new Array<number>();
    this.isFilter = false;
    languageService.loadLabels().then(labels => this.labels = labels);
  }

  ngOnInit(): void {
    this.session = this.securityService.getInitialConfigSession();
    this.grupoCaballosForm = this.formBuilder.group({
      Descripcion: [this.grupo.Descripcion, Validators.required]
    });
    this.getAllCaballosByPropietario();
  }

  selectCaballo(c: any): void {
    c.seleccion = !c.seleccion;
    let position = this.caballosIds.indexOf(c.caballo.ID);
    if(position == -1) {
      this.caballosIds.push(c.caballo.ID);
    } else {
      this.caballosIds.splice(position, 1);
    }
  }

  selectAll(): void {
    let selectAll: boolean = this.countCaballos() !== this.caballosRespaldo.length;
    this.caballosRespaldo.forEach(c => {
      c.seleccion = selectAll;
      let position = this.caballosIds.indexOf(c.caballo.ID);
      if(selectAll) {
        if(position == -1)
          this.caballosIds.push(c.caballo.ID);
      } else {
        this.caballosIds.splice(position, 1);
      }
    });
  }

  filter(evt: any): void {
    this.isFilter = false;
    this.caballosRespaldo.forEach(cab => {
      cab.caballo.NombreFilter = cab.caballo.Nombre;
      cab.caballo.EstabloFilter = cab.caballo.Establo ? cab.caballo.Establo.Nombre : null;
    });
    let value: string = evt ? evt.target.value : null;
    if (value) {
      this.caballos = this.caballosRespaldo.filter(cab => {
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
      this.caballos = this.caballosRespaldo;
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
        this.getAllCaballosByPropietario();
      }
    });
    modal.present();
  }

  save(): void {
    let grupo = {
      GrupoCaballo: this.caballosIds.map(id => {
        return {Caballo_ID: id};
      }),
      Descripcion: this.grupoCaballosForm.value.Descripcion,
      Propietario_ID: this.session.PropietarioId,
      GrupoDefault: false
    };
    this.commonService.showLoading(this.labels["PANT012_ALT_PRO"]);
    this.gruposCaballosService.saveGrupo(grupo).then(resp => {
      this.events.publish("grupos:refresh");
      this.commonService.hideLoading();
      this.navController.pop();
    }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels["PANT012_MSG_ERRGU"]);
    });
  }

  private countCaballos(): number {
    return this.caballosRespaldo.filter(c => c.seleccion).length;
  }

  private getAllCaballosByPropietario(): void {
    this.caballoService.getAllSerializedByPropietarioId(this.session.PropietarioId, this.parametersFilter)
      .subscribe(caballos => {
        this.caballosRespaldo = caballos.map(c => {
          return {caballo: c, seleccion: this.caballosIds.indexOf(c.ID) > -1};
        });
        this.filter(null);
      }, error => {
        console.error(JSON.stringify(error));
      });
  }
}

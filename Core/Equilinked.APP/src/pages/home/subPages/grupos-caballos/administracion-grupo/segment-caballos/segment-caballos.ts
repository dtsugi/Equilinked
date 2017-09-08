import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {AlertController, Events, NavController} from "ionic-angular";
import {CommonService} from "../../../../../../services/common.service";
import {GruposCaballosService} from "../../../../../../services/grupos-caballos.service";
import {FichaCaballoPage} from "../../../../ficha-caballo/ficha-caballo-home";
import {EdicionCaballosGrupoPage} from "./edicion-caballos/edicion-caballos";
import {LanguageService} from '../../../../../../services/language.service';

@Component({
  selector: "segment-caballos-grupo",
  templateUrl: "./segment-caballos.html",
  providers: [LanguageService, CommonService, GruposCaballosService]
})
export class SegmentCaballosGrupo implements OnDestroy, OnInit {
  private caballosGrupo: Array<any>;
  @Input("grupo")
  grupo: any;
  @Input("parametros")
  parametrosCaballos: any;
  labels: any = {};
  caballosGrupoRespaldo: Array<any>;
  loading: boolean;
  isFilter: boolean;

  constructor(private alertController: AlertController,
              private commonService: CommonService,
              private events: Events,
              private gruposCaballosService: GruposCaballosService,
              private navController: NavController,
              private languageService: LanguageService) {
    this.loading = true;
    this.isFilter = false;

    this.caballosGrupo = new Array<any>();
    this.caballosGrupoRespaldo = new Array<any>();
    languageService.loadLabels().then(labels => this.labels = labels);
  }

  ngOnDestroy(): void {
    this.removeEvents();
  }

  ngOnInit(): void {
    this.getAllCaballosGrupo();
    this.addEvents();
    this.parametrosCaballos.getCountSelected = () => this.getCountSelected();
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

  addCaballos(): void {
    this.navController.push(EdicionCaballosGrupoPage, {grupo: JSON.parse(JSON.stringify(this.grupo))});
  }

  select(cg: any): void {
    if (!this.parametrosCaballos.modoEdicion) {
      this.navController.push(FichaCaballoPage, {
        caballoSelected: cg.caballo
      });
    } else {
      cg.seleccion = !cg.seleccion;
    }
  }

  getCountSelected(): number {
    return this.caballosGrupoRespaldo.filter(c => c.seleccion).length;
  }

  selectAll(): void {
    let selectAll: boolean = this.getCountSelected() !== this.caballosGrupoRespaldo.length;
    this.caballosGrupoRespaldo.forEach(n => {
      n.seleccion = selectAll;
    });
  }

  getAllCaballosGrupo(): void {
    this.loading = true;
    this.gruposCaballosService.getCaballosByGroupId(this.grupo.ID)
      .then(caballos => {
        this.loading = false;
        this.caballosGrupoRespaldo = caballos.map(caballo => {
          return {
            seleccion: false,
            caballo: caballo
          };
        });
        this.filter(null);
      }).catch(err => {
      console.error(err);
      this.loading = false;
    });
  }

  private enabledDelete(): void {
    this.caballosGrupoRespaldo.forEach(c => {
      c.seleccion = false;
    });
  }

  private confirmDeleteCaballos(): void {
    this.alertController.create({
      title: this.labels["PANT013_ALT_TIELI"],
      message: this.labels["PANT013_ALT_MSGEL"],
      buttons: [
        {
          text: this.labels["PANT013_BTN_CAN"],
          role: "cancel"
        },
        {
          text: this.labels["PANT013_BTN_ACEP"],
          handler: () => {
            this.commonService.showLoading(this.labels["PANT013_ALT_PRO"]);
            this.gruposCaballosService.deleteAlertasByIds(
              this.grupo.ID, this.caballosGrupoRespaldo.filter(c => c.seleccion).map(c => c.caballo.ID)
            ).then(() => {
              this.getAllCaballosGrupo();
              this.events.publish("grupo:refresh");//Refrescamos el grupo seleccionado
              this.events.publish("grupos:refresh");//Refrescamos la lista de caballos
              this.commonService.hideLoading();
              this.parametrosCaballos.modoEdicion = false;
            }).catch(err => {
              this.commonService.ShowErrorHttp(err, this.labels["PANT013_MSG_ERREL"]);
            });
          }
        }
      ]
    }).present();
  }

  private addEvents(): void {
    this.events.subscribe("caballos-grupo:refresh", () => {
      this.getAllCaballosGrupo();
    });
    this.events.subscribe("caballos-grupo:eliminacion:enabled", () => {
      this.enabledDelete();
    });
    this.events.subscribe("caballos-grupo:eliminacion:confirmed", () => {
      this.confirmDeleteCaballos();
    });
  }

  private removeEvents(): void {
    this.events.unsubscribe("caballos-grupo:refresh");
    this.events.unsubscribe("caballos-grupo:eliminacion:enabled");
    this.events.unsubscribe("caballos-grupo:eliminacion:confirmed");
  }
}

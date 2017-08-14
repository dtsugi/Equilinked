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

  constructor(private alertController: AlertController,
              private commonService: CommonService,
              private events: Events,
              private gruposCaballosService: GruposCaballosService,
              private navController: NavController,
              private languageService: LanguageService) {
    this.caballosGrupo = new Array<any>();
    this.caballosGrupoRespaldo = new Array<any>();
    languageService.loadLabels().then(labels => this.labels = labels);
  }

  ngOnDestroy(): void {
    this.removeEvents();
  }

  ngOnInit(): void {
    this.getAllCaballosGrupo(false);
    this.addEvents();
    this.parametrosCaballos.getCountSelected = () => this.getCountSelected();
  }

  filter(evt: any): void {
    this.caballosGrupo = this.gruposCaballosService.filterCaballosByNombreOrGrupo(evt.target.value, this.caballosGrupoRespaldo);
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

  getAllCaballosGrupo(loading: boolean): void {
    console.info("Ejelee!");
    if (loading)
      this.commonService.showLoading(this.labels["PANT013_ALT_PRO"]);
    this.gruposCaballosService.getCaballosByGroupId(this.grupo.ID)
      .then(caballos => {
        if (loading)
          this.commonService.hideLoading();
        this.caballosGrupoRespaldo = caballos.map(caballo => {
          return {
            seleccion: false,
            caballo: caballo
          };
        });
        this.caballosGrupo = this.caballosGrupoRespaldo;
      }).catch(err => {
      console.error(err);
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
              this.getAllCaballosGrupo(false);
              this.events.publish("grupos:refresh");
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
      this.getAllCaballosGrupo(false);
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

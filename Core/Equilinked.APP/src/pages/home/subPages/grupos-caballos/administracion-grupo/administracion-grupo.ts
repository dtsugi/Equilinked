import {Component, OnInit, OnDestroy, ViewChild} from "@angular/core";
import {Events, NavController, NavParams, PopoverController, Slides} from "ionic-angular";
import {CommonService} from "../../../../../services/common.service";
import {GruposCaballosService} from "../../../../../services/grupos-caballos.service";
import {SecurityService} from "../../../../../services/security.service";
import {UserSessionEntity} from "../../../../../model/userSession";
import {OpcionesFichaGrupo} from "./opciones-ficha/opciones-ficha";
import {LanguageService} from '../../../../../services/language.service';
import {SegmentCaballosGrupo} from "./segment-caballos/segment-caballos";

@Component({
  templateUrl: "./administracion-grupo.html",
  providers: [LanguageService, CommonService, GruposCaballosService, SecurityService]
})
export class AdministracionGrupoPage implements OnInit, OnDestroy {
  private grupoId: number;
  private session: UserSessionEntity;
  private slidesMap: Map<string, number>;
  private indexSlidesMap: Map<number, string>;
  private lastSlide: string;
  @ViewChild(Slides) slides: Slides;
  @ViewChild(SegmentCaballosGrupo) caballosGrupo: SegmentCaballosGrupo;
  labels: any = {};
  grupo: any;
  segmentSelection: string;
  parametrosCaballos: any;

  constructor(private commonService: CommonService,
              private events: Events,
              private navController: NavController,
              private navParams: NavParams,
              private popoverController: PopoverController,
              private gruposCaballosService: GruposCaballosService,
              private securityService: SecurityService,
              private languageService: LanguageService) {
    this.slidesMap = new Map<string, number>();
    this.indexSlidesMap = new Map<number, string>();
    this.segmentSelection = "ficha";
    this.grupo = {};
    this.parametrosCaballos = {modoEdicion: false, getCountSelected: null, grupoDefault: false};
  }

  ngOnInit(): void {
    this.session = this.securityService.getInitialConfigSession();
    this.grupoId = this.navParams.get("grupoId");
    this.lastSlide = "ficha";
    this.slidesMap.set("ficha", 0);
    this.slidesMap.set("caballos", 1);
    this.indexSlidesMap.set(0, "ficha");
    this.indexSlidesMap.set(1, "caballos");
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
      this.getInfoGrupo(true);
    });
    this.addEvents();
  }

  ngOnDestroy(): void {
    this.removeEvents();
  }

  showSlide(slide: string) {
    if (slide != this.lastSlide) {
      this.slides.slideTo(this.slidesMap.get(slide), 500);
      this.lastSlide = slide;
      this.loadInfoSegment();
    }
  }

  slideChanged(slide: any) {
    let tab: string = this.indexSlidesMap.get(slide.realIndex);
    if (this.lastSlide != tab) {
      this.segmentSelection = tab;
      this.lastSlide = tab;
      this.loadInfoSegment();
    }
  }

  goBack(): void {
    this.navController.pop();
  }

  /*Muestra las opciones cuando se encuentra activa "FICHA"*/
  showOptionsFicha(ev: any): void {
    let popover = this.popoverController.create(OpcionesFichaGrupo, {
      navCtrlGrupo: this.navController,
      grupo: JSON.parse(JSON.stringify(this.grupo))
    });
    popover.present({
      ev: ev
    });
  }

  /*Activa la seleccion de cabalos para eliminacion en "CABALLOS" */
  enabledDeleteCaballos(): void {
    this.parametrosCaballos.modoEdicion = true;
    this.events.publish("caballos-grupo:eliminacion:enabled");
  }

  /*Desactiva la seleccion de cabalos para eliminacion en "CABALLOS" */
  disabledDeleteCaballos(): void {
    this.parametrosCaballos.modoEdicion = false;
  }

  /*Solicitar confirmacion de eliminacion en "CABALLOS"*/
  delete(): void {
    this.events.publish("caballos-grupo:eliminacion:confirmed");
  }

  private loadInfoSegment(): void {
    if (this.segmentSelection == "caballos") {
      this.caballosGrupo.getAllCaballosGrupo();
    }
  }

  private getInfoGrupo(showLoading: boolean): void {
    if (showLoading)
      this.commonService.showLoading(this.labels["PANT013_ALT_PRO"]);
    this.gruposCaballosService.getGrupoById(this.grupoId)
      .then(grupo => {
        this.grupo = grupo;
        this.parametrosCaballos.grupoDefault = grupo.GrupoDefault;
        if (showLoading)
          this.commonService.hideLoading();
      }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels["PANT013_MSG_ERRCG"]);
    });
  }

  private addEvents(): void {
    this.events.subscribe("grupo:refresh", () => {
      this.getInfoGrupo(false);
    });
  }

  private removeEvents(): void {
    this.events.unsubscribe("grupo:refresh");
  }
}

import {Component, OnInit, ViewChild} from '@angular/core';
import {Events, NavController, NavParams} from 'ionic-angular';
import {UserSessionEntity} from "../../../../../../model/userSession";
import {GruposCaballosService} from '../../../../../../services/grupos-caballos.service';
import {CommonService} from "../../../../../../services/common.service";
import {SecurityService} from "../../../../../../services/security.service";
import {LanguageService} from "../../../../../../services/language.service";
import {EquiGallery} from '../../../../../../utils/equi-gallery/equi-gallery';

@Component({
  templateUrl: "./foto-grupo.html",
  providers: [LanguageService, GruposCaballosService, CommonService, SecurityService]
})
export class FotoGrupoPage implements OnInit {
  private session: UserSessionEntity;
  private photoTemp: any;
  @ViewChild(EquiGallery) equiGallery: EquiGallery;
  grupoId: number;
  photoBase64: string;
  modeEdition: boolean;
  photoChanged: boolean;
  options: any;
  labels: any = {};

  constructor(private navController: NavController,
              private gruposCaballosService: GruposCaballosService,
              private commonService: CommonService,
              private events: Events,
              private navParams: NavParams,
              private securityService: SecurityService,
              private languageService: LanguageService) {
    this.modeEdition = false;
    this.photoChanged = false;
  }

  ngOnInit(): void {
    this.session = this.securityService.getInitialConfigSession();
    this.grupoId = this.navParams.get("grupoId");
    this.photoBase64 = this.navParams.get("photoBase64");
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
    });
    this.options = {};
  }

  protected selectPhoto(photo: any) {
    this.photoTemp = photo.image;
    this.photoBase64 = photo.image.base64;
    this.photoChanged = true;
    this.modeEdition = false;
  }

  public edit(): void {
    this.equiGallery.ngOnInit();
    this.modeEdition = true;
  }

  public update(): void {
    this.commonService.showLoading("Procesando... ");
    this.gruposCaballosService.updatePhoto(this.session.PropietarioId, this.grupoId, this.photoTemp.blob, this.photoTemp.name)
      .then(() => {
        this.commonService.ShowInfo("La foto del grupo fue actualizada");
        this.navController.pop().then(() => {
          this.events.publish("grupo:refresh");
        })
      }).catch(err => {
      this.commonService.ShowErrorHttp(err, "Error al actualizar foto del grupo");
    });
  }

  public cancel(): void {
    if (this.modeEdition) {
      this.modeEdition = false;
    } else {
      this.navController.pop();
    }
  }
}

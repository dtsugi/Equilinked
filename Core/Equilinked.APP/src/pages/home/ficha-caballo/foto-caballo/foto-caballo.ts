import {Component, OnInit, ViewChild} from '@angular/core';
import {Events, NavController, NavParams} from 'ionic-angular';
import {UserSessionEntity} from "../../../../model/userSession";
import {CaballoService} from '../../../../services/caballo.service';
import {CommonService} from "../../../../services/common.service";
import {SecurityService} from "../../../../services/security.service";
import {LanguageService} from "../../../../services/language.service";
import {EquiGallery} from '../../../../utils/equi-gallery/equi-gallery';

@Component({
  templateUrl: "./foto-caballo.html",
  providers: [LanguageService, CaballoService, CommonService, SecurityService]
})
export class FotoCaballoPage implements OnInit {
  private session: UserSessionEntity;
  private photoTemp: any;
  @ViewChild(EquiGallery) equiGallery: EquiGallery;
  caballoId: number;
  photoBase64: string;
  modeEdition: boolean;
  photoChanged: boolean;
  options: any;
  labels: any = {};

  constructor(private navController: NavController,
              private caballoService: CaballoService,
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
    this.caballoId = this.navParams.get("caballoId");
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
    this.commonService.showLoading("Procesando...");
    this.caballoService.updatePhoto(this.session.PropietarioId, this.caballoId, this.photoTemp.blob, this.photoTemp.name)
      .then(() => {
        this.commonService.ShowInfo("La foto del caballo fue actualizada");
        this.navController.pop().then(() => {
          this.events.publish("caballo-ficha:refresh");
        })
      }).catch(err => {
      this.commonService.ShowErrorHttp(err, "Error al actualizar foto del caballo");
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

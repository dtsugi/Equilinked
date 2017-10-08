import {Component, OnInit} from '@angular/core';
import {Events, NavController, NavParams} from 'ionic-angular';
import {UserSessionEntity} from "../../../../model/userSession";
import {CaballoService} from '../../../../services/caballo.service';
import {CommonService} from "../../../../services/common.service";
import {SecurityService} from "../../../../services/security.service";
import {LanguageService} from "../../../../services/language.service";
import {Camera} from '@ionic-native/camera';
import {DomSanitizer} from '@angular/platform-browser'; 

@Component({
  templateUrl: "./foto-caballo.html",
  providers: [LanguageService, CaballoService, CommonService, SecurityService]
})
export class FotoCaballoPage implements OnInit {
  private session: UserSessionEntity;
  private photoTemp: any;
  caballoId: number;
  photoBase64: string;
  photoChanged: boolean;
  photoLoading: boolean;
  labels: any = {};

  constructor(private navController: NavController,
              private caballoService: CaballoService,
              private camera: Camera,
              private commonService: CommonService,
              private events: Events,
              public domSanitizer: DomSanitizer,
              private navParams: NavParams,
              private securityService: SecurityService,
              private languageService: LanguageService) {
    this.photoChanged = false;
    this.photoLoading = true;
  }

  ngOnInit(): void {
    this.session = this.securityService.getInitialConfigSession();
    this.caballoId = this.navParams.get("caballoId");
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
      this.getFoto(this.session.PropietarioId, this.caballoId);
    });
  }

  private getFoto(idPropietario: number, idCaballo: number): void {
    this.caballoService.getPhoto(idPropietario, idCaballo)
      .then(foto => {
        this.photoBase64 = foto && foto.FotoPerfil ? "data:image/jpeg;base64," + foto.FotoPerfil : null;
        this.photoLoading = false;
      }).catch(err => {
      this.photoLoading = false;
      this.commonService.ShowErrorHttp(err, "Error al cargar la foto");
    });
  }

  public edit(): void {
    this.camera.getPicture({
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }).then(imageData => {
      if (imageData) {
        let base64: string = "data:image/jpeg;base64," + imageData;
        this.photoTemp = {
          name: new Date().getTime().toString() + ".jpeg",
          base64: base64,
          blob: this.base64toBlob(base64)
        };
        this.photoBase64 = base64;
        this.photoChanged = true;
      }
    }).catch(err => {
      console.error(JSON.stringify(err));
    });
  }

  public update(): void {
    this.caballoService.updatePhoto(this.session.PropietarioId, this.caballoId, this.photoTemp.blob, this.photoTemp.name)
      .then(() => {
        this.commonService.ShowInfo("La foto del caballo fue actualizada");
        this.events.publish("caballo-ficha:refresh");
      }).catch(err => {
      this.commonService.ShowErrorHttp(err, "Error al actualizar foto del caballo");
    });
    this.navController.pop();
  }

  public cancel(): void {
    this.navController.pop();
  }

  private base64toBlob(base64: string) {
    var byteString = atob(base64.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab]);
  }
}

import {Component, OnInit} from "@angular/core";
import {NavParams, ViewController} from "ionic-angular";
import {CommonService} from "../../services/common.service";
import {LanguageService} from '../../services/language.service';
import {Camera} from '@ionic-native/camera';
import {DomSanitizer} from '@angular/platform-browser'; 

@Component({
  templateUrl: "./select-image-modal.html",
  providers: [LanguageService, CommonService]
})
export class EquiSelectImageModal implements OnInit {
  private photo: any;//name, base64, blob
  readonly: boolean;
  labels: any = {};

  constructor(private camera: Camera,
              private languageService: LanguageService,
              public navParams: NavParams,
              public domSanitizer: DomSanitizer,
              public viewController: ViewController) {
  }

  ngOnInit(): void {
    this.photo = this.navParams.get("photo");
    this.readonly = this.navParams.get("readonly");
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
    });
  }

  back(): void {
    this.viewController.dismiss(null);
  }

  selectImage(): void {
    this.camera.getPicture({
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }).then(imageData => {
      if (imageData) {
        let base64: string = "data:image/jpeg;base64," + imageData;
        this.photo.name = new Date().getTime().toString() + ".jpeg";
        this.photo.base64 = base64;
        this.photo.blob = this.base64toBlob(base64);
      }
    }).catch(err => {
      console.error(JSON.stringify(err));
    });
  }

  remove(): void {
    this.photo.name = null;
    this.photo.base64 = null;
    this.photo.blob = null;
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

import {Component, OnInit, ViewChild} from "@angular/core";
import {NavParams, ViewController} from "ionic-angular";
import {CommonService} from "../../services/common.service";
import {LanguageService} from '../../services/language.service';
import {EquiGallery} from '../equi-gallery/equi-gallery';

@Component({
  templateUrl: "./select-image-modal.html",
  providers: [LanguageService, CommonService]
})
export class EquiSelectImageModal implements OnInit {
  private photo: any;//name, base64, blob
  options: any;
  modeEdition: boolean;
  readonly: boolean;
  @ViewChild(EquiGallery) gallery: EquiGallery;
  labels: any = {};

  constructor(private commonService: CommonService,
              private languageService: LanguageService,
              public navParams: NavParams,
              public viewController: ViewController) {
    this.modeEdition = false;
    this.options = {};
  }

  ngOnInit(): void {
    this.photo = this.navParams.get("photo");
    this.readonly = this.navParams.get("readonly");
    console.info(JSON.stringify(this.photo));
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
    });
  }

  back(): void {
    if (this.modeEdition) {
      this.modeEdition = false;
    } else {
      this.viewController.dismiss(null);
    }
  }

  setReadOnly(readOnly: boolean): void {
    this.readonly = readOnly;
  }

  selectImage(): void {
    this.gallery.ngOnInit();
    this.modeEdition = true;
  }

  remove(): void {
    this.photo.name = null;
    this.photo.base64 = null;
    this.photo.blob = null;
  }

  protected selectPhoto(photo: any) {
    this.photo.name = photo.image.name;
    this.photo.base64 = photo.image.base64;
    this.photo.blob = photo.image.blob;
    this.modeEdition = false;//justar vista
  }
}

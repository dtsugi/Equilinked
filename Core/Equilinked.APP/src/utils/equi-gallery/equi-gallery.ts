import {Component, EventEmitter, OnInit, Input, Output} from "@angular/core";
import {PhotoLibrary} from "@ionic-native/photo-library";

@Component({
  selector: "equi-gallery",
  templateUrl: "./equi-gallery.html"
})
export class EquiGallery implements OnInit {
  private images: Array<any>;
  private image: any;
  @Input("options") options: any;
  @Output("selectImage") eventSelectImage = new EventEmitter();

  constructor(private photoLibrary: PhotoLibrary) {
    this.images = new Array<any>();
  }

  ngOnInit(): void {
    this.image = null;
    this.loadGallery();
  }

  private getSelectedPhoto(): any {
    return this.image;
  }

  protected selectImage(image: any): void {
    if (!this.image || (this.image && this.image.fileName != image.fileName)) {
      this.options.selectedOne = true;
      this.photoLibrary.getPhoto(image).then(photo => {
        let reader: FileReader = new FileReader();
        reader.readAsDataURL(photo);
        reader.onloadend = () => {
          let photoSelected: any = {
            name: image.fileName,
            blob: photo,
            base64: reader.result
          };
          this.image = photoSelected;
          this.eventSelectImage.emit({image: photoSelected});
        };
      }).catch(err => {
        console.error(err);
      });
    } else {
      this.options.selectedOne = false;
      this.image = null;
    }
  }

  private loadGallery(): void {
    this.photoLibrary.requestAuthorization().then(() => {
      this.photoLibrary.getLibrary().subscribe({
        next: library => {
          if (Array.isArray(library)) {
            library.forEach(item => {
              this.images.push(item);
            });
          } else {
            this.images.push(library);
          }
        },
        error: err => {
          console.error(err)
        },
        complete: () => {
          console.info("Todas las imagenes? " + this.images.length + " xxx");
          console.info(JSON.stringify(this.images));
        }
      });
    }).catch(err => console.log('permissions weren\'t granted'));
  }
}

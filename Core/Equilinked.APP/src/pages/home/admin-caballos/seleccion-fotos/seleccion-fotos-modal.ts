import {Component, OnInit} from "@angular/core";
import {ViewController} from "ionic-angular";
import {Http,} from "@angular/http";
import {PhotoLibrary} from "@ionic-native/photo-library";

@Component({
  templateUrl: "./seleccion-fotos-modal.html"
})
export class SeleccionFotosModal implements OnInit {
  images: Array<any>;
  image: string;
  result: string;
  seletected: Array<any>;

  constructor(private photoLibrary: PhotoLibrary,
              private viewController: ViewController,
              private http: Http) {
    this.images = new Array<any>();
    this.seletected = new Array<any>();
  }

  ngOnInit(): void {
    this.loadImages();
  }

  accept(): void {
    let url: string = "http://192.168.1.101:51082/api/test/file";
    let formData: FormData = new FormData();
    formData.append("Nombre", "Jesus");
    this.seletected.forEach((image, index) => {
      formData.append("file" + index, image.photo, image.image);
    });

    //formData.append("file", photo, image.fileName);
    //headers.append('enctype', 'multipart/form-data');
    //let headers = new Headers({ 'enctype': 'multipart/form-data' });
    //let headers = new Headers({ 'Content-Type': 'multipart/form-data' }); // ... Set content type to JSON
    //let options = new RequestOptions({ headers: headers });
    this.http.post(url, formData).toPromise()
      .then(() => {
        console.info("Enviado!");
        this.viewController.dismiss();

      }).catch(err => {
      console.error(JSON.stringify(err));
    });
  }

  cancel(): void {
    this.viewController.dismiss();
  }

  selectImage(image: any): void {
    let url: string = "http://192.168.1.101:51082/api/test/file";
    this.photoLibrary.getPhoto(image).then(photo => {
      let reader: FileReader = new FileReader();
      reader.readAsDataURL(photo);
      reader.onloadend = () => {
        console.info(reader.result);
        this.result = reader.result;
        this.image = reader.result;
      };

      this.seletected.push({image: image.fileName, photo: photo});

      /*
      let formData: FormData = new FormData();
      formData.append("file", photo, image.fileName);
      formData.append("Nombre", "Jesus");
      this.http.post(url, formData).toPromise()
        .then(() => {
          console.info("Enviado!");
        }).catch(err => {
        console.error(JSON.stringify(err));
      });*/
      /*
      let reader: FileReader = new FileReader();
      reader.readAsDataURL(photo);
      reader.onloadend = () => {
          console.info(reader.result);
          this.image = reader.result;
      };*/
    }).catch(err => {
      console.error(err);
    });
  }

  private loadImages(): void {
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

import {Component, OnInit, ViewChild} from "@angular/core";
import {NavParams, ViewController, Searchbar} from "ionic-angular";
import {GooglePlacesService} from "../../../../../../services/google-places.service";
import {LanguageService} from "../../../../../../services/language.service";

@Component({
  templateUrl: "./busqueda-posiciones-modal.html",
  providers: [GooglePlacesService, LanguageService]
})
export class BusquedaPosicionModal implements OnInit {
  private search: any;
  @ViewChild(Searchbar) searchbar: Searchbar;
  labels: any = {};
  places: Array<any>;
  loading: boolean;

  constructor(public navParams: NavParams,
              public viewController: ViewController,
              private googlePlacesService: GooglePlacesService,
              private languageService: LanguageService) {
  }

  ngOnInit(): void {
    this.search = this.navParams.get("search");
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
      this.searchPositions();
      let ref = this;
      setTimeout(function () {
        ref.searchbar.setFocus();
      }, 1000);
    });
  }

  cancel(): void {
    this.viewController.dismiss(null);
  }

  selectPlace(place: any): void {
    this.viewController.dismiss(place);
  }

  searchPositions(): void {
    if (this.search.value != "") {
      this.loading = true;
      this.googlePlacesService.getPlacesByAddress(this.search.value)
        .then(response => {
          this.loading = false;
          if (response.status == "OK") {
            this.places = response.results;
          } else {
            this.places = [];
          }
        }).catch(err => {
        console.error(err);
        this.loading = false;
      });
    }
  }
}

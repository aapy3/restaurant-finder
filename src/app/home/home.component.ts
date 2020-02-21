import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil, take } from 'rxjs/operators';
import { ApiHitService } from '../apiHit.service';
import { Router } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material';
interface Bank {
  id: string;
  name: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  @ViewChild('multiSelect') multiSelect: MatSelect;
  public cityArray = [];
  public cityName: string = '';
  searchCityArray: any = [];
  /** control for the selected bank for multi-selection */
  public bankMultiCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword multi-selection */
  public bankMultiFilterCtrl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  public filteredBanksMulti: ReplaySubject<Bank[]> = new ReplaySubject<Bank[]>(1);

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  public banks: Bank[] = [
    { name: 'Bank A (Switzerland)', id: 'A' },
    { name: 'Bank B (Switzerland)', id: 'B' },
    { name: 'Bank C (France)', id: 'C' },
    { name: 'Bank D (France)', id: 'D' },
    { name: 'Bank E (France)', id: 'E' },
    { name: 'Bank F (Italy)', id: 'F' },
    { name: 'Bank G (Italy)', id: 'G' },
    { name: 'Bank H (Italy)', id: 'H' },
    { name: 'Bank I (Italy)', id: 'I' },
    { name: 'Bank J (Italy)', id: 'J' },
    { name: 'Bank K (Italy)', id: 'K' },
    { name: 'Bank L (Germany)', id: 'L' },
    { name: 'Bank M (Germany)', id: 'M' },
    { name: 'Bank N (Germany)', id: 'N' },
    { name: 'Bank O (Germany)', id: 'O' },
    { name: 'Bank P (Germany)', id: 'P' },
    { name: 'Bank Q (Germany)', id: 'Q' },
    { name: 'Bank R (Germany)', id: 'R' }
  ]

  constructor(private hit: ApiHitService, private router: Router, public ngProgress: NgProgress) {
  }

  ngOnInit() {

    this.bankMultiCtrl.setValue([this.banks[10], this.banks[11], this.banks[12]]);

    // load the initial bank list
    this.filteredBanksMulti.next(this.banks.slice());

    // listen for search field value changes
    this.bankMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanksMulti();
      });

    this.cityArray = [
      {
        "entity_type": "city",
        "entity_id": 4,
        "title": "Bangalore",
        "latitude": 12.971606,
        "longitude": 77.594376,
        "city_id": 4,
        "city_name": "Bengaluru",
        "country_id": 1,
        "country_name": "India"
      },
      {
        "entity_type": "city",
        "entity_id": 1,
        "title": "Delhi NCR",
        "latitude": 28.625789,
        "longitude": 77.210276,
        "city_id": 1,
        "city_name": "Delhi NCR",
        "country_id": 1,
        "country_name": "India"
      },
      {
        "entity_type": "city",
        "entity_id": 6,
        "title": "Hyderabad",
        "latitude": 17.366,
        "longitude": 78.476,
        "city_id": 6,
        "city_name": "Hyderabad",
        "country_id": 1,
        "country_name": "India"
      },
      {
        "entity_type": "city",
        "entity_id": 5,
        "title": "Pune",
        "latitude": 18.520469,
        "longitude": 73.85662,
        "city_id": 5,
        "city_name": "Pune",
        "country_id": 1,
        "country_name": "India"
      },
      {
        "entity_type": "city",
        "entity_id": 3,
        "title": "Mumbai",
        "latitude": 19.017656,
        "longitude": 72.856178,
        "city_id": 3,
        "city_name": "Mumbai",
        "country_id": 1,
        "country_name": "India"
      },
    ]
  }

  protected filterBanksMulti() {
    if (!this.banks) {
      return;
    }
    // get the search keyword
    let search = this.bankMultiFilterCtrl.value;
    
    if (!search) {
      this.filteredBanksMulti.next(this.banks.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBanksMulti.next(
      this.banks.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => this.searchCityArray.length == 0 ? []
        : this.searchCityArray.filter(v => v.city_name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formatter = (x: { city_name: string }) => x.city_name;


  searchCity() {
    // this.cityName = document.getElementById('typeahead-template')['value'];
    if (this.cityName.length > 2) {
      let data = {
        'cityName': this.cityName
      }
      this.hit.getCities(data).subscribe((result) => {
        let data = JSON.parse(result['_body']).location_suggestions;
        this.searchCityArray = data;
      })
    }

  }

  onSelectTypeahead(data) {
    data.limit = 20;
    this.searchRestaurants(data);
  }

  searchRestaurants(data) {
    data.limit = 20;
    this.ngProgress.start();
    this.hit.getRestaurants(data).subscribe((result) => {
      if (result.status == 200) {
        let tmp_data = JSON.parse(result['_body']);
        tmp_data.limit = 20;
        tmp_data.latitude = data.latitude;
        tmp_data.longitude = data.longitude;
        this.hit.sendRestaurants(tmp_data);
        this.router.navigate(['/restaurants']);
        this.ngProgress.done();
      }
    })
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        if (lat && lng) {
          let data = {
            lat: lat,
            lng: lng
          }
          this.hit.getCities(data).subscribe((result) => {
            let data = JSON.parse(result['_body']).location_suggestions[0];
            data.limit = 20;
            this.searchRestaurants(data);
          })
        }
      })
    } else {
      console.log('error')
    }
  }
  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected setInitialValue() {
    this.filteredBanksMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.multiSelect.compareWith = (a: Bank, b: Bank) => a && b && a.id === b.id;
      });
  }
}

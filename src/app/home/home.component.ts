import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { ApiHitService } from '../apiHit.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public cityArray = [];
  public cityName;
  constructor(private hit : ApiHitService,private router: Router,) { 
  }

  ngOnInit() {
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

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 1 ? []
        : this.cityArray.filter(v =>{
          console.log(v)
          return v.city_name.toLowerCase().indexOf(term.toLowerCase()) > -1}).slice(0, 10)))
        

    // searchCity(){
    //   console.log(this.cityName);
    // }

    searchRestaurants(data){
      this.hit.getRestaurants(data).subscribe((result) => {
        if(result.status == 200){
          this.router.navigate(['/restaurants']);
          this.hit.sendRestaurants(JSON.parse(result['_body']));
        }
      })
    }

    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( position => {
          console.log(position.coords.latitude,position.coords.longitude);
          let lat = position.coords.latitude;
          let lng = position.coords.longitude;
          if(lat && lng){
            let data = {
              lat : lat,
              lng: lng
            }
            this.hit.getCities(data).subscribe((result) => {
              console.log(result)
              let data = JSON.parse(result['_body']).location_suggestions[0];
              this.searchRestaurants(data);
            })
          }
        })
      } else { 
          console.log('error')
      }
  }


}

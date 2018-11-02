import { Component, OnInit } from '@angular/core';
import { ApiHitService } from '../apiHit.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.scss']
})
export class RestaurantListComponent implements OnInit {
  restaurantsArray: any;
  restaurantsCount: any;
  restaurantsTotalCount: any;

  constructor(private hit: ApiHitService, private router: Router, ) {

  }

  ngOnInit() {
    if (this.hit.listRestaurants()) {
      this.restaurantsArray = this.hit.listRestaurants().restaurants;
      this.restaurantsCount = this.hit.listRestaurants().results_shown;
      this.restaurantsTotalCount = this.hit.listRestaurants().results_found;
      console.log(this.restaurantsArray)
    }
    else {
      this.router.navigate(['/home'])
    }

  }

  getRestaurantDetails(data){
    this.hit.getDetails(data).subscribe((result) => {
      if(result.status == 200){
        console.log(result)
        this.router.navigate(['/restaurant-details']);
        this.hit.restaurantDetails(JSON.parse(result['_body']));
      }
    })
  }

}

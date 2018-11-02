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
      this.restaurantsArray = this.restaurantsArray.map(function (el) {
        var o = Object.assign({}, el);
        if (o.restaurant.isLike == true) {
          o.restaurant.isLike = true;
        }
        else {
          o.restaurant.isLike = false;
        }
        return o;
      })
      this.restaurantsCount = this.hit.listRestaurants().results_shown;
      this.restaurantsTotalCount = this.hit.listRestaurants().results_found;
    }
    else {
      this.router.navigate(['/home'])
    }

  }

  getRestaurantDetails(data) {
    this.hit.getDetails(data).subscribe((result) => {
      if (result.status == 200) {
        this.router.navigate(['/restaurant-details']);
        let tmp_data = JSON.parse(result['_body']);
        tmp_data.isLike = data.restaurant.isLike;
        this.hit.restaurantDetails(tmp_data);
      }
    })
  }

  like(i) {
    this.restaurantsArray[i].restaurant.isLike = !this.restaurantsArray[i].restaurant.isLike;
  }

}

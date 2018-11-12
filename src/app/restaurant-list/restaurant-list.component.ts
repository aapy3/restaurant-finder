import { Component, OnInit } from '@angular/core';
import { ApiHitService } from '../apiHit.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.scss']
})
export class RestaurantListComponent implements OnInit {
  restaurantsArray: any = [];
  restaurantsCount: any;
  restaurantsTotalCount: any;
  sum: number = 20;
  direction: string = '';
  limit = 20;
  latitude: any;
  longitude: any;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  constructor(private hit: ApiHitService, private router: Router, ) {
    this.appendItems(0, this.sum);
  }

  ngOnInit() {
    if (this.hit.listRestaurants()) {
      this.limit = this.hit.listRestaurants().limit;
      this.latitude = this.hit.listRestaurants().latitude;
      this.longitude = this.hit.listRestaurants().longitude;
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

  addItems(startIndex, endIndex, _method) {
    if(this.restaurantsArray.length>0){
      for (let i = 0; i < this.sum; ++i) {
        this.restaurantsArray[_method]([i, ' ', this.hit.listRestaurants().restaurants].join(''));
      }
    }
  }
  
  appendItems(startIndex, endIndex) {
    this.addItems(startIndex, endIndex, 'push');
  }
  
  prependItems(startIndex, endIndex) {
    this.addItems(startIndex, endIndex, 'unshift');
  }

  onScrollDown () {
    this.limit = this.limit + 20;
    console.log('scrolled down!!');
    let data = {
      limit: this.limit,
      latitude: this.latitude,
      longitude: this.longitude
    }
    this.hit.getRestaurants(data).subscribe((result) => {
      let data = JSON.parse(result['_body']);
      this.restaurantsArray = data.restaurants;
      // this.restaurantsArray = this.restaurantsArray.map(function (el) {
      //   var o = Object.assign({}, el);
      //   if (o.restaurant.isLike == true) {
      //     o.restaurant.isLike = true;
      //   }
      //   else {
      //     o.restaurant.isLike = false;
      //   }
      //   return o;
      // });
      console.log(this.restaurantsArray)
      this.restaurantsCount = data.results_shown;
      this.restaurantsTotalCount = data.results_found;
    });
    // add another 20 items
    const start = this.sum;
    this.sum += 20;
    this.appendItems(start, this.sum);
    
    this.direction = 'down'
  }
  
  onUp() {
    console.log('scrolled up!');
    if(this.limit >= 20){
      this.limit = this.limit - 20;
    }
    else{
      this.limit = 20;
    }
    this.hit.getRestaurants(this.limit);

    if (this.hit.listRestaurants()) {
      this.limit = this.hit.listRestaurants().limit;
      this.latitude = this.hit.listRestaurants().latitude;
      this.longitude = this.hit.listRestaurants().longitude;
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
    const start = this.sum;
    this.sum += 20;
    this.prependItems(start, this.sum);
  
    this.direction = 'up';
  }

}

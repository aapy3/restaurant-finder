import { Component, OnInit } from '@angular/core';
import { ApiHitService } from '../apiHit.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['./restaurant-detail.component.scss']
})
export class RestaurantDetailComponent implements OnInit {
  placeDetails: any;
  reviews: any;
  menu: any;

  constructor(private hit: ApiHitService, private router: Router,) { }

  ngOnInit() {
    if (this.hit.sendDetails()) {
      console.log(this.hit.sendDetails())
      this.placeDetails = this.hit.sendDetails();
      this.hit.getReviews(this.placeDetails.id).subscribe((result) => {
          if(result.status == 200){
            this.reviews = JSON.parse(result['_body']);  
            console.log(this.reviews)
          }
          else{
            this.reviews = undefined
          }
      })
      this.hit.getMenu(this.placeDetails.id).subscribe((result) => {
        if(result.status == 200){
          this.menu = JSON.parse(result['_body']);  
          console.log(this.menu)
        }
        else{
          this.menu = undefined
        }
    })
    }
    else {
      this.router.navigate(['/home'])
    }
  }

}

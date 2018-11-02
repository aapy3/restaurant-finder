import { Component, OnInit } from '@angular/core';
import { ApiHitService } from '../apiHit.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['./restaurant-detail.component.scss']
})
export class RestaurantDetailComponent implements OnInit {
  placeDetails: any;
  reviews: any;
  menu: any;
  pageEvent: PageEvent;
  limit: number = 5;
  skip: number = 0;

  constructor(private hit: ApiHitService, private router: Router,) { }

  ngOnInit() {
    if (this.hit.sendDetails()) {
      this.placeDetails = this.hit.sendDetails();
      this.hit.getReviews(this.placeDetails.id,this.limit,this.skip).subscribe((result) => {
          if(result.status == 200){
            this.reviews = JSON.parse(result['_body']);
          }
          else{
            this.reviews = undefined;
          }
      });
      this.hit.getMenu(this.placeDetails.id).subscribe((result) => {
        if(result.status == 200){
          this.menu = JSON.parse(result['_body']);
        }
        else{
          this.menu = undefined;
        }
    })
    }
    else {
      this.router.navigate(['/home'])
    }
  }

  changePage(event){
    this.pageEvent = event;
    this.skip = this.limit * this.pageEvent.pageIndex;
    this.hit.getReviews(this.placeDetails.id,this.limit,this.skip).subscribe((result) => {
      if(result.status == 200){
        this.reviews = JSON.parse(result['_body']);
        console.log(this.reviews)
      }
      else{
        this.reviews = undefined;
      }
  });
  }

}
